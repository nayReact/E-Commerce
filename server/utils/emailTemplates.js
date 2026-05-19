export const otpEmailTemplate = (otp, name) => `
<!DOCTYPE html>
<html>
<head>
  <meta charset="utf-8">
  <style>
    body { font-family: 'Segoe UI', sans-serif; background: #f9fafb; margin: 0; padding: 0; }
    .container { max-width: 480px; margin: 40px auto; background: white; border-radius: 16px; overflow: hidden; box-shadow: 0 4px 24px rgba(0,0,0,0.08); }
    .header { background: linear-gradient(135deg, #4f46e5, #7c3aed); padding: 32px; text-align: center; }
    .header h1 { color: white; font-size: 24px; margin: 0; font-weight: 800; }
    .header p { color: #c7d2fe; margin: 8px 0 0; font-size: 14px; }
    .body { padding: 32px; }
    .greeting { font-size: 16px; color: #374151; margin-bottom: 16px; }
    .otp-box { background: #f3f4f6; border-radius: 12px; padding: 24px; text-align: center; margin: 24px 0; }
    .otp-label { font-size: 12px; color: #9ca3af; text-transform: uppercase; letter-spacing: 0.1em; margin-bottom: 8px; }
    .otp-code { font-size: 40px; font-weight: 800; color: #4f46e5; letter-spacing: 0.3em; }
    .expiry { font-size: 13px; color: #9ca3af; margin-top: 8px; }
    .warning { background: #fef3c7; border-radius: 8px; padding: 12px 16px; font-size: 13px; color: #92400e; margin: 16px 0; }
    .footer { padding: 24px 32px; border-top: 1px solid #f3f4f6; text-align: center; }
    .footer p { font-size: 12px; color: #9ca3af; margin: 0; line-height: 1.8; }
  </style>
</head>
<body>
  <div class="container">
    <div class="header">
      <h1>ShopHub</h1>
      <p>Your trusted ecommerce partner</p>
    </div>
    <div class="body">
      <p class="greeting">Hi ${name || 'there'} 👋</p>
      <p style="color: #6b7280; font-size: 14px;">
        Use the OTP below to login to your ShopHub account.
        This code is valid for <strong>10 minutes</strong>.
      </p>
      <div class="otp-box">
        <div class="otp-label">Your One-Time Password</div>
        <div class="otp-code">${otp}</div>
        <div class="expiry">⏱ Expires in 10 minutes</div>
      </div>
      <div class="warning">
        ⚠️ Never share this OTP with anyone. ShopHub will never ask for your OTP.
      </div>
      <p style="color: #6b7280; font-size: 13px;">
        If you did not request this OTP, please ignore this email.
        Your account is safe.
      </p>
    </div>
    <div class="footer">
      <p>© ${new Date().getFullYear()} ShopHub. All rights reserved.<br/>
      Bengaluru, India</p>
    </div>
  </div>
</body>
</html>
`