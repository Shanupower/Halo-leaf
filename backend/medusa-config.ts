import { loadEnv, defineConfig } from '@medusajs/framework/utils'

loadEnv(process.env.NODE_ENV || 'development', process.cwd())

const shiprocketEnabled =
  Boolean(process.env.SHIPROCKET_EMAIL) && Boolean(process.env.SHIPROCKET_PASSWORD)

const fulfillmentProviders = [
  {
    resolve: "@medusajs/medusa/fulfillment-manual",
    id: "manual",
    options: {},
  },
  ...(shiprocketEnabled
    ? [
        {
          resolve: "medusa-shiprocket-fulfillment-sbl",
          id: "shiprocket",
          options: {
            email: process.env.SHIPROCKET_EMAIL,
            password: process.env.SHIPROCKET_PASSWORD,
            pickup_location: process.env.SHIPROCKET_PICKUP_LOCATION || "Primary",
            cod: process.env.SHIPROCKET_COD || "false",
          },
        },
      ]
    : []),
]

const plugins: Array<string | { resolve: string; options?: Record<string, unknown> }> = [
  "medusa-plugin-razorpay-v2",
]

if (shiprocketEnabled) {
  plugins.push({
    resolve: "medusa-shiprocket-fulfillment-sbl",
    options: {
      shiprocket: {
        email: process.env.SHIPROCKET_EMAIL!,
        password: process.env.SHIPROCKET_PASSWORD!,
        pickupLocation: process.env.SHIPROCKET_PICKUP_LOCATION || "Primary",
      },
      webhookSecret: process.env.SHIPROCKET_WEBHOOK_SECRET,
      publishableKey: process.env.MEDUSA_PUBLISHABLE_KEY,
    },
  })
}

module.exports = defineConfig({
  projectConfig: {
    databaseUrl: process.env.DATABASE_URL,
    redisUrl: process.env.REDIS_URL,
    http: {
      storeCors: process.env.STORE_CORS!,
      adminCors: process.env.ADMIN_CORS!,
      authCors: process.env.AUTH_CORS!,
      jwtSecret: process.env.JWT_SECRET || "supersecret",
      cookieSecret: process.env.COOKIE_SECRET || "supersecret",
    }
  },
  modules: [
    {
      resolve: "./src/modules/order-action-request",
    },
    {
      resolve: "@medusajs/medusa/fulfillment",
      options: {
        providers: fulfillmentProviders,
      },
    },
    {
      resolve: "@medusajs/medusa/payment",
      options: {
        providers: [
          {
            resolve: "medusa-plugin-razorpay-v2/providers/payment-razorpay/src",
            id: "razorpay",
            options: {
              key_id: process.env.RAZORPAY_ID,
              key_secret: process.env.RAZORPAY_SECRET,
              razorpay_account: process.env.RAZORPAY_ACCOUNT,
              webhook_secret: process.env.RAZORPAY_WEBHOOK_SECRET,
              auto_capture: true,
              // Expiry periods are expressed in minutes. Keep conservative defaults for dev.
              // You can tune these later to match business requirements.
              automatic_expiry_period: 30,
              manual_expiry_period: 20,
              refund_speed: "normal",
            },
          },
        ],
      },
    },
  ],
  plugins: plugins as Array<
    string | { resolve: string; options: Record<string, unknown> }
  >,
})
