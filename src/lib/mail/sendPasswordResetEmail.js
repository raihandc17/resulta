import nodemailer from "nodemailer";

function getAppOrigin() {
  const raw =
    process.env.APP_URL ||
    process.env.NEXT_PUBLIC_APP_URL ||
    "http://localhost:3000";
  return raw.replace(/\/$/, "");
}

function createTransport() {
  const host = process.env.SMTP_HOST;
  const port = Number(process.env.SMTP_PORT || 587);
  const user = process.env.SMTP_USER;
  const pass = process.env.SMTP_PASS;

  if (!host || !user || !pass) {
    return null;
  }

  return nodemailer.createTransport({
    host,
    port,
    secure: port === 465,
    auth: { user, pass },
  });
}

export async function sendPasswordResetEmail({ to, name, resetUrl }) {
  const from =
    process.env.MAIL_FROM || `"TechSolveX" <${process.env.SMTP_USER || "no-reply@localhost"}>`;
  const transport = createTransport();

  const subject = "Reset your TechSolveX password";
  const text = [
    `Hi ${name || "there"},`,
    "",
    "We received a request to reset your password.",
    "Open the link below to choose a new password (valid for 1 hour):",
    "",
    resetUrl,
    "",
    "If you did not request this, you can ignore this email.",
  ].join("\n");

  const html = `
    <div style="font-family:system-ui,sans-serif;max-width:480px;line-height:1.5;color:#0f172a">
      <p>Hi ${name || "there"},</p>
      <p>We received a request to reset your password.</p>
      <p><a href="${resetUrl}" style="display:inline-block;padding:12px 20px;background:#2563eb;color:#fff;text-decoration:none;border-radius:8px;font-weight:600">Reset password</a></p>
      <p style="font-size:14px;color:#64748b">This link expires in 1 hour. If you did not request a reset, ignore this email.</p>
      <p style="font-size:12px;color:#94a3b8;word-break:break-all">${resetUrl}</p>
    </div>
  `;

  if (!transport) {
    console.info("[password-reset] SMTP not configured. Reset URL:", resetUrl);
    return { delivered: false, devLogged: true };
  }

  await transport.sendMail({
    from,
    to,
    subject,
    text,
    html,
  });

  return { delivered: true };
}

export function buildPasswordResetUrl(rawToken) {
  const origin = getAppOrigin();
  return `${origin}/reset-password?token=${encodeURIComponent(rawToken)}`;
}
