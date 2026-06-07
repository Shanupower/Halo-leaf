import { buildImageUrl } from "../../utils/media";
import { splitNameForMedusa } from "../../utils/customer-name";

function pickPrice(variant) {
  const amount =
    variant?.calculated_price?.calculated_amount ??
    variant?.prices?.[0]?.amount ??
    null;
  return typeof amount === "number" ? amount : null;
}

function parseMetadataArray(value) {
  if (Array.isArray(value)) return value;
  if (typeof value === "string") {
    try {
      const parsed = JSON.parse(value);
      return Array.isArray(parsed) ? parsed : [];
    } catch {
      return [];
    }
  }
  return [];
}

export function mapMedusaProductToUi(product) {
  const firstVariant = product?.variants?.[0];
  const amount = pickPrice(firstVariant);
  const thumb = product?.thumbnail;
  const metadata = product?.metadata || {};
  const weightGrams =
    firstVariant?.weight ?? product?.weight ?? null;
  const lengthMm = firstVariant?.length ?? product?.length ?? null;
  const widthMm = firstVariant?.width ?? product?.width ?? null;
  const heightMm = firstVariant?.height ?? product?.height ?? null;
  const categories = product?.categories || [];
  const categoryIds = categories.map((category) => category.id).filter(Boolean);
  const reviews = parseMetadataArray(metadata.reviews).map((review, index) => ({
    id: review.id || `review_${index + 1}`,
    name: review.name || "Customer",
    rating: Number(review.rating || 5),
    date: review.date || "",
    comment: review.comment || review.review || "",
    image_url: review.image_url || "",
  }));
  const ratingAverage = Number(
    metadata.rating_average || metadata.ratingAverage || metadata.rating || 0
  );
  const reviewCount = Number(
    metadata.review_count || metadata.reviewCount || reviews.length || 0
  );
  const effectiveReviewCount = reviewCount || reviews.length;
  const effectiveRatingAverage =
    ratingAverage || (reviews.length
      ? reviews.reduce((sum, r) => sum + r.rating, 0) / reviews.length
      : 0);
  const images =
    (product?.images?.length ? product.images : thumb ? [{ url: thumb }] : []).map(
      (img) => ({
        url: img?.url,
      })
    );

  return {
    ...product,
    documentId: product?.id,
    id: product?.id,
    variant_id: firstVariant?.id,
    category_ids: categoryIds,
    metadata,
    title: product?.title,
    description: product?.description,
    shortDescription: metadata.short_description || product?.subtitle || product?.description,
    imageUrl: buildImageUrl(images?.[0]?.url ?? thumb),
    badge: metadata.badge || "",
    ratingAverage: effectiveRatingAverage,
    reviewCount: effectiveReviewCount,
    reviews,
    isHomepageFeatured:
      metadata.homepage_featured === true ||
      metadata.homepage_featured === "true",
    weightGrams,
    lengthMm,
    widthMm,
    heightMm,
    OrigialPrice: amount ?? 0,
    price: amount ?? 0,
    image: images.map((i) => ({ url: i.url, full: buildImageUrl(i.url) })),
    attributes: {
      title: product?.title,
      price: amount ?? 0,
      OrigialPrice: amount ?? 0,
      category: {
        data: categories[0] ? { id: categories[0].id } : null,
      },
      categories: {
        data: categories.map((category) => ({ id: category.id })),
      },
      image: {
        data: {
          attributes: {
            url: images?.[0]?.url ?? thumb,
          },
        },
      },
    },
  };
}

export function mapMedusaCategoryToUi(category) {
  const metadata = category?.metadata || {};
  const imageUrl = metadata.image_url || metadata.imageUrl || "";
  return {
    ...category,
    id: category?.id,
    Name: category?.name,
    name: category?.name,
    description: category?.description || metadata.description || "",
    metadata,
    imageUrl: buildImageUrl(imageUrl),
    homepageOrder: Number(metadata.homepage_order ?? metadata.homepageOrder ?? 999),
    isHomepageFeatured:
      metadata.homepage_featured === true ||
      metadata.homepage_featured === "true",
    attributes: {
      Name: category?.name,
      description: category?.description || metadata.description || "",
      image: imageUrl
        ? {
            data: {
              attributes: { url: imageUrl },
            },
          }
        : undefined,
    },
  };
}

export function mapMedusaLineItemToCartItem(line) {
  const unit = line.unit_price ?? 0;
  const thumb = line.thumbnail;
  return {
    id: line.variant_id ?? line.id,
    medusaLineId: line.id,
    variantId: line.variant_id,
    documentId: line.product_id ?? line.product?.id,
    title: line.title ?? line.product_title,
    quantity: line.quantity,
    OrigialPrice: unit,
    price: unit,
    image: [
      {
        url: thumb,
        formats: { thumbnail: { url: thumb } },
      },
    ],
    attributes: {
      title: line.title ?? line.product_title,
      price: unit,
      image: {
        data: {
          attributes: { url: thumb },
        },
      },
    },
  };
}

