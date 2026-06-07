export type ProductReviewEntry = {
  id: string
  name: string
  rating: number
  date: string
  comment: string
  customer_id?: string
  order_id?: string
  product_id?: string
}

export function parseReviewsFromMetadata(
  metadata: Record<string, unknown> | null | undefined
): ProductReviewEntry[] {
  const raw = metadata?.reviews
  if (Array.isArray(raw)) {
    return raw as ProductReviewEntry[]
  }
  if (typeof raw === "string") {
    try {
      const parsed = JSON.parse(raw)
      return Array.isArray(parsed) ? (parsed as ProductReviewEntry[]) : []
    } catch {
      return []
    }
  }
  return []
}

export function appendCustomerReview(
  metadata: Record<string, unknown> | null | undefined,
  review: ProductReviewEntry
): Record<string, unknown> {
  const existing = parseReviewsFromMetadata(metadata)
  const duplicate = existing.some(
    (entry) =>
      entry.order_id === review.order_id &&
      entry.product_id === review.product_id &&
      entry.customer_id === review.customer_id
  )
  if (duplicate) {
    throw new Error("You already reviewed this product for this order")
  }

  const reviews = [...existing, review]
  return {
    ...(metadata || {}),
    ...buildProductReviewMetadata(reviews),
  }
}

export function buildProductReviewMetadata(
  reviews: ProductReviewEntry[],
  options?: { ratingAverage?: number }
): Record<string, unknown> {
  const count = reviews.length
  const average =
    options?.ratingAverage ??
    (count
      ? reviews.reduce((sum, r) => sum + r.rating, 0) / count
      : 0)

  return {
    rating_average: average.toFixed(1),
    review_count: String(count),
    reviews: JSON.stringify(reviews),
  }
}

const DEFAULT_REVIEWS: ProductReviewEntry[] = [
  {
    id: "review_1",
    name: "Ananya R.",
    rating: 5,
    date: "2026-02-12",
    comment:
      "Quality is excellent and delivery was faster than expected. Will order again.",
  },
  {
    id: "review_2",
    name: "Rahul K.",
    rating: 4,
    date: "2026-01-28",
    comment:
      "Good fit and finish. Packaging was neat and the product matched the photos.",
  },
  {
    id: "review_3",
    name: "Meera S.",
    rating: 5,
    date: "2026-01-05",
    comment:
      "Love the feel and the sustainable focus. Perfect for everyday use.",
  },
]

export function defaultReviewMetadataForHandle(handle?: string | null) {
  const label = handle ? handle.replace(/-/g, " ") : "this product"
  const reviews = DEFAULT_REVIEWS.map((review, index) => ({
    ...review,
    id: `${handle || "product"}_review_${index + 1}`,
    comment: review.comment.replace("the product", label),
  }))
  return buildProductReviewMetadata(reviews)
}
