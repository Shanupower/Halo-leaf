const DEFAULT_WEIGHT_GRAMS = 500;
const MIN_CART_WEIGHT_KG = 0.5;
const VOLUMETRIC_DIVISOR = 5000;

export type ShippingDimensions = {
  weight?: number | null;
  length?: number | null;
  width?: number | null;
  height?: number | null;
};

export type ShippingLineInput = {
  quantity?: number | null;
  variant?: ShippingDimensions | null;
  product?: ShippingDimensions | null;
};

function pickField<T extends keyof ShippingDimensions>(
  variant: ShippingDimensions | null | undefined,
  product: ShippingDimensions | null | undefined,
  field: T
): number | null {
  const variantValue = variant?.[field];
  if (variantValue != null && Number(variantValue) > 0) {
    return Number(variantValue);
  }
  const productValue = product?.[field];
  if (productValue != null && Number(productValue) > 0) {
    return Number(productValue);
  }
  return null;
}

function actualWeightKgPerUnit(
  variant?: ShippingDimensions | null,
  product?: ShippingDimensions | null
): number {
  const grams =
    pickField(variant, product, "weight") ?? DEFAULT_WEIGHT_GRAMS;
  return grams / 1000;
}

function volumetricWeightKgPerUnit(
  variant?: ShippingDimensions | null,
  product?: ShippingDimensions | null
): number | null {
  const lengthMm = pickField(variant, product, "length");
  const widthMm = pickField(variant, product, "width");
  const heightMm = pickField(variant, product, "height");

  if (lengthMm == null || widthMm == null || heightMm == null) {
    return null;
  }

  const lengthCm = lengthMm / 10;
  const widthCm = widthMm / 10;
  const heightCm = heightMm / 10;

  return (lengthCm * widthCm * heightCm) / VOLUMETRIC_DIVISOR;
}

export function lineShippingWeightKg(item: ShippingLineInput): number {
  const quantity = Math.max(1, Number(item.quantity || 1));
  const actualPerUnit = actualWeightKgPerUnit(item.variant, item.product);
  const volumetricPerUnit = volumetricWeightKgPerUnit(item.variant, item.product);
  const chargeablePerUnit =
    volumetricPerUnit != null
      ? Math.max(actualPerUnit, volumetricPerUnit)
      : actualPerUnit;

  return chargeablePerUnit * quantity;
}

export function variantShippingWeightKg(
  variant?: ShippingDimensions | null,
  product?: ShippingDimensions | null,
  quantity = 1
): number {
  return lineShippingWeightKg({
    quantity,
    variant,
    product,
  });
}

export function cartShippingWeightKg(cart: {
  items?: Array<ShippingLineInput | null> | null;
}): number {
  let total = 0;

  for (const item of cart?.items || []) {
    if (!item) continue;
    total += lineShippingWeightKg(item);
  }

  return Math.max(
    MIN_CART_WEIGHT_KG,
    Math.round(total * 100) / 100
  );
}
