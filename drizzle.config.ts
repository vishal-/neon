import { defineConfig } from 'drizzle-kit'

export default defineConfig({
  schema: './src/db/schema/index.ts',
  out: './drizzle',
  dialect: 'sqlite',
  driver: 'd1-http',
  dbCredentials: {
    accountId: process.env.CLOUDFLARE_ACCOUNT_ID || '',
    databaseId: '85934a42-3227-4109-a1d0-946eec05e177',
    token: process.env.CLOUDFLARE_D1_TOKEN || '',
  },
})
