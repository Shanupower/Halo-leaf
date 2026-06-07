import { Module } from "@medusajs/framework/utils"
import OrderActionRequestModuleService from "./service"

export const ORDER_ACTION_REQUEST_MODULE = "order_action_request"

export default Module(ORDER_ACTION_REQUEST_MODULE, {
  service: OrderActionRequestModuleService,
})