export function mapCartItemsFromMedusa(cart) {
  if (!cart?.items?.length) return [];
  return cart.items.map(mapMedusaLineItemToCartItem);
}

function medusaAmount(value) {
  return typeof value === "number" ? value : 0;
}

export function mapCartSummaryFromMedusa(cart, extra = {}) {
  const shippingMethod = cart?.shipping_methods?.[0];
  const itemCount =
    cart?.items?.reduce((acc, line) => acc + (line.quantity || 0), 0) || 0;
  const lineSubtotal =
    cart?.items?.reduce(
      (acc, line) =>
        acc + (line.unit_price ?? 0) * (line.quantity || 0),
      0
    ) || 0;

  const subtotal =
    cart?.item_subtotal != null
      ? medusaAmount(cart.item_subtotal)
      : cart?.subtotal != null
        ? medusaAmount(cart.subtotal)
        : lineSubtotal;
  const shippingTotal = medusaAmount(cart?.shipping_total);
  const taxTotal = medusaAmount(cart?.tax_total);
  const total =
    cart?.total != null
      ? medusaAmount(cart.total)
      : subtotal + shippingTotal + taxTotal;

  return {
    subtotal,
    shippingTotal,
    taxTotal,
    total,
    currencyCode: (cart?.currency_code || "inr").toLowerCase(),
    shippingMethodName:
      shippingMethod?.name ||
      shippingMethod?.shipping_option?.name ||
      null,
    itemCount,
    hasShippingMethod: Boolean(cart?.shipping_methods?.length),
    hasShippingAddress: Boolean(cart?.shipping_address?.postal_code),
    estimatedDeliveryDays: extra.estimatedDeliveryDays ?? null,
  };
}

export function emptyCartSummary() {
  return {
    subtotal: 0,
    shippingTotal: 0,
    taxTotal: 0,
    total: 0,
    currencyCode: "inr",
    shippingMethodName: null,
    itemCount: 0,
    hasShippingMethod: false,
    hasShippingAddress: false,
    estimatedDeliveryDays: null,
  };
}

export function syncCartFromMedusa(cart, extra = {}) {
  return {
    items: mapCartItemsFromMedusa(cart),
    summary: cart?.items?.length
      ? mapCartSummaryFromMedusa(cart, extra)
      : emptyCartSummary(),
  };
}

export function uiAddressToMedusa(payload, customerName) {
  const { first_name, last_name } = splitNameForMedusa(customerName);
  const district = (payload.district || "").trim();
  const address2Parts = [payload.address2, district ? `District: ${district}` : ""]
    .filter(Boolean)
    .join(", ");

  return {
    first_name,
    last_name,
    address_1: payload.address1,
    address_2: address2Parts || undefined,
    city: payload.city,
    province: payload.state,
    postal_code: String(payload.pin_code ?? ""),
    country_code: (payload.country_code || "in").toLowerCase(),
    phone: payload.phone,
    metadata: district ? { district } : undefined,
  };
}

function parseDistrictFromAddress(a) {
  const metaDistrict = a?.metadata?.district;
  if (metaDistrict) return String(metaDistrict);

  const address2 = a?.address_2 || "";
  const match = address2.match(/District:\s*([^,]+)/i);
  if (match) return match[1].trim();

  return "";
}

export function mapMedusaAddressToUi(a) {
  const district = parseDistrictFromAddress(a);
  let address2 = a.address_2 || "";
  if (district) {
    address2 = address2.replace(/,?\s*District:\s*[^,]+/i, "").trim();
  }

  return {
    documentId: a.id,
    id: a.id,
    address1: a.address_1,
    address2: address2 || undefined,
    city: a.city,
    state: a.province,
    district,
    pin_code: a.postal_code,
    phone: a.phone,
  };
}

export function mapHaloTestimonialToUi(row) {
  const imageUrl = row.image_url || row.imageUrl || "/placeholder.png";
  return {
    id: row.id,
    name: row.name,
    designation: row.designation,
    testimonial: row.testimonial,
    rating: row.rating || "5.0",
    imageUrl: buildImageUrl(imageUrl),
    attributes: {
      Name: row.name,
      designation: row.designation,
      testimonial: row.testimonial,
      rating: row.rating || "5.0",
      image: {
        data: { attributes: { url: imageUrl } },
      },
    },
  };
}

