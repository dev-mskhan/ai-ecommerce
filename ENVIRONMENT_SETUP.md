# Environment Setup Guide

# Prerequisites

Install the following before running the project:

- Node.js >= 20
- Docker Desktop
- MongoDB Atlas Account
- Redis Instance
- Git

---

# Backend Environment Setup

Create a `.env` file inside:
server/.env

## Backend Environment Variables

PORT=3000
PROD_PORT=8080
NODE_ENV=development
REDIS_URL=your_redis_url
MONGO_URI=your_mongodb_connection_string
JWT_SECRET=your_jwt_secret
JWT_REFRESH_SECRET=your_refresh_jwt_secret
SMTP_HOST=smtp.gmail.com
SMTP_PORT=587
SMTP_SECURE=false
SMTP_USER=your_email@gmail.com
SMTP_PASS=your_app_password
SMTP_FROM=your_email@gmail.com
APP_NAME=ai-expense
CLIENT_URL=http://localhost:5173
SENTRY_DSN=your_sentry_dsn
CLOUDINARY_API_KEY=your_cloudinary_api_key
CLOUDINARY_API_SECRET=your_cloudinary_api_secret
CLOUDINARY_CLOUD_NAME=your_cloudinary_cloud_name
ADMIN_EMAIL=admin@example.com
ADMIN_PASSWORD=your_admin_password
GEMINI_API_KEY=your_gemini_api_key
STRIPE_SECRET_KEY=your_stripe_secret_key
STRIPE_WEBHOOK_SECRET=your_stripe_webhook_secret

---

# Frontend Environment Setup

Create a `.env` file inside:
client/.env

## Frontend Environment Variables

VITE_STRIPE_PUBLIC_KEY=your_stripe_public_key
VITE_API_URL=http://localhost:3000

---

# MongoDB Atlas Setup

## Create MongoDB Cluster

1. Create MongoDB Atlas account
2. Create a new project
3. Create cluster
4. Create database user
5. Add IP address in Network Access
6. Copy connection string
7. Paste connection string into `.env`

## Example

env
MONGO_URI=mongodb+srv://username:password@cluster.mongodb.net/database-name

---

# Redis Setup

## Using Docker

docker run -d --name redis -p 6379:6379 redis

## Using Upstash Redis

1. Create Upstash account
2. Create Redis database
3. Copy Redis URL
4. Paste into `.env`

## Example

env
REDIS_URL=rediss://default:password@host:6379

---

# Gmail SMTP Setup

## Enable App Password

1. Enable 2-Step Verification in Google Account
2. Open Google App Passwords
3. Generate Mail App Password
4. Use generated password in:
   env
   SMTP_PASS=your_app_password

---

# Cloudinary Setup

## Create Cloudinary Account

1. Create account
2. Open Dashboard
3. Copy:
   - Cloud Name
   - API Key
   - API Secret

## Example

env
CLOUDINARY_API_KEY=your_api_key
CLOUDINARY_API_SECRET=your_api_secret
CLOUDINARY_CLOUD_NAME=your_cloud_name

---

# Gemini AI Setup

## Generate Gemini API Key

1. Open Google AI Studio
2. Create API Key
3. Paste inside `.env`

## Example

env
GEMINI_API_KEY=your_gemini_api_key

---

# Stripe Setup

## Create Stripe Account

1. Create Stripe account
2. Open Developers section
3. Copy:
   - Secret Key
   - Publishable Key
   - Webhook Secret

## Example

env
STRIPE_SECRET_KEY=your_secret_key
VITE_STRIPE_PUBLIC_KEY=your_publishable_key
STRIPE_WEBHOOK_SECRET=your_webhook_secret

---

# Backend Installation

cd server
npm install

---

# Frontend Installation

cd client
npm install

---

# Running Backend

cd server
npm run dev

Backend runs on:

http://localhost:port

---

# Running Frontend

cd client
npm run dev

Frontend runs on:  
http://localhost:port

# Suggested Backend Scripts

json
"scripts": {
"dev": "tsx watch src/server.ts",
"build": "tsc",
"start": "node dist/server.js"
}

---

# Suggested Frontend Scripts

json
"scripts": {
"dev": "vite",
"build": "tsc && vite build",
"preview": "vite preview"
}

---

# Clear Docker Cache

docker system prune -a

---

# Notes

- Never commit `.env` files
- Use strong JWT secrets in production
- Use HTTPS in production
- Ensure MongoDB Atlas IP whitelist is configured
- Ensure Redis URL is accessible
- Store secrets securely
- Use production environment variables during deployment
