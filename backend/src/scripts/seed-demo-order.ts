import { ExecArgs } from "@medusajs/framework/types"
import { ContainerRegistrationKeys } from "@medusajs/framework/utils"
import { getOrderDetailWorkflow } from "@medusajs/medusa/core-flows"

const STOREFRONT = process.env.STOREFRONT_URL || "http://localhost:5173"

export default async function seedDemoOrder({ container }: ExecArgs) {
  const logger = container.resolve(ContainerRegistrationKeys.LOGGER)
  const query = container.resolve(ContainerRegistrationKeys.QUERY)

  const { data: orders } = await query.graph({
    entity: "order",
    fields: [
      "id",
      "display_id",
      "email",
      "customer_id",
      "payment_status",
      "status",
      "total",
      "created_at",
    ],
    pagination: { take: 10, order: { created_at: "DESC" } },
  })

  if (!orders?.length) {
    logger.info("No orders found yet.")
    logger.info(
      "Complete a test checkout in the storefront (Razorpay test mode) while signed in as a customer."
    )
    logger.info(`Then open ${STOREFRONT}/profile?tab=orders`)
    return
  }

  logger.info(`Found ${orders.length} recent order(s). Storefront links:`)
  for (const order of orders) {
    const { result: orderDetail } = await getOrderDetailWorkflow(container).run({
      input: {
        fields: [
          "id",
          "display_id",
          "payment_status",
          "status",
          "fulfillment_status",
        ],
        order_id: order.id,
        filters: {
          is_draft_order: false,
        },
      },
    })
    const paymentStatus =
      "payment_status" in orderDetail
        ? String(orderDetail.payment_status ?? "unknown")
        : "unknown"
    logger.info(
      [
        `- Order #${orderDetail.display_id ?? order.display_id ?? order.id}`,
        `payment=${paymentStatus}`,
        `status=${orderDetail.status ?? order.status}`,
        `success=${STOREFRONT}/checkout/success (after live checkout)`,
        `details=${STOREFRONT}/order-details/${order.id}`,
        `reviews=${STOREFRONT}/order-details/${order.id} (Review your purchase section)`,
      ].join(" | ")
    )
  }

  logger.info("")
  logger.info("Order flow after payment:")
  logger.info(`1. ${STOREFRONT}/checkout/success`)
  logger.info(`2. ${STOREFRONT}/order-details/:id`)
  logger.info(`3. ${STOREFRONT}/profile?tab=orders`)
  logger.info("4. Customer submits review on order details → shows on product page")
}
