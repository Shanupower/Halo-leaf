import type { ExecArgs } from "@medusajs/framework/types"
import { ContainerRegistrationKeys } from "@medusajs/framework/utils"
import {
  createOrderPaymentCollectionWorkflow,
  createOrderWorkflow,
  getOrderDetailWorkflow,
  markPaymentCollectionAsPaid,
} from "@medusajs/medusa/core-flows"

const DEFAULT_EMAIL = "shanupower@gmail.com"
const STOREFRONT = process.env.STOREFRONT_URL || "http://localhost:5173"
const DEMO_UNIT_PRICE = Number(process.env.DEMO_ORDER_UNIT_PRICE || 999)
const DEMO_SHIPPING = Number(process.env.DEMO_ORDER_SHIPPING || 99)

type CustomerRecord = {
  id: string
  email: string
  first_name?: string | null
  last_name?: string | null
  phone?: string | null
  addresses?: Array<{
    first_name?: string | null
    last_name?: string | null
    address_1?: string | null
    address_2?: string | null
    city?: string | null
    province?: string | null
    postal_code?: string | null
    country_code?: string | null
    phone?: string | null
  }>
}

type ProductRecord = {
  id: string
  title: string
  handle?: string | null
  description?: string | null
  thumbnail?: string | null
  variants?: Array<{
    id: string
    title?: string | null
    sku?: string | null
  }>
}

function normalizeEmail(value?: string) {
  return (value || DEFAULT_EMAIL).trim().toLowerCase()
}

function customerAddress(customer: CustomerRecord) {
  const address = customer.addresses?.[0]

  return {
    first_name: address?.first_name || customer.first_name || "Shanu",
    last_name: address?.last_name || customer.last_name || "Power",
    address_1: address?.address_1 || "Demo Address",
    address_2: address?.address_2 || "",
    city: address?.city || "Lucknow",
    province: address?.province || "UP",
    postal_code: address?.postal_code || "226202",
    country_code: (address?.country_code || "in").toLowerCase(),
    phone: address?.phone || customer.phone || "9999999999",
  }
}

export default async function createDemoOrder({ container }: ExecArgs) {
  const logger = container.resolve(ContainerRegistrationKeys.LOGGER)
  const query = container.resolve(ContainerRegistrationKeys.QUERY)
  const email = normalizeEmail(process.env.DEMO_ORDER_EMAIL)

  const { data: customers } = await query.graph({
    entity: "customer",
    fields: [
      "id",
      "email",
      "first_name",
      "last_name",
      "phone",
      "addresses.*",
    ],
    filters: { email },
    pagination: { take: 1 },
  })

  const customer = customers?.[0] as CustomerRecord | undefined
  if (!customer) {
    throw new Error(`Customer ${email} was not found in the database.`)
  }

  const { data: regions } = await query.graph({
    entity: "region",
    fields: ["id", "name", "currency_code"],
    filters: { currency_code: "inr" },
    pagination: { take: 1 },
  })
  const region = regions?.[0]
  if (!region?.id) {
    throw new Error("No INR region found. Run npm run seed/configure first.")
  }

  const { data: salesChannels } = await query.graph({
    entity: "sales_channel",
    fields: ["id", "name"],
    pagination: { take: 1 },
  })
  const salesChannel = salesChannels?.[0]
  if (!salesChannel?.id) {
    throw new Error("No sales channel found.")
  }

  const { data: products } = await query.graph({
    entity: "product",
    fields: [
      "id",
      "title",
      "handle",
      "description",
      "thumbnail",
      "variants.id",
      "variants.title",
      "variants.sku",
    ],
    pagination: { take: 20 },
  })
  const product = (products || []).find(
    (candidate: ProductRecord) => candidate.variants?.length
  ) as ProductRecord | undefined
  const variant = product?.variants?.[0]
  if (!product?.id || !variant?.id) {
    throw new Error("No product variant found to add to the demo order.")
  }

  const { data: shippingOptions } = await query.graph({
    entity: "shipping_option",
    fields: ["id", "name"],
    pagination: { take: 1 },
  })
  const shippingOption = shippingOptions?.[0]

  logger.info(`Creating demo order for ${customer.email}`)
  logger.info(`Customer: ${customer.id}`)
  logger.info(`Product: ${product.title} (${variant.title || variant.id})`)

  const address = customerAddress(customer)
  const { result: order } = await createOrderWorkflow(container).run({
    input: {
      region_id: region.id,
      customer_id: customer.id,
      email: customer.email,
      sales_channel_id: salesChannel.id,
      status: "pending",
      no_notification: true,
      shipping_address: address,
      billing_address: address,
      items: [
        {
          title: product.title,
          quantity: 1,
          unit_price: DEMO_UNIT_PRICE,
          product_id: product.id,
          product_title: product.title,
          product_description: product.description || undefined,
          product_handle: product.handle || undefined,
          thumbnail: product.thumbnail || undefined,
          variant_id: variant.id,
          variant_title: variant.title || undefined,
          variant_sku: variant.sku || undefined,
          requires_shipping: true,
          is_discountable: true,
          is_tax_inclusive: false,
        },
      ],
      shipping_methods: [
        {
          name: shippingOption?.name || "Standard Shipping",
          amount: DEMO_SHIPPING,
          shipping_option_id: shippingOption?.id,
          data: { created_by: "create-demo-order" },
        },
      ],
      metadata: {
        demo_order: true,
        created_by: "create-demo-order",
      },
    },
  })

  const { data: freshOrders } = await query.graph({
    entity: "order",
    fields: ["id", "display_id", "total", "currency_code"],
    filters: { id: order.id },
  })

  const freshOrder = freshOrders?.[0]
  const paymentAmount = Number(
    freshOrder?.total || DEMO_UNIT_PRICE + DEMO_SHIPPING
  )
  const { result: paymentCollections } =
    await createOrderPaymentCollectionWorkflow(container).run({
      input: {
        order_id: order.id,
        amount: paymentAmount,
      },
    })
  const paymentCollection = paymentCollections?.[0]
  if (!paymentCollection?.id) {
    throw new Error(`Created order ${order.id}, but no payment collection was returned.`)
  }

  await markPaymentCollectionAsPaid(container).run({
    input: {
      order_id: order.id,
      payment_collection_id: paymentCollection.id,
    },
  })

  const { result: paidOrder } = await getOrderDetailWorkflow(container).run({
    input: {
      fields: [
        "id",
        "display_id",
        "payment_status",
        "status",
        "fulfillment_status",
        "total",
        "currency_code",
        "items.*",
      ],
      order_id: order.id,
      filters: {
        is_draft_order: false,
      },
    },
  })

  logger.info(
    `Created paid order #${paidOrder?.display_id ?? order.id} (${order.id})`
  )
  logger.info(`Payment status: ${paidOrder?.payment_status || "unknown"}`)
  logger.info(`Order details: ${STOREFRONT}/order-details/${order.id}`)
  logger.info(`Customer orders: ${STOREFRONT}/profile?tab=orders`)
  logger.info(
    `Reviews: ${STOREFRONT}/order-details/${order.id} (Review your purchase section)`
  )
}
