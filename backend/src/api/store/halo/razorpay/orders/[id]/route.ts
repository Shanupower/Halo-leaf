import type { MedusaRequest, MedusaResponse } from "@medusajs/framework/http"
import Razorpay from "razorpay"

export async function GET(req: MedusaRequest, res: MedusaResponse) {
  const orderId = req.params.id as string
  const keyId = process.env.RAZORPAY_ID
  const keySecret = process.env.RAZORPAY_SECRET

  if (!keyId || !keySecret) {
    return res.status(500).json({ message: "Razorpay is not configured on the server." })
  }

  if (!orderId?.startsWith("order_")) {
    return res.status(400).json({ message: "Invalid Razorpay order id." })
  }

  try {
    const razorpay = new Razorpay({
      key_id: keyId,
      key_secret: keySecret,
      headers: process.env.RAZORPAY_ACCOUNT
        ? { "X-Razorpay-Account": process.env.RAZORPAY_ACCOUNT }
        : undefined,
    })

    const order = await razorpay.orders.fetch(orderId)
    const payments = await razorpay.orders.fetchPayments(orderId)
    const items = payments.items ?? []

    const hasSuccessfulPayment = items.some(
      (payment) => payment.status === "authorized" || payment.status === "captured"
    )

    const paid =
      order.status === "paid" ||
      (order.status === "attempted" && hasSuccessfulPayment)

    return res.json({
      id: order.id,
      status: order.status,
      amount: order.amount,
      amount_paid: order.amount_paid,
      paid,
      payments: items.map((payment) => ({
        id: payment.id,
        status: payment.status,
        amount: payment.amount,
      })),
    })
  } catch (error) {
    const message =
      error instanceof Error ? error.message : "Could not fetch Razorpay order"
    return res.status(502).json({ message })
  }
}
