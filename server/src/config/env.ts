import dotenv from "dotenv";

dotenv.config();

const requiredEnv = (key: string): string => {
  const value = process.env[key];
  if (!value) {
    throw new Error(`Missing env variable: ${key}`);
  }
  return value;
};
const env = {
  nodeEnv: process.env.NODE_ENV || "development",
  port: Number(process.env.PORT) || 3000,

  mongoUri: requiredEnv("MONGO_URI"),
  jwtSecret: requiredEnv("JWT_SECRET"),
  jwtRefreshSecret: requiredEnv("JWT_REFRESH_SECRET"),
  // email
  smtpHost: requiredEnv("SMTP_HOST"),
  smtpPort: Number(requiredEnv("SMTP_PORT")),
  smtpSecure: requiredEnv("SMTP_SECURE"),
  smtpUser: requiredEnv("SMTP_USER"),
  smtpPass: requiredEnv("SMTP_PASS"),
  smtpFrom: requiredEnv("SMTP_FROM"),
  appName: requiredEnv("APP_NAME"),
  clientUrl: requiredEnv("CLIENT_URL"),

  // sentry
  sentryDsn: requiredEnv("SENTRY_DSN"),

  // cloudinary
  cloudinaryCloudName: requiredEnv("CLOUDINARY_CLOUD_NAME"),
  cloudinaryApiKey: requiredEnv("CLOUDINARY_API_KEY"),
  cloudinaryApiSecret: requiredEnv("CLOUDINARY_API_SECRET"),
  // gemini
  geminiApiKey: requiredEnv("GEMINI_API_KEY"),
};

export default env;
