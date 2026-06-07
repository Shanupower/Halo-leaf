import type { ExecArgs } from "@medusajs/framework/types";
import { ContainerRegistrationKeys } from "@medusajs/framework/utils";
import pg from "pg";

const INDIA_CURRENCY = "inr";

/**
 * Medusa Admin formats amounts using currency.decimal_digits.
 * If inr has decimal_digits=0, admin shows paise as rupees (100× too high).
 */
export default async function fixInrCurrency({ container }: ExecArgs) {
  const logger = container.resolve(ContainerRegistrationKeys.LOGGER);
  const query = container.resolve(ContainerRegistrationKeys.QUERY);

  const { data: before } = await query.graph({
    entity: "currency",
    fields: ["code", "name", "decimal_digits", "symbol", "symbol_native"],
    filters: { code: INDIA_CURRENCY },
  });

  const current = before?.[0] as
    | {
        code?: string;
        decimal_digits?: number;
        symbol_native?: string;
      }
    | undefined;

  logger.info(
    `INR currency before fix: ${JSON.stringify(current ?? "not found")}`
  );

  const client = new pg.Client({ connectionString: process.env.DATABASE_URL });
  await client.connect();

  try {
    await client.query(
      `
      UPDATE currency
      SET
        decimal_digits = 2,
        symbol = '₹',
        symbol_native = '₹',
        updated_at = NOW()
      WHERE code = $1
      `,
      [INDIA_CURRENCY]
    );

    const { rows } = await client.query(
      `SELECT code, decimal_digits, symbol_native FROM currency WHERE code = $1`,
      [INDIA_CURRENCY]
    );

    logger.info(`INR currency after fix: ${JSON.stringify(rows[0])}`);
    logger.info(
      "Medusa Admin should now show ₹999.00 instead of ₹99,900 for amount 99900. Refresh Admin."
    );
  } finally {
    await client.end();
  }
}
