import type { MedusaRequest, MedusaResponse } from "@medusajs/framework/http"
import { ContainerRegistrationKeys } from "@medusajs/framework/utils"
import { variantShippingWeightKg } from "../../../lib/cart-shipping-weight"
import { checkShiprocketServiceability } from "../../../lib/shiprocket"

type ServiceabilityBody = {
  pickup_pincode?: string
  delivery_pincode?: string
  variant_id?: string
  quantity?: number
  cod?: boolean
  total_order_value?: number
  weight?: number
}

async function resolveServiceabilityWeightKg(
  req: MedusaRequest,
  body: ServiceabilityBody
): Promise<number> {
  if (body.variant_id) {
    const query = req.scope.resolve(ContainerRegistrationKeys.QUERY)
    const { data: variants } = await query.graph({
      entity: "product_variant",
      fields: [
        "id",
        "weight",
        "length",
        "width",
        "height",
        "product.weight",
        "product.length",
        "product.width",
        "product.height",
      ],
      filters: { id: body.variant_id },
    })

    const variant = variants?.[0] as
      | {
          weight?: number | null
          length?: number | null
          width?: number | null
          height?: number | null
          product?: {
            weight?: number | null
            length?: number | null
            width?: number | null
            height?: number | null
          } | null
        }
      | undefined

    if (variant) {
      return variantShippingWeightKg(
        variant,
        variant.product,
        body.quantity ?? 1
      )
    }
  }

  return body.weight ?? 1
}

export async function POST(req: MedusaRequest, res: MedusaResponse) {
  const body = req.body as ServiceabilityBody

  if (!body.delivery_pincode) {
    return res.status(400).json({
      message: "delivery_pincode is required",
    })
  }

  const weightKg = await resolveServiceabilityWeightKg(req, body)

  const shiprocketEmail = process.env.SHIPROCKET_EMAIL
  const shiprocketPassword = process.env.SHIPROCKET_PASSWORD?.replace(/^"|"$/g, "")

  if (shiprocketEmail && shiprocketPassword) {
    try {
      const result = await checkShiprocketServiceability({
        email: shiprocketEmail,
        password: shiprocketPassword,
        pickupPincode:
          body.pickup_pincode ||
          process.env.DEFAULT_PICKUP_PINCODE?.replace(/^"|"$/g, "") ||
          "500070",
        deliveryPincode: body.delivery_pincode,
        cod: body.cod ?? false,
        weight: weightKg,
      })
      return res.status(200).json(result)
    } catch (error) {
      const message =
        error instanceof Error ? error.message : "Shiprocket check failed"
      return res.status(502).json({ message, provider: "shiprocket" })
    }
  }

  const rapidshypToken = process.env.RAPIDSHYP_TOKEN
  if (rapidshypToken) {
    const response = await fetch(
      "https://api.rapidshyp.com/rapidshyp/apis/v1/serviceabilty_check",
      {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          "rapidshyp-token": rapidshypToken,
        },
        body: JSON.stringify({
          Pickup_pincode:
            body.pickup_pincode || process.env.DEFAULT_PICKUP_PINCODE || "500070",
          Delivery_pincode: body.delivery_pincode,
          cod: body.cod ?? true,
          total_order_value: body.total_order_value ?? 2000,
          weight: weightKg,
        }),
      }
    )

    const data = await response.json()
    const deliveryAvailable =
      data?.data?.delivery_available ?? data?.delivery_available ?? false

    return res.status(response.ok ? 200 : response.status).json({
      delivery_available: Boolean(deliveryAvailable),
      provider: "rapidshyp",
      raw: data,
    })
  }

  return res.status(200).json({
    delivery_available: true,
    estimated_delivery_days: "3-5",
    provider: "manual",
    message:
      "Configure SHIPROCKET_EMAIL and SHIPROCKET_PASSWORD for live pincode checks.",
  })
}
