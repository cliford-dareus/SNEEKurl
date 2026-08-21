# SNEEKurl (LinkWise)

A beautiful and powerful **URL shortener** + **link-in-bio** web application.

Create short links, custom QR codes, track detailed analytics, and build link-in-bio pages — with a free guest tier and paid plans.

> **Note:** The project is currently named **SNEEKurl** in the repository. A rename to **LinkWise** is planned.

---

## Features

- **Smart URL Shortening**
  - Auto-generated short codes (nanoid) or custom backhalves
  - Guest mode (limited links that expire quickly)
  - Authenticated accounts with higher limits
  - Optional password protection on links

- **Link-in-Bio Pages**
  - Create public pages with a custom slug
  - Organize links by category
  - Theme support

- **Analytics**
  - Click tracking with geo data (country, region, city)
  - Device, browser, OS, and referrer insights
  - Charts and dashboards (Nivo / Recharts)

- **QR Codes**
  - Generate and customize QR codes for your short links

- **Monetization**
  - Free, Pro, and Enterprise plans (Stripe)
  - Plan-based limits on links and pages

- **Security & DX**
  - JWT auth + refresh tokens
  - CSRF protection
  - Rate limiting (general, auth, URL creation, guests)
  - Helmet, secure cookies, bcrypt password hashing
  - FingerprintJS for guest identification

---

## Tech Stack

| Layer       | Technologies                                      |
|-------------|---------------------------------------------------|
| **Frontend**    | React 18, TypeScript, Vite, Tailwind CSS, Redux Toolkit, Framer Motion, Radix UI, Nivo/Recharts |
| **Backend**     | Node.js, Express, TypeScript, Mongoose            |
| **Database**    | MongoDB                                           |
| **Auth**        | JWT, Passport.js, bcrypt, CSRF                    |
| **Payments**    | Stripe                                            |
| **Uploads**     | UploadThing                                       |
| **Other**       | geoip-lite, nanoid, Nodemailer, node-cron, ioredis |

---

## Getting Started

### Prerequisites

- Node.js 18+
- MongoDB (local or Atlas)
- Stripe account (for payments)
- UploadThing account (for file uploads)
- (Optional) Redis — recommended for production rate limiting

### 1. Clone the repository

```bash
git clone https://github.com/cliford-dareus/SNEEKurl.git
cd SNEEKurl
```

### 2. Server setup

```bash
cd server
cp .env.example .env
# Edit .env with MONGO_URI, JWT_SECRET, CLIENT_URL, Stripe keys, etc.
npm install
npm run dev
```

The API runs on `http://localhost:4000` by default.

### 3. Client setup

```bash
cd ../client
# Ensure API_URL in src/Utils/common.ts points to http://localhost:4000
npm install
npm run dev
```

Frontend: `http://localhost:5173`.

### Environment variables

See `server/.env.example` for the full list (`JWT_SECRET`, `MONGO_URI`, `REDIS_URL`, `STRIPE_*`, `UPLOADTHING_TOKEN`, etc.).

---

## License

MIT

## Author

Built by [cliford-dareus](https://github.com/cliford-dareus)
