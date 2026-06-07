import { ExecArgs } from "@medusajs/framework/types"
import { ContainerRegistrationKeys, Modules } from "@medusajs/framework/utils"
import { defaultReviewMetadataForHandle } from "../lib/product-review-metadata"

export default async function seedProductReviews({ container }: ExecArgs) {
  const logger = container.resolve(ContainerRegistrationKeys.LOGGER)
  const query = container.resolve(ContainerRegistrationKeys.QUERY)
  const productModule = container.resolve(Modules.PRODUCT)

  const { data: products } = await query.graph({
    entity: "product",
    fields: ["id", "handle", "title", "metadata"],
  })

  let updated = 0

  for (const product of products || []) {
    const metadata = (product.metadata || {}) as Record<string, unknown>
    const hasRatings =
      metadata.rating_average != null &&
      metadata.review_count != null &&
      metadata.reviews != null

    if (hasRatings) {
      continue
    }

    const reviewMeta = defaultReviewMetadataForHandle(product.handle)

    await productModule.updateProducts(product.id, {
      metadata: {
        ...metadata,
        ...reviewMeta,
      },
    })

    updated += 1
    logger.info(`Added review metadata to ${product.title} (${product.handle})`)
  }

  logger.info(`Product review metadata complete. Updated ${updated} product(s).`)
}
