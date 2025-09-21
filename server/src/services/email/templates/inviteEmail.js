export function inviteEmailHtml({ fullName, actionUrl }) {
  return `
<!DOCTYPE html>
<html>
<head>
<meta charset="utf-8" />
<meta name="viewport" content="width=device-width" />
<title>Set your password</title>
<style>
  body{background:#f6f8fb;margin:0;padding:0;font-family:Arial,Helvetica,sans-serif;color:#111}
  .container{max-width:560px;margin:24px auto;background:#fff;border-radius:12px;overflow:hidden;border:1px solid #eaeaea}
  .header{background:#0f172a;color:#fff;padding:20px 24px;font-size:18px;font-weight:700}
  .content{padding:24px}
  .btn{display:inline-block;background:#e1e3e8;color:#fff;text-decoration:none;padding:12px 18px;border-radius:8px;font-weight:700}
  .muted{color:#555;font-size:14px}
  .footer{padding:16px 24px;border-top:1px solid #eee;color:#666;font-size:12px}
</style>
</head>
<body>
  <div class="container">
    <div class="header">School Staff Portal</div>
    <div class="content">
      <p>Hello ${fullName || 'Teacher'},</p>
      <p>Welcome! Please set your password to activate your account.</p>
      <p style="margin:24px 0;"><a class="btn" href="${actionUrl}" target="_blank" rel="noreferrer">Set your password</a></p>
      <p class="muted">This link will expire in <strong>1 hour</strong>. If it expires, ask your admin to resend the invite.</p>
      <p class="muted">If you didn’t expect this, you can ignore this email.</p>
    </div>
    <div class="footer">© ${new Date().getFullYear()} School Staff Portal</div>
  </div>
</body>
</html>`;
}

export function inviteEmailText({ fullName, actionUrl }) {
  return `Hello ${fullName || 'Teacher'},

Welcome! Please set your password to activate your account.

Set your password: ${actionUrl}

This link will expire in 1 hour. If it expires, ask your admin to resend the invite.

© ${new Date().getFullYear()} School Staff Portal`;
}
