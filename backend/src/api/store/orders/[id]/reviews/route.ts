import type { MedusaRequest, MedusaResponse } from "@medusajs/framework/http"
import {
  ContainerRegistrationKeys,
  MedusaError,
  Modules,
} from "@medusajs/framework/utils"
import { getOrderDetailWorkflow } from "@medusajs/core-flows"
import { appendCustomerReview, parseReviewsFromMetadata } from "../../../../../lib/product-review-metadata"

type ReviewBody = {
  product_id?: string
  rating?: number
  comment?: string
}

async function assertCustomerOwnsOrder(req: MedusaRequest) {
  const customerId = (req as { auth_context?: { actor_id?: string } })
    .auth_context?.actor_id

  if (!customerId) {
    throw new MedusaError(MedusaError.Types.UNAUTHORIZED, "Sign in required")
  }

  const { result } = await getOrderDetailWorkflow(req.scope).run({
    input: {
      fields: [
        "id",
        "customer_id",
        "email",
        "payment_status",
        "status",
        "items.*",
      ],
      order_id: req.params.id,
      filters: {
        is_draft_order: false,
        customer_id: customerId,
      },
    },
  })

  if (!result?.id || result.customer_id !== customerId) {
    throw new MedusaError(
      MedusaError.Types.NOT_FOUND,
      `Order with id ${req.params.id} was not found`
    )
  }

  return { customerId, order: result }
}

export async function GET(req: MedusaRequest, res: MedusaResponse) {
  const { customerId, order } = await assertCustomerOwnsOrder(req)
  const query = req.scope.resolve(ContainerRegistrationKeys.QUERY)
  const productIds = [
    ...new Set(
      (order.items || [])
        .map((item) => item?.product_id)
        .filter((id): id is string => Boolean(id))
    ),
  ]

  if (!productIds.length) {
    return res.status(200).json({ reviews: [] })
  }

  const { data: products } = await query.graph({
    entity: "product",
    fields: ["id", "metadata"],
    filters: { id: productIds },
  })

  const reviews = (products || []).flatMap((product) =>
    parseReviewsFromMetadata(product.metadata ?? undefined).filter(
      (review) =>
        review.order_id === order.id && review.customer_id === customerId
    )
  )

  res.status(200).json({ reviews })
}

export async function POST(req: MedusaRequest, res: MedusaResponse) {
  const body = req.body as ReviewBody
  const { customerId, order } = await assertCustomerOwnsOrder(req)

  const paidStatuses = new Set([
    "captured",
    "partially_captured",
    "authorized",
    "partially_authorized",
  ])
  if (!paidStatuses.has(String(order.payment_status || ""))) {
    throw new MedusaError(
      MedusaError.Types.NOT_ALLOWED,
      "Reviews are available after payment is confirmed"
    )
  }

  if (!body.product_id) {
    throw new MedusaError(
      MedusaError.Types.INVALID_DATA,
      "product_id is required"
    )
  }

  const rating = Number(body.rating)
  if (!Number.isFinite(rating) || rating < 1 || rating > 5) {
    throw new MedusaError(
      MedusaError.Types.INVALID_DATA,
      "rating must be between 1 and 5"
    )
  }

  const comment = (body.comment || "").trim()
  if (comment.length < 3) {
    throw new MedusaError(
      MedusaError.Types.INVALID_DATA,
      "comment must be at least 3 characters"
    )
  }

  const line = (order.items || []).find(
    (item) => item?.product_id === body.product_id
  )
  if (!line) {
    throw new MedusaError(
      MedusaError.Types.INVALID_DATA,
      "This product is not part of the order"
    )
  }

  const query = req.scope.resolve(ContainerRegistrationKeys.QUERY)
  const productModule = req.scope.resolve(Modules.PRODUCT)
  const customerModule = req.scope.resolve(Modules.CUSTOMER)

  const { data: products } = await query.graph({
    entity: "product",
    fields: ["id", "title", "metadata"],
    filters: { id: body.product_id },
  })
  const product = products?.[0] as
    | { id: string; title?: string; metadata?: Record<string, unknown> }
    | undefined
  if (!product) {
    throw new MedusaError(MedusaError.Types.NOT_FOUND, "Product not found")
  }

  const customer = await customerModule.retrieveCustomer(customerId)
  const reviewerName =
    [customer?.first_name, customer?.last_name].filter(Boolean).join(" ") ||
    customer?.email ||
    "Customer"

  const reviewEntry = {
    id: `rev_${order.id}_${body.product_id}_${Date.now()}`,
    name: reviewerName,
    rating: Math.round(rating),
    date: new Date().toISOString().slice(0, 10),
    comment,
    customer_id: customerId,
    order_id: order.id,
    product_id: body.product_id,
  }

  const nextMetadata = appendCustomerReview(product.metadata, reviewEntry)

  await productModule.updateProducts(product.id, {
    metadata: nextMetadata,
  })

  res.status(200).json({ review: reviewEntry })
}
