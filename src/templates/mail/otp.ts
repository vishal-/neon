export interface OtpEmailProps {
  otp: string
  email?: string
  appName?: string
}

export function renderOtpEmail({ otp, email, appName = 'Neon Activities' }: OtpEmailProps): {
  subject: string
  html: string
  text: string
} {
  const subject = `🚀 Your ${appName} Login Code: ${otp}`

  const text = `
Welcome to ${appName}! 🚀

Your one-time login code is: ${otp}

This code will expire in 10 minutes. If you did not request this login code, you can safely ignore this email.

Happy exploring!
The ${appName} Team
`.trim()

  const html = `
<!DOCTYPE html>
<html lang="en">
<head>
  <meta charset="utf-8">
  <meta name="viewport" content="width=device-width, initial-scale=1.0">
  <title>${subject}</title>
  <style>
    body {
      margin: 0;
      padding: 0;
      background-color: #080c18;
      font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, Helvetica, Arial, sans-serif;
      color: #e2e8f0;
    }
    .wrapper {
      width: 100%;
      background-color: #080c18;
      padding: 40px 16px;
    }
    .container {
      max-width: 520px;
      margin: 0 auto;
      background-color: #101a33;
      border: 1px solid rgba(148, 163, 184, 0.2);
      border-radius: 20px;
      padding: 36px 28px;
      box-shadow: 0 10px 40px rgba(0, 0, 0, 0.5);
    }
    .header {
      text-align: center;
      margin-bottom: 28px;
    }
    .logo-badge {
      display: inline-block;
      padding: 8px 18px;
      background-color: rgba(126, 231, 201, 0.1);
      border: 1px solid rgba(126, 231, 201, 0.3);
      border-radius: 9999px;
      color: #7ee7c9;
      font-size: 13px;
      font-weight: 700;
      letter-spacing: 1px;
      text-transform: uppercase;
      margin-bottom: 16px;
    }
    .title {
      color: #ffffff;
      font-size: 24px;
      font-weight: 800;
      margin: 0 0 10px 0;
      line-height: 1.3;
    }
    .subtitle {
      color: #94a3b8;
      font-size: 15px;
      line-height: 1.5;
      margin: 0;
    }
    .otp-box {
      background: linear-gradient(180deg, #152244 0%, #0c1427 100%);
      border: 1.5px solid rgba(192, 132, 252, 0.4);
      border-radius: 16px;
      padding: 24px 16px;
      text-align: center;
      margin: 28px 0;
    }
    .otp-label {
      color: #94a3b8;
      font-size: 13px;
      font-weight: 600;
      text-transform: uppercase;
      letter-spacing: 1.5px;
      margin-bottom: 10px;
    }
    .otp-code {
      font-family: 'Courier New', Courier, monospace;
      font-size: 38px;
      font-weight: 900;
      letter-spacing: 8px;
      color: #7ee7c9;
      margin: 0;
    }
    .expiry-note {
      color: #cbd5e1;
      font-size: 14px;
      line-height: 1.6;
      margin: 20px 0 0 0;
      text-align: center;
    }
    .footer {
      border-top: 1px solid rgba(255, 255, 255, 0.08);
      margin-top: 32px;
      padding-top: 20px;
      text-align: center;
      color: #64748b;
      font-size: 12px;
      line-height: 1.5;
    }
    .footer a {
      color: #7ca5f5;
      text-decoration: none;
    }
  </style>
</head>
<body>
  <div class="wrapper">
    <div class="container">
      <div class="header">
        <div class="logo-badge">🚀 Cosmic Access</div>
        <h1 class="title">Blast Off to Neon Activities</h1>
        <p class="subtitle">Use the one-time verification code below to securely sign in to your explorer profile.</p>
      </div>

      <div class="otp-box">
        <div class="otp-label">Your One-Time Login Code</div>
        <div class="otp-code">${otp}</div>
      </div>

      <p class="expiry-note">
        ⏱️ This verification code is valid for <strong>10 minutes</strong>. Never share this code with anyone.
      </p>

      <div class="footer">
        <p>Sent by <strong>${appName}</strong></p>
        <p>If you did not request this login code, you can safely ignore this email.</p>
      </div>
    </div>
  </div>
</body>
</html>
`.trim()

  return { subject, html, text }
}
