import { MedusaService } from "@medusajs/framework/utils"
import OrderActionRequest from "./models/order-action-request"

class OrderActionRequestModuleService extends MedusaService({
  OrderActionRequest,
}) {}

export default OrderActionRequestModuleService
