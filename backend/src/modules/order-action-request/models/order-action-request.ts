import { model } from "@medusajs/framework/utils"

const OrderActionRequest = model.define("order_action_request", {
  id: model.id().primaryKey(),
  order_id: model.text(),
  customer_id: model.text(),
  type: model.enum(["cancel", "return", "exchange", "support_note"]),
  status: model.enum(["requested", "approved", "rejected", "completed", "canceled"]),
  reason: model.text().nullable(),
  items: model.json().nullable(),
  metadata: model.json().nullable(),
})

export default OrderActionRequest
