import { betterAuth } from 'better-auth'
import { drizzleAdapter } from 'better-auth/adapters/drizzle'
import { emailOTP } from 'better-auth/plugins'
import { Resend } from 'resend'
import { getDb, type TursoEnv } from '../db'
import * as schema from '../db/schema'
import { renderOtpEmail } from '../templates/mail'

export interface AuthEnv extends TursoEnv {
  RESEND_API_KEY?: string
  BETTER_AUTH_SECRET?: string
  BETTER_AUTH_URL?: string
}

export function createAuth(env?: AuthEnv) {
  const db = getDb(env)
  const resendApiKey = env?.RESEND_API_KEY || (typeof process !== 'undefined' ? process.env?.RESEND_API_KEY : '') || ''
  const resend = new Resend(resendApiKey)

  return betterAuth({
    database: drizzleAdapter(db, {
      provider: 'sqlite',
      schema: {
        user: schema.user,
        session: schema.session,
        account: schema.account,
        verification: schema.verification,
      },
    }),
    advanced: {
      database: {
        generateId: 'uuid',
      },
    },
    user: {
      additionalFields: {
        isBoss: {
          type: 'boolean',
          required: false,
          defaultValue: false,
          input: false,
        },
      },
    },
    secret:
      env?.BETTER_AUTH_SECRET ||
      (typeof process !== 'undefined' ? process.env?.BETTER_AUTH_SECRET : '') ||
      'neon-activities-cosmic-secret-key-32chars-min',
    baseURL:
      env?.BETTER_AUTH_URL ||
      (typeof process !== 'undefined' ? process.env?.BETTER_AUTH_URL : '') ||
      'http://localhost:5173',
    plugins: [
      emailOTP({
        async sendVerificationOTP({ email, otp, type: _type }) {
          const { subject, html, text } = renderOtpEmail({
            otp,
            email,
            appName: 'Neon Activities',
          })

          try {
            await resend.emails.send({
              from: 'Neon Activities <no-reply@neon.poovi.in>',
              to: email,
              subject,
              html,
              text,
            })
          } catch (error) {
            console.error('Failed to send OTP email via Resend:', error)
            throw error
          }
        },
      }),
    ],
  })
}

export type Auth = ReturnType<typeof createAuth>
