# AI-Powered Multi-Vendor E-Commerce Platform

A production-grade full stack multi-vendor e-commerce platform built with MERN stack architecture, AI-powered product search, real-time communication, analytics dashboards, and scalable backend infrastructure.

---

## 🚀 Live Deployment

- **Frontend**: https://ai-ecommerce-six.vercel.app
- **Backend API**: https://ai-ecommerce-kbv2.onrender.com
- **API Documentation (Swagger)**: https://ai-ecommerce-kbv2.onrender.com/api/v1/docs

---

## Features

### Authentication & Authorization

- JWT Authentication
- Refresh Token System
- Role-Based Access Control
- Protected Routes
- Vendor / Buyer / Admin Roles
- Password Hashing
- Secure Authentication Flow

### Multi-Vendor Product System

- Vendor Product Management
- Product Categories & Tags
- Product Variants
- Inventory Management
- Multiple Product Images
- SEO Friendly Slugs
- Product Ratings & Reviews

### AI Smart Product Assistant

- Natural Language Product Search
- AI-Based Product Recommendations
- Semantic Product Filtering
- Chat History Management
- Intelligent Ranking System

### Real-Time Features

- Real-Time Notifications
- Live Order Tracking
- Real-Time Stock Updates
- Socket.IO Integration
- Live Dashboard Updates

### Shopping System

- Add to Cart
- Quantity Management
- Checkout Flow
- Coupon System
- Order History
- Payment Workflow

### Analytics Dashboard

#### Admin Dashboard

- Revenue Analytics
- User Analytics
- Order Analytics
- Vendor Monitoring
- Platform Statistics

#### Vendor Dashboard

- Sales Reports
- Revenue Monitoring
- Product Analytics
- Inventory Tracking
- Order Management

### Performance Optimization

- Redis Caching
- Pagination
- Debounced Search
- Lazy Loading
- Code Splitting
- Optimized API Queries

### Security

- Helmet.js
- Rate Limiting
- XSS Protection
- MongoDB Sanitization
- Secure JWT Storage
- Password Hashing

---

# Tech Stack

## Frontend

- React.js
- Vite
- TypeScript
- Redux Toolkit
- RTK Query
- Zustand
- React Context API
- Tailwind CSS
- Recharts
- Socket.IO Client
- React Router DOM

## Backend

- Node.js
- Express.js
- TypeScript
- MongoDB Atlas
- Mongoose
- Redis
- JWT Authentication
- Socket.IO
- Swagger Documentation

## DevOps

- Docker
- Docker Compose
- Render Deployment
- Vercel Deployment

---

# Project Structure

## Backend Structure

```
server/
│
├── src/
│ ├── config/
│ ├── controllers/
│ ├── docs/
│ ├── jobs/
│ ├── middleware/
│ ├── models/
│ ├── routes/
│ ├── services/
│ ├── sockets/
│ ├── utils/
│ ├── validators/
│ ├── app.ts
│ ├── routes.ts
│ ├── seed.ts
│ └── server.ts
│
├── Dockerfile
├── compose.yaml
├── package.json
└── tsconfig.json
```

## Frontend Structure

```
client/
│
├── src/
│ ├── components/
│ ├── pages/
│ ├── layout/
│ ├── store/
│ │ ├── api/
│ │ ├── slices/
│ │ ├── zustand/
│ │ ├── context/
│ │ ├── hooks/
│ │ └── socket/
│ ├── utils/
│ ├── App.tsx
│ └── main.tsx
│
├── public/
├── vite.config.ts
├── package.json
└── tsconfig.json
```

---

# System Architecture

- Frontend communicates with backend using REST APIs and RTK Query
- Redis used for caching and session optimization
- MongoDB Atlas used as primary database
- Socket.IO handles real-time communication
- AI search layer processes natural language product queries
- Docker used for containerization

---

# API Documentation

Complete Swagger documentation is available at:

**[https://ai-ecommerce-kbv2.onrender.com/api/v1/docs](https://ai-ecommerce-kbv2.onrender.com/api/v1/docs)**

The API documentation includes:
- All available endpoints
- Request/response schemas
- Authentication details
- Parameter documentation
- Real-world examples

---

# Installation

## Clone Repository

```bash
git clone <repository-url>
cd ai-ecommerce
```

## Backend Setup

```bash
cd server
npm install
```

### Run Development Server

```bash
npm run dev
```

### Build Backend

```bash
npm run build
```

### Start Production Server

```bash
npm start
```

## Frontend Setup

```bash
cd client
npm install
```

### Run Frontend

```bash
npm run dev
```

### Build Frontend

```bash
npm run build
```

## Docker Setup

### Run Entire Application

```bash
docker compose up --build api-dev
docker compose up --build api-prod
```

### Stop Containers

```bash
docker compose down
```

---

# Environment Variables

Environment setup guide is available in: **ENVIRONMENT_SETUP.md**

---

# Redis Integration

Redis is used for:

- API response caching
- AI search optimization
- Session management
- Performance enhancement
- Real-time event optimization

---

# AI Product Search Examples

Users can search products using natural language queries like:

```
Show me gaming laptops under 200k with RTX graphics
```

```
Find wireless headphones with noise cancellation
```

```
Show me affordable office chairs for long sitting
```

---

# Deployment

## Current Deployment Platforms

### Frontend
- **Vercel** - https://ai-ecommerce-six.vercel.app

### Backend
- **Render** - https://ai-ecommerce-kbv2.onrender.com

### Database
- **MongoDB Atlas**

### Redis
- **Redis Cloud**

---

# Production Features

- Scalable modular architecture
- Production-ready API structure
- Clean folder organization
- Reusable frontend architecture
- Centralized state management
- Optimized database queries
- Secure authentication system
- Real-time communication support
- Elastic Search

---

# Future Improvements

- AI Image Search
- Microservices Architecture
- CI/CD Pipeline
- Kubernetes Deployment

---

# Author

Shahzaib Khan
