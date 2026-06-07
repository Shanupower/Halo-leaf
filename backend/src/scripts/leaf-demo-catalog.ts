import { ProductStatus } from "@medusajs/framework/utils";
import { defaultReviewMetadataForHandle } from "../lib/product-review-metadata";

const PLACEHOLDER_IMAGE =
  "https://images.unsplash.com/photo-1540189549336-e6e99c3679fe?w=800&q=80";

type CategoryResult = { name: string; id: string }[];

export function buildLeafDemoProducts(input: {
  categoryResult: CategoryResult;
  shippingProfileId: string;
  salesChannelId: string;
  demoInrPrice: number;
}) {
  const { categoryResult, shippingProfileId, salesChannelId, demoInrPrice } =
    input;

  const cat = (name: string) =>
    categoryResult.find((c) => c.name === name)!.id;

  const sales_channels = [{ id: salesChannelId }];

  return [
    {
      title: "Areca Round Leaf Plate 10 inch",
      category_ids: [cat("Leaf Plates")],
      description:
        "Classic 10-inch round areca leaf plate. Sturdy, leak-resistant, and fully compostable after use.",
      handle: "areca-round-plate-10in",
      weight: 25,
      metadata: {
        ...defaultReviewMetadataForHandle("areca-round-plate-10in"),
        image_url: PLACEHOLDER_IMAGE,
        homepage_featured: true,
        short_description: "10-inch round plate for mains and thali meals.",
      },
      status: ProductStatus.PUBLISHED,
      shipping_profile_id: shippingProfileId,
      images: [{ url: PLACEHOLDER_IMAGE }],
      options: [{ title: "Pack size", values: ["25 pack", "50 pack"] }],
      variants: [
        {
          title: "25 pack",
          sku: "PLATE-10-25",
          options: { "Pack size": "25 pack" },
          prices: [{ amount: 149, currency_code: "inr" }],
        },
        {
          title: "50 pack",
          sku: "PLATE-10-50",
          options: { "Pack size": "50 pack" },
          prices: [{ amount: 279, currency_code: "inr" }],
        },
      ],
      sales_channels,
    },
    {
      title: "Square Leaf Plate 8 inch",
      category_ids: [cat("Leaf Plates")],
      description:
        "Compact square leaf plate for appetizers, snacks, and portion-controlled servings.",
      handle: "square-leaf-plate-8in",
      weight: 18,
      metadata: {
        ...defaultReviewMetadataForHandle("square-leaf-plate-8in"),
        image_url: PLACEHOLDER_IMAGE,
        homepage_featured: true,
        short_description: "8-inch square plate for snacks and starters.",
      },
      status: ProductStatus.PUBLISHED,
      shipping_profile_id: shippingProfileId,
      images: [{ url: PLACEHOLDER_IMAGE }],
      options: [{ title: "Pack size", values: ["25 pack"] }],
      variants: [
        {
          title: "25 pack",
          sku: "PLATE-8SQ-25",
          options: { "Pack size": "25 pack" },
          prices: [{ amount: 119, currency_code: "inr" }],
        },
      ],
      sales_channels,
    },
    {
      title: "Deep Leaf Bowl 12 oz",
      category_ids: [cat("Leaf Bowls")],
      description:
        "Deep areca leaf bowl for curries, rice, and desserts. Holds liquids without softening.",
      handle: "deep-leaf-bowl-12oz",
      weight: 20,
      metadata: {
        ...defaultReviewMetadataForHandle("deep-leaf-bowl-12oz"),
        image_url: PLACEHOLDER_IMAGE,
        homepage_featured: true,
        short_description: "12 oz bowl for curries and rice dishes.",
      },
      status: ProductStatus.PUBLISHED,
      shipping_profile_id: shippingProfileId,
      images: [{ url: PLACEHOLDER_IMAGE }],
      options: [{ title: "Pack size", values: ["25 pack", "50 pack"] }],
      variants: [
        {
          title: "25 pack",
          sku: "BOWL-12-25",
          options: { "Pack size": "25 pack" },
          prices: [{ amount: 169, currency_code: "inr" }],
        },
        {
          title: "50 pack",
          sku: "BOWL-12-50",
          options: { "Pack size": "50 pack" },
          prices: [{ amount: 319, currency_code: "inr" }],
        },
      ],
      sales_channels,
    },
    {
      title: "Leaf Snack Bowl 6 oz",
      category_ids: [cat("Leaf Bowls")],
      description:
        "Small leaf bowl for chutneys, desserts, and tasting portions at events.",
      handle: "leaf-snack-bowl-6oz",
      weight: 12,
      metadata: {
        ...defaultReviewMetadataForHandle("leaf-snack-bowl-6oz"),
        image_url: PLACEHOLDER_IMAGE,
        short_description: "6 oz bowl for sides and desserts.",
      },
      status: ProductStatus.PUBLISHED,
      shipping_profile_id: shippingProfileId,
      images: [{ url: PLACEHOLDER_IMAGE }],
      options: [{ title: "Pack size", values: ["50 pack"] }],
      variants: [
        {
          title: "50 pack",
          sku: "BOWL-6-50",
          options: { "Pack size": "50 pack" },
          prices: [{ amount: demoInrPrice, currency_code: "inr" }],
        },
      ],
      sales_channels,
    },
    {
      title: "Rectangular Leaf Tray 12 x 8 inch",
      category_ids: [cat("Leaf Trays")],
      description:
        "Large rectangular tray for buffets, catering, and combo meals.",
      handle: "rect-leaf-tray-12x8",
      weight: 35,
      metadata: {
        ...defaultReviewMetadataForHandle("rect-leaf-tray-12x8"),
        image_url: PLACEHOLDER_IMAGE,
        short_description: "Catering tray for combo meals and buffets.",
      },
      status: ProductStatus.PUBLISHED,
      shipping_profile_id: shippingProfileId,
      images: [{ url: PLACEHOLDER_IMAGE }],
      options: [{ title: "Pack size", values: ["10 pack", "25 pack"] }],
      variants: [
        {
          title: "10 pack",
          sku: "TRAY-12X8-10",
          options: { "Pack size": "10 pack" },
          prices: [{ amount: 199, currency_code: "inr" }],
        },
        {
          title: "25 pack",
          sku: "TRAY-12X8-25",
          options: { "Pack size": "25 pack" },
          prices: [{ amount: 449, currency_code: "inr" }],
        },
      ],
      sales_channels,
    },
    {
      title: "Areca Leaf Spoon Set",
      category_ids: [cat("Leaf Utensils")],
      description:
        "Disposable areca leaf spoons. Smooth finish, ideal for tastings and outdoor events.",
      handle: "areca-leaf-spoon-set",
      weight: 8,
      metadata: {
        ...defaultReviewMetadataForHandle("areca-leaf-spoon-set"),
        image_url: PLACEHOLDER_IMAGE,
        short_description: "Compostable spoons for events and takeaways.",
      },
      status: ProductStatus.PUBLISHED,
      shipping_profile_id: shippingProfileId,
      images: [{ url: PLACEHOLDER_IMAGE }],
      options: [{ title: "Pack size", values: ["100 pack"] }],
      variants: [
        {
          title: "100 pack",
          sku: "SPOON-100",
          options: { "Pack size": "100 pack" },
          prices: [{ amount: 89, currency_code: "inr" }],
        },
      ],
      sales_channels,
    },
  ];
}
