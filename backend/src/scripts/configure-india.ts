import { ExecArgs } from "@medusajs/framework/types";
import {
  ContainerRegistrationKeys,
  Modules,
} from "@medusajs/framework/utils";
import {
  createWorkflow,
  transform,
  WorkflowResponse,
} from "@medusajs/framework/workflows-sdk";
import {
  createTaxRegionsWorkflow,
  updateRegionsWorkflow,
  updateStoresStep,
} from "@medusajs/medusa/core-flows";

const INDIA_COUNTRY = "in";
const INDIA_CURRENCY = "inr";
const DEFAULT_INR_PRICE = 999; // ₹999.00 (Medusa v2 major units)
const DEFAULT_SHIPPING_INR = 99; // ₹99.00

const updateStoreCurrencies = createWorkflow(
  "configure-india-store-currencies",
  (input: {
    supported_currencies: { currency_code: string; is_default?: boolean }[];
    store_id: string;
  }) => {
    const normalizedInput = transform({ input }, (data) => ({
      selector: { id: data.input.store_id },
      update: {
        supported_currencies: data.input.supported_currencies.map((currency) => ({
          currency_code: currency.currency_code,
          is_default: currency.is_default ?? false,
        })),
      },
    }));

    const stores = updateStoresStep(normalizedInput);
    return new WorkflowResponse(stores);
  }
);

