import type { MedusaRequest, MedusaResponse } from "@medusajs/framework/http"
import { MedusaError } from "@medusajs/framework/utils"
import { getOrderDetailWorkflow } from "@medusajs/core-flows"
import {
  ORDER_ACTION_REQUEST_MODULE,
} from "../../../../../modules/order-action-request"

type OrderActionType = "cancel" | "return" | "exchange" | "support_note"

const ACTION_TYPES = new Set<OrderActionType>([
  "cancel",
  "return",
  "exchange",
  "support_note",
])

async function assertCustomerOwnsOrder(req: MedusaRequest) {
  const customerId = (req as any).auth_context?.actor_id

  if (!customerId) {
    throw new MedusaError(MedusaError.Types.UNAUTHORIZED, "Sign in required")
  }

  const { result } = await getOrderDetailWorkflow(req.scope).run({
    input: {
      fields: ["id", "customer_id"],
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

  return customerId
}

export async function GET(req: MedusaRequest, res: MedusaResponse) {
  const customerId = await assertCustomerOwnsOrder(req)
  const service: any = req.scope.resolve(ORDER_ACTION_REQUEST_MODULE)
  const action_requests = await service.listOrderActionRequests({
    order_id: req.params.id,
    customer_id: customerId,
  })

  res.status(200).json({ action_requests })
}

export async function POST(req: MedusaRequest, res: MedusaResponse) {
  const customerId = await assertCustomerOwnsOrder(req)
  const body = req.body as {
    type?: OrderActionType
    reason?: string
    items?: unknown
    metadata?: Record<string, unknown>
  }

  if (!body.type || !ACTION_TYPES.has(body.type)) {
    throw new MedusaError(
      MedusaError.Types.INVALID_DATA,
      "type must be one of cancel, return, exchange, support_note"
    )
  }

  const service: any = req.scope.resolve(ORDER_ACTION_REQUEST_MODULE)
  const action_request = await service.createOrderActionRequests({
    order_id: req.params.id,
    customer_id: customerId,
    type: body.type,
    status: "requested",
    reason: body.reason || null,
    items: body.items || null,
    metadata: body.metadata || null,
  })

  res.status(200).json({ action_request })
}
