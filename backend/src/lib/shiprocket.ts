const SHIPROCKET_API = "https://apiv2.shiprocket.in/v1/external"

export type ShiprocketServiceabilityResult = {
  delivery_available: boolean
  provider: "shiprocket"
  rate: number | null
  estimated_delivery_days: number | null
  couriers: number
  raw?: unknown
}

async function getShiprocketToken(email: string, password: string) {
  const response = await fetch(`${SHIPROCKET_API}/auth/login`, {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({ email, password }),
  })
  const data = await response.json()
  if (!response.ok || !data?.token) {
    throw new Error(data?.message || "Shiprocket authentication failed")
  }
  return data.token as string
}

export async function checkShiprocketServiceability(params: {
  email: string
  password: string
  pickupPincode: string
  deliveryPincode: string
  cod: boolean
  weight: number
}): Promise<ShiprocketServiceabilityResult> {
  const token = await getShiprocketToken(params.email, params.password)
  const url = new URL(`${SHIPROCKET_API}/courier/serviceability/`)
  url.searchParams.set("pickup_postcode", params.pickupPincode)
  url.searchParams.set("delivery_postcode", params.deliveryPincode)
  url.searchParams.set("cod", params.cod ? "1" : "0")
  url.searchParams.set("weight", String(params.weight))

  const response = await fetch(url.toString(), {
    headers: { Authorization: `Bearer ${token}` },
  })
  const data = await response.json()
  if (!response.ok) {
    throw new Error(data?.message || "Shiprocket serviceability check failed")
  }

  const couriers =
    data?.data?.available_courier_companies ??
    data?.available_courier_companies ??
    []

  const deliveryAvailable = Array.isArray(couriers) && couriers.length > 0
  const rates = couriers
    .map((c: { rate?: number; freight_charge?: number }) =>
      Number(c.rate ?? c.freight_charge ?? 0)
    )
    .filter((n: number) => Number.isFinite(n) && n > 0)
  const etdDays = couriers
    .map((c: { estimated_delivery_days?: number }) =>
      Number(c.estimated_delivery_days ?? 0)
    )
    .filter((n: number) => Number.isFinite(n) && n > 0)

  return {
    delivery_available: deliveryAvailable,
    provider: "shiprocket",
    rate: rates.length ? Math.min(...rates) : null,
    estimated_delivery_days: etdDays.length ? Math.min(...etdDays) : null,
    couriers: couriers.length,
    raw: data,
  }
}