export default async function configureIndia({ container }: ExecArgs) {
  const logger = container.resolve(ContainerRegistrationKeys.LOGGER);
  const query = container.resolve(ContainerRegistrationKeys.QUERY);
  const storeModuleService = container.resolve(Modules.STORE);
  const regionModuleService = container.resolve(Modules.REGION);

  logger.info("Configuring Medusa store for India (INR / country IN)...");

  const [store] = await storeModuleService.listStores();
  if (!store) {
    throw new Error("No store found.");
  }

  await updateStoreCurrencies(container).run({
    input: {
      store_id: store.id,
      supported_currencies: [{ currency_code: INDIA_CURRENCY, is_default: true }],
    },
  });

  const regions = await regionModuleService.listRegions({}, { relations: ["countries"] });
  const region =
    regions.find((r) => r.currency_code === INDIA_CURRENCY) ||
    regions.find((r) => r.name?.toLowerCase().includes("india")) ||
    regions[0];

  if (!region) {
    throw new Error("No region found. Run `npm run seed` first.");
  }

  const paymentModule = container.resolve(Modules.PAYMENT);
  const paymentProviders = await paymentModule.listPaymentProviders({});
  const providerIds = paymentProviders.map((p: { id: string }) => p.id);
  const preferredProviders = [
    ...providerIds.filter((id) => id.includes("razorpay")),
    ...providerIds.filter((id) => id.includes("system")),
  ];
  const regionProviders = [...new Set(preferredProviders.length ? preferredProviders : providerIds)];

  await updateRegionsWorkflow(container).run({
    input: {
      selector: { id: region.id },
      update: {
        name: "India",
        currency_code: INDIA_CURRENCY,
        countries: [INDIA_COUNTRY],
        payment_providers: regionProviders,
      },
    },
  });

  logger.info(`Region updated: ${region.id} → India (${INDIA_CURRENCY.toUpperCase()})`);

  const existingTaxRegions = await query.graph({
    entity: "tax_region",
    fields: ["id", "country_code"],
    filters: { country_code: INDIA_COUNTRY },
  });

  if (!existingTaxRegions.data?.length) {
    await createTaxRegionsWorkflow(container).run({
      input: [{ country_code: INDIA_COUNTRY, provider_id: "tp_system" }],
    });
    logger.info("Created tax region for IN.");
  }

  const pricingModule = container.resolve(Modules.PRICING);

  const { data: prices } = await query.graph({
    entity: "price",
    fields: ["id", "currency_code", "price_set_id"],
  });

  const byPriceSet = new Map<
    string,
    { id: string; currency_code?: string; price_set_id?: string }[]
  >();

  for (const price of prices || []) {
    if (!price.price_set_id) continue;
    const list = byPriceSet.get(price.price_set_id) || [];
    list.push(price);
    byPriceSet.set(price.price_set_id, list);
  }

  let inrPricesUpdated = 0;

  for (const [priceSetId, setPrices] of byPriceSet) {
    const inrPrice = setPrices.find(
      (p) => p.currency_code?.toLowerCase() === INDIA_CURRENCY
    );
    const foreign = setPrices.filter(
      (p) => p.currency_code?.toLowerCase() !== INDIA_CURRENCY
    );

    if (inrPrice?.id) {
      await pricingModule.updatePriceSets(priceSetId, {
        prices: [
          {
            id: inrPrice.id,
            amount: DEFAULT_INR_PRICE,
            currency_code: INDIA_CURRENCY,
          },
        ],
      });
      if (foreign.length) {
        await pricingModule.removePrices(foreign.map((p) => p.id));
      }
      inrPricesUpdated += 1;
      continue;
    }

    if (!foreign.length) continue;

    await pricingModule.updatePriceSets(priceSetId, {
      prices: [
        {
          id: foreign[0].id,
          amount: DEFAULT_INR_PRICE,
          currency_code: INDIA_CURRENCY,
        },
      ],
    });
    if (foreign.length > 1) {
      await pricingModule.removePrices(foreign.slice(1).map((p) => p.id));
    }
    inrPricesUpdated += 1;
  }

  if (inrPricesUpdated) {
    logger.info(
      `INR prices updated on ${inrPricesUpdated} price sets (₹${DEFAULT_INR_PRICE} each).`
    );
  }

  const fulfillmentModule = container.resolve(Modules.FULFILLMENT);
  const { data: geoZones } = await query.graph({
    entity: "geo_zone",
    fields: ["id", "country_code", "service_zone_id", "type"],
  });

  type GeoZoneRow = {
    id: string;
    country_code?: string;
    service_zone_id?: string;
    type?: string;
  };

  const zones = (geoZones || []) as GeoZoneRow[];
  let geoZonesUpdated = 0;
  for (const zone of zones) {
    if (zone.country_code?.toLowerCase() === INDIA_COUNTRY) continue;
    await fulfillmentModule.updateGeoZones({
      id: zone.id,
      country_code: INDIA_COUNTRY,
      type: "country",
    } as never);
    geoZonesUpdated += 1;
  }

  const hasIndiaZone = zones.some(
    (z) => z.country_code?.toLowerCase() === INDIA_COUNTRY
  );
  if (!hasIndiaZone && zones[0]?.service_zone_id) {
    await fulfillmentModule.createGeoZones({
      service_zone_id: zones[0].service_zone_id,
      country_code: INDIA_COUNTRY,
      type: "country",
    });
    geoZonesUpdated += 1;
  }

  if (geoZonesUpdated) {
    logger.info(`Shipping geo zones updated for India (${geoZonesUpdated}).`);
  }

  // Admin displays amounts using currency.decimal_digits (must be 2 for INR/paise).
  const pg = await import("pg");
  const client = new pg.Client({ connectionString: process.env.DATABASE_URL });
  await client.connect();
  try {
    await client.query(
      `UPDATE currency SET decimal_digits = 2, symbol = '₹', symbol_native = '₹', updated_at = NOW() WHERE code = $1`,
      [INDIA_CURRENCY]
    );
    logger.info("INR currency decimal_digits set to 2 (Admin will show ₹999.00 not ₹99,900).");
  } finally {
    await client.end();
  }

  logger.info("Done. Set VITE_MEDUSA_REGION_ID in the storefront .env if needed:");
  logger.info(`  VITE_MEDUSA_REGION_ID=${region.id}`);
  logger.info("Clear browser cart (localStorage medusa_cart_id) after changing region.");
}
