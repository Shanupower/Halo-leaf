import { Migration } from "@medusajs/framework/mikro-orm/migrations"

export class Migration202605121545 extends Migration {
  async up(): Promise<void> {
    this.addSql(`
      create table if not exists "order_action_request" (
        "id" text not null,
        "order_id" text not null,
        "customer_id" text not null,
        "type" text check ("type" in ('cancel', 'return', 'exchange', 'support_note')) not null,
        "status" text check ("status" in ('requested', 'approved', 'rejected', 'completed', 'canceled')) not null,
        "reason" text null,
        "items" jsonb null,
        "metadata" jsonb null,
        "created_at" timestamptz not null default now(),
        "updated_at" timestamptz not null default now(),
        "deleted_at" timestamptz null,
        constraint "order_action_request_pkey" primary key ("id")
      );
    `)
    this.addSql(
      `create index if not exists "IDX_order_action_request_order_id" on "order_action_request" ("order_id");`
    )
    this.addSql(
      `create index if not exists "IDX_order_action_request_customer_id" on "order_action_request" ("customer_id");`
    )
  }

  async down(): Promise<void> {
    this.addSql(`drop table if exists "order_action_request" cascade;`)
  }
}
