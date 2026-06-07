import type { MedusaRequest, MedusaResponse } from "@medusajs/framework/http"
import { MedusaError } from "@medusajs/framework/utils"
import { getOrderDetailWorkflow } from "@medusajs/core-flows"
import {
  ORDER_ACTION_REQUEST_MODULE,
} from "../../../../../../../modules/order-action-request"

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

export async function POST(req: MedusaRequest, res: MedusaResponse) {
  const customerId = await assertCustomerOwnsOrder(req)
  const service: any = req.scope.resolve(ORDER_ACTION_REQUEST_MODULE)
  const [existing] = await service.listOrderActionRequests({
    id: req.params.action_id,
    order_id: req.params.id,
    customer_id: customerId,
  })

  if (!existing) {
    throw new MedusaError(
      MedusaError.Types.NOT_FOUND,
      `Action request with id ${req.params.action_id} was not found`
    )
  }

  if (existing.status !== "requested") {
    throw new MedusaError(
      MedusaError.Types.INVALID_DATA,
      "Only requested order actions can be canceled"
    )
  }

  const action_request = await service.updateOrderActionRequests({
    id: req.params.action_id,
    status: "canceled",
  })

  res.status(200).json({ action_request })
}
