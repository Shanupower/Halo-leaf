import type { ExecArgs } from "@medusajs/framework/types";
import { ContainerRegistrationKeys } from "@medusajs/framework/utils";
import pg from "pg";

function divideTotalsObject(totals: Record<string, unknown>) {
  const next: Record<string, unknown> = { ...totals };
  for (const [key, value] of Object.entries(next)) {
    if (typeof value === "number" && value >= 100) {
      next[key] = Math.round(value / 100);
      continue;
    }
    if (
      value &&
      typeof value === "object" &&
      "value" in (value as Record<string, unknown>)
    ) {
      const raw = value as { value?: string | number; precision?: number };
      const numeric = Number(raw.value);
      if (!Number.isNaN(numeric) && numeric >= 100) {
        next[key] = {
          ...raw,
          value: String(Math.round(numeric / 100)),
        };
      }
    }
  }
  return next;
}
/**
 * Medusa v2 Admin expects major currency units (999 = ₹999).
 * Legacy seed data used paise (99900), causing Admin to show 100× values.
 */
export default async function migrateInrToMajorUnits({ container }: ExecArgs) {
  const logger = container.resolve(ContainerRegistrationKeys.LOGGER);
  const client = new pg.Client({ connectionString: process.env.DATABASE_URL });
  await client.connect();

  try {
    await client.query("BEGIN");

    const priceResult = await client.query(`
      UPDATE price
      SET
        amount = ROUND(amount / 100.0),
        raw_amount = jsonb_set(
          COALESCE(raw_amount, '{}'::jsonb),
          '{value}',
          to_jsonb((ROUND((raw_amount->>'value')::numeric / 100.0))::text)
        ),
        updated_at = NOW()
      WHERE currency_code = 'inr'
        AND amount >= 100
    `);

    const orderLineResult = await client.query(`
      UPDATE order_line_item
      SET
        unit_price = ROUND(unit_price / 100.0),
        raw_unit_price = CASE
          WHEN raw_unit_price IS NOT NULL THEN jsonb_set(
            raw_unit_price,
            '{value}',
            to_jsonb((ROUND((raw_unit_price->>'value')::numeric / 100.0))::text)
          )
          ELSE raw_unit_price
        END,
        updated_at = NOW()
      WHERE unit_price >= 100
    `);

    const orderItemResult = await client.query(`
      UPDATE order_item
      SET
        unit_price = ROUND(unit_price / 100.0),
        raw_unit_price = CASE
          WHEN raw_unit_price IS NOT NULL THEN jsonb_set(
            raw_unit_price,
            '{value}',
            to_jsonb((ROUND((raw_unit_price->>'value')::numeric / 100.0))::text)
          )
          ELSE raw_unit_price
        END,
        updated_at = NOW()
      WHERE unit_price >= 100
    `);

    const { rows: summaries } = await client.query(
      `SELECT id, totals FROM order_summary WHERE totals IS NOT NULL`
    );
    let summariesUpdated = 0;
    for (const row of summaries) {
      const updated = divideTotalsObject(row.totals as Record<string, unknown>);
      await client.query(`UPDATE order_summary SET totals = $1::jsonb, updated_at = NOW() WHERE id = $2`, [
        JSON.stringify(updated),
        row.id,
      ]);
      summariesUpdated += 1;
    }

    const paymentSessionResult = await client.query(`
      UPDATE payment_session
      SET
        amount = ROUND(amount / 100.0),
        raw_amount = CASE
          WHEN raw_amount IS NOT NULL THEN jsonb_set(
            raw_amount,
            '{value}',
            to_jsonb((ROUND((raw_amount->>'value')::numeric / 100.0))::text)
          )
          ELSE raw_amount
        END,
        updated_at = NOW()
      WHERE currency_code = 'inr' AND amount >= 100
    `);

    const paymentCollectionResult = await client.query(`
      UPDATE payment_collection
      SET
        amount = ROUND(amount / 100.0),
        raw_amount = CASE WHEN raw_amount IS NOT NULL THEN jsonb_set(raw_amount, '{value}', to_jsonb((ROUND((raw_amount->>'value')::numeric / 100.0))::text)) ELSE raw_amount END,
        authorized_amount = CASE WHEN authorized_amount IS NOT NULL AND authorized_amount >= 100 THEN ROUND(authorized_amount / 100.0) ELSE authorized_amount END,
        raw_authorized_amount = CASE WHEN raw_authorized_amount IS NOT NULL THEN jsonb_set(raw_authorized_amount, '{value}', to_jsonb((ROUND((raw_authorized_amount->>'value')::numeric / 100.0))::text)) ELSE raw_authorized_amount END,
        captured_amount = CASE WHEN captured_amount IS NOT NULL AND captured_amount >= 100 THEN ROUND(captured_amount / 100.0) ELSE captured_amount END,
        raw_captured_amount = CASE WHEN raw_captured_amount IS NOT NULL THEN jsonb_set(raw_captured_amount, '{value}', to_jsonb((ROUND((raw_captured_amount->>'value')::numeric / 100.0))::text)) ELSE raw_captured_amount END,
        updated_at = NOW()
      WHERE currency_code = 'inr' AND amount >= 100
    `);

    await client.query(`
      UPDATE currency
      SET decimal_digits = 2, symbol = '₹', symbol_native = '₹', updated_at = NOW()
      WHERE code = 'inr'
    `);

    await client.query("COMMIT");

    logger.info("Migrated INR amounts from paise → major units (Medusa v2 format).");
    logger.info(`  prices: ${priceResult.rowCount ?? 0}`);
    logger.info(`  order_line_item: ${orderLineResult.rowCount ?? 0}`);
    logger.info(`  order_item: ${orderItemResult.rowCount ?? 0}`);
    logger.info(`  order_summary: ${summariesUpdated}`);
    logger.info(`  payment_session: ${paymentSessionResult.rowCount ?? 0}`);
    logger.info(`  payment_collection: ${paymentCollectionResult.rowCount ?? 0}`);
    logger.info("Restart backend and hard-refresh Medusa Admin.");
  } catch (error) {
    await client.query("ROLLBACK");
    throw error;
  } finally {
    await client.end();
  }
}
