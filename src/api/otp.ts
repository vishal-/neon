import { Hono } from 'hono'
import { createAuth, type AuthEnv } from '../lib/auth'

export type OtpEnv = {
  Bindings: AuthEnv
}

export const otpApi = new Hono<OtpEnv>()

/**
 * POST /api/otp/send
 * Sends a one-time verification code to the specified email address.
 */
otpApi.post('/send', async (c) => {
  const body = await c.req.json().catch(() => ({}))
  const email = (body.email || '').trim().toLowerCase()

  if (!email) {
    return c.json({ error: 'Validation Error', message: 'Email address is required' }, 400)
  }

  const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/
  if (!emailRegex.test(email)) {
    return c.json({ error: 'Validation Error', message: 'Please enter a valid email address' }, 400)
  }

  try {
    const auth = createAuth(c.env)
    await auth.api.sendVerificationOTP({
      body: {
        email,
        type: 'sign-in',
      },
      headers: c.req.raw.headers,
    })

    return c.json({
      success: true,
      message: `Cosmic access code sent to ${email}`,
      email,
    })
  } catch (err: any) {
    return c.json(
      {
        error: 'OTP Send Error',
        message: err?.message || 'Failed to send verification code. Please try again.',
      },
      500
    )
  }
})

/**
 * POST /api/otp/verify
 * Verifies the 6-digit OTP code and signs the cadet in, returning the session cookie.
 */
otpApi.post('/verify', async (c) => {
  const body = await c.req.json().catch(() => ({}))
  const email = (body.email || '').trim().toLowerCase()
  const otp = (body.otp || '').trim()

  if (!email) {
    return c.json({ error: 'Validation Error', message: 'Email address is required' }, 400)
  }

  if (!otp || otp.length < 6) {
    return c.json({ error: 'Validation Error', message: 'Please enter a valid 6-digit access code' }, 400)
  }

  try {
    const auth = createAuth(c.env)
    const authResponse = await auth.api.signInEmailOTP({
      body: {
        email,
        otp,
      },
      headers: c.req.raw.headers,
      asResponse: true,
    })

    if (!authResponse.ok) {
      const errorData = await authResponse.json().catch(() => ({}))
      return c.json(
        {
          error: 'Authentication Failed',
          message: errorData.message || 'Invalid or expired access code. Please try again.',
        },
        authResponse.status || 400
      )
    }

    const data = await authResponse.json().catch(() => ({}))

    // Forward Set-Cookie headers from Better Auth
    const setCookie = authResponse.headers.get('set-cookie')
    if (setCookie) {
      c.header('set-cookie', setCookie)
    }

    return c.json({
      success: true,
      message: 'Access granted! Blast off to Cosmic HQ!',
      user: data.user,
      session: data.session,
    })
  } catch (err: any) {
    return c.json(
      {
        error: 'Verification Error',
        message: err?.message || 'Failed to verify access code. Please try again.',
      },
      500
    )
  }
})

