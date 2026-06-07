import type { MedusaRequest, MedusaResponse } from "@medusajs/framework/http";
import { Modules } from "@medusajs/framework/utils";

type Testimonial = {
  id?: string
  name?: string
  designation?: string
  testimonial?: string
  rating?: string
  image_url?: string
}

function normalizeTestimonials(value: unknown): Testimonial[] {
  if (typeof value === "string") {
    try {
      return normalizeTestimonials(JSON.parse(value))
    } catch {
      return []
    }
  }

  if (!Array.isArray(value)) return []

  return value
    .map((item, index) => {
      const row = item as Testimonial
      return {
        id: row.id || `testimonial_${index + 1}`,
        name: row.name || "",
        designation: row.designation || "",
        testimonial: row.testimonial || "",
        rating: row.rating || "5.0",
        image_url: row.image_url || "",
      }
    })
    .filter((item) => item.name && item.testimonial)
}

export async function GET(req: MedusaRequest, res: MedusaResponse) {
  const storeModuleService = req.scope.resolve(Modules.STORE) as any
  const [store] = await storeModuleService.listStores()
  const testimonials = normalizeTestimonials(store?.metadata?.testimonials)

  res.status(200).json({ testimonials });
}
