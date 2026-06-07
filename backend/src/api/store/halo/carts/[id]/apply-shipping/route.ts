import type { MedusaRequest, MedusaResponse } from "@medusajs/framework/http"
import { ContainerRegistrationKeys, Modules } from "@medusajs/framework/utils"
import {
  addShippingMethodToCartWorkflow,
  listShippingOptionsForCartWorkflow,
  refreshCartShippingMethodsWorkflow,
} from "@medusajs/medusa/core-flows"
import { checkShiprocketServiceability } from "../../../../../../lib/shiprocket"
import { cartShippingWeightKg } from "../../../../../../lib/cart-shipping-weight"

export async function POST(req: MedusaRequest, res: MedusaResponse) {
  try {
    return await applyShippingHandler(req, res)
  } catch (error) {
    const message =
      error instanceof Error ? error.message : "Could not apply shipping"
    return res.status(500).json({ message })
  }
}

async function applyShippingHandler(req: MedusaRequest, res: MedusaResponse) {
  const cartId = req.params.id as string
  const query = req.scope.resolve(ContainerRegistrationKeys.QUERY)
  const pricingModule = req.scope.resolve(Modules.PRICING)

  const { data: carts } = await query.graph({
    entity: "cart",
    fields: [
      "id",
      "total",
      "subtotal",
      "shipping_total",
      "tax_total",
      "currency_code",
      "shipping_address.*",
      "shipping_methods.*",
      "items.*",
      "items.variant.weight",
      "items.variant.length",
      "items.variant.width",
      "items.variant.height",
      "items.product.weight",
      "items.product.length",
      "items.product.width",
      "items.product.height",
    ],
    filters: { id: cartId },
  })

  const cart = carts?.[0]
  if (!cart) {
    return res.status(404).json({ message: "Cart not found" })
  }

  const deliveryPincode = cart.shipping_address?.postal_code
  if (!deliveryPincode) {
    return res.status(400).json({ message: "Shipping address with pincode is required" })
  }

  const shiprocketEmail = process.env.SHIPROCKET_EMAIL
  const shiprocketPassword = process.env.SHIPROCKET_PASSWORD?.replace(/^"|"$/g, "")

  let shippingAmount: number | null = null
  let estimatedDays: number | null = null
  let provider = "manual"

  if (shiprocketEmail && shiprocketPassword) {
    try {
      const quote = await checkShiprocketServiceability({
        email: shiprocketEmail,
        password: shiprocketPassword,
        pickupPincode:
          process.env.DEFAULT_PICKUP_PINCODE?.replace(/^"|"$/g, "") || "500070",
        deliveryPincode: String(deliveryPincode),
        cod: process.env.SHIPROCKET_COD === "true",
        weight: cartShippingWeightKg(cart as Parameters<typeof cartShippingWeightKg>[0]),
      })

      if (!quote.delivery_available || quote.rate == null) {
        return res.status(422).json({
          message: "Delivery is not available for this pincode",
          provider: "shiprocket",
        })
      }

      shippingAmount = Math.round(quote.rate * 100) / 100
      estimatedDays = quote.estimated_delivery_days
      provider = "shiprocket"
    } catch (error) {
      const message =
        error instanceof Error ? error.message : "Shiprocket quote failed"
      return res.status(502).json({ message, provider: "shiprocket" })
    }
  }

  const { result: shippingOptions } = await listShippingOptionsForCartWorkflow(
    req.scope
  ).run({
    input: { cart_id: cartId },
  })

  const options = shippingOptions || []
  if (!options.length) {
    return res.status(422).json({ message: "No shipping options for this cart" })
  }

  const selected =
    options.find((o: { name?: string }) =>
      /standard/i.test(o.name || "")
    ) || options[0]

  if (shippingAmount != null && selected?.id) {
    const { data: priceLinks } = await query.graph({
      entity: "shipping_option_price_set",
      fields: [
        "price_set_id",
        "price_set.id",
        "price_set.prices.id",
        "price_set.prices.currency_code",
        "price_set.prices.amount",
      ],
      filters: { shipping_option_id: selected.id },
    })

    const priceSet = priceLinks?.[0]?.price_set as
      | {
          id?: string
          prices?: {
            id?: string
            currency_code?: string
            amount?: number
          }[]
        }
      | undefined
    const inrPrice = priceSet?.prices?.find(
      (p) => p.currency_code?.toLowerCase() === "inr"
    )

    if (priceSet?.id && inrPrice?.id) {
      await pricingModule.updatePriceSets(priceSet.id, {
        prices: [
          {
            id: inrPrice.id,
            amount: shippingAmount,
            currency_code: "inr",
          },
        ],
      })
    }
  }

  if (cart.shipping_methods?.length) {
    await refreshCartShippingMethodsWorkflow(req.scope).run({
      input: { cart_id: cartId },
    })
  } else {
    await addShippingMethodToCartWorkflow(req.scope).run({
      input: {
        cart_id: cartId,
        options: [{ id: selected.id }],
      },
    })
  }

  const { data: updatedCarts } = await query.graph({
    entity: "cart",
    fields: [
      "id",
      "total",
      "subtotal",
      "shipping_total",
      "tax_total",
      "currency_code",
      "shipping_methods.*",
    ],
    filters: { id: cartId },
  })

  const updated = updatedCarts?.[0]

  const updatedCart = updated as { shipping_total?: number } | undefined

  return res.status(200).json({
    cart: updated,
    shipping: {
      provider,
      option_id: selected.id,
      option_name: selected.name,
      amount_minor: updatedCart?.shipping_total ?? shippingAmount,
      estimated_delivery_days: estimatedDays,
    },
  })
}
