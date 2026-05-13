const nodemailer = require("nodemailer");

const EMAIL_SERVICE = process.env.EMAIL_SERVICE || "gmail";
const EMAIL_USER = process.env.EMAIL_USER;
const EMAIL_PASS = process.env.EMAIL_PASS;

let cachedTransporter = null;

const toPositiveNumber = (value, fallback) => {
  const parsed = Number(value);
  return Number.isFinite(parsed) && parsed > 0 ? parsed : fallback;
};

const buildTransportConfig = () => {
  const baseConfig = {
    auth: {
      user: EMAIL_USER,
      pass: EMAIL_PASS,
    },
    connectionTimeout: toPositiveNumber(process.env.SMTP_CONNECTION_TIMEOUT_MS, 30000),
    greetingTimeout: toPositiveNumber(process.env.SMTP_GREETING_TIMEOUT_MS, 30000),
    socketTimeout: toPositiveNumber(process.env.SMTP_SOCKET_TIMEOUT_MS, 45000),
    dnsTimeout: toPositiveNumber(process.env.SMTP_DNS_TIMEOUT_MS, 10000),
  };

  // Allow explicit SMTP configuration when needed (e.g. non-Gmail providers).
  if (process.env.SMTP_HOST) {
    return {
      ...baseConfig,
      host: process.env.SMTP_HOST,
      port: toPositiveNumber(process.env.SMTP_PORT, 587),
      secure: String(process.env.SMTP_SECURE || "false").toLowerCase() === "true",
    };
  }

  return {
    ...baseConfig,
    service: EMAIL_SERVICE,
  };
};

const getTransporter = () => {
  if (!EMAIL_USER || !EMAIL_PASS) {
    throw new Error("Email credentials are missing. Set EMAIL_USER and EMAIL_PASS.");
  }

  if (!cachedTransporter) {
    cachedTransporter = nodemailer.createTransport(buildTransportConfig());
  }

  return cachedTransporter;
};

const sendEmail = async (options) => {
  if (!options?.email) {
    throw new Error("Recipient email is required.");
  }

  const transporter = getTransporter();

  const mailOptions = {
    from: `${process.env.FROM_NAME || "Airbnb Clone"} <${EMAIL_USER}>`,
    to: options.email,
    subject: options.subject,
    text: options.message,
    html: options.html,
  };

  return transporter.sendMail(mailOptions);
};

module.exports = sendEmail;
