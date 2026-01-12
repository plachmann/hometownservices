# Hometown Services

A modern, responsive website for local service businesses built with Next.js 14, featuring an admin dashboard, contact form management, and service listings.

## Tech Stack

- **Framework**: Next.js 14 (App Router)
- **Language**: TypeScript 5.x
- **Database**: PostgreSQL via Prisma ORM
- **Styling**: Tailwind CSS + shadcn/ui
- **Authentication**: iron-session
- **Maps**: React-Leaflet + OpenStreetMap
- **Search**: Fuse.js (client-side fuzzy search)
- **CAPTCHA**: Cloudflare Turnstile (or hCaptcha)
- **Rate Limiting**: Upstash Redis (optional)
- **Hosting**: Vercel

## Getting Started

### Prerequisites

- Node.js 20.x LTS
- PostgreSQL database (or Vercel Postgres / Neon)

### Installation

1. Clone the repository:
   ```bash
   git clone <repository-url>
   cd hometownservices
   ```

2. Install dependencies:
   ```bash
   npm install
   ```

3. Set up environment variables:
   ```bash
   cp .env.example .env
   ```

   Edit `.env` with your configuration (see [Environment Variables](#environment-variables))

4. Set up the database:
   ```bash
   npm run db:generate
   npm run db:push
   npm run db:seed
   ```

5. Start the development server:
   ```bash
   npm run dev
   ```

6. Open [http://localhost:3000](http://localhost:3000)

## Project Structure

```
src/
├── app/
│   ├── (public)/           # Public pages
│   │   ├── page.tsx        # Homepage
│   │   ├── contact/        # Contact page
│   │   ├── services/       # Services listing & detail
│   │   └── service-area/   # Service area map
│   ├── admin/              # Admin dashboard
│   │   ├── login/          # Admin login
│   │   └── (dashboard)/    # Protected admin pages
│   ├── api/                # API routes
│   └── globals.css         # Global styles & CSS variables
├── components/
│   ├── ui/                 # shadcn/ui components
│   └── ...                 # Feature components
├── lib/                    # Utilities & configuration
└── types/                  # TypeScript type definitions

prisma/
├── schema.prisma           # Database schema
└── seed.ts                 # Database seed script
```

## Admin Dashboard

Access the admin panel at `/admin` (default credentials set in `.env`).

### Admin Pages

| Page | Path | Description |
|------|------|-------------|
| Login | `/admin/login` | Admin authentication |
| Dashboard | `/admin` | Main admin dashboard |
| Inquiries | `/admin/inquiries` | View/manage contact form submissions |
| Services | `/admin/services` | Manage services listing |
| Settings | `/admin/settings` | Site settings configuration |

### Admin API Endpoints

| Endpoint | Methods | Description |
|----------|---------|-------------|
| `/api/admin/login` | POST | Authenticate admin user |
| `/api/admin/logout` | POST | End admin session |
| `/api/admin/inquiries` | GET | List all contact inquiries |
| `/api/admin/inquiries/[id]` | GET, PATCH, DELETE | View/update/delete specific inquiry |
| `/api/admin/settings` | GET, PUT | Get/update site settings |

## Public API Endpoints

| Endpoint | Methods | Description |
|----------|---------|-------------|
| `/api/inquiries` | POST | Submit contact form |
| `/api/services` | GET | List all services |
| `/api/services/[slug]` | GET | Get service by slug |
| `/api/categories` | GET | List service categories |
| `/api/site-settings` | GET | Public site settings |

## Contact Form

The contact form saves submissions to the database. View them in the admin panel at `/admin/inquiries`.

**Current behavior**: Submissions are stored in the database only. Email notifications are not yet implemented.

**Required for CAPTCHA**: Set up Cloudflare Turnstile or hCaptcha keys in your `.env` file.

## Security Features

- **Password Hashing**: bcrypt with cost factor 12
- **Session Management**: Encrypted cookies via iron-session (httpOnly, secure, sameSite)
- **Input Validation**: Zod schemas on all API inputs
- **SQL Injection Protection**: Prisma ORM with parameterized queries
- **CAPTCHA**: Bot protection on contact form
- **Rate Limiting**: Optional Upstash Redis integration
  - Login: 5 attempts per 15 minutes per IP
  - Contact form: 3 submissions per hour per IP

To enable rate limiting, set up a free [Upstash Redis](https://upstash.com/) database and add the credentials to your `.env` file.

## Environment Variables

Create a `.env` file based on `.env.example`:

```bash
# Database (Vercel Postgres / Neon)
DATABASE_URL="postgresql://user:password@host:5432/database?sslmode=require"
DIRECT_DATABASE_URL="postgresql://user:password@host:5432/database?sslmode=require"

# Session encryption (generate with: openssl rand -base64 32)
SESSION_SECRET="your-32-character-secret-here"

# CAPTCHA Provider: "turnstile" (default) or "hcaptcha"
CAPTCHA_PROVIDER="turnstile"

# Cloudflare Turnstile - https://www.cloudflare.com/products/turnstile/
NEXT_PUBLIC_CAPTCHA_SITE_KEY="your-turnstile-site-key"
CAPTCHA_SECRET_KEY="your-turnstile-secret-key"

# Initial Admin User (used by seed script)
ADMIN_USERNAME="admin"
ADMIN_PASSWORD="change-this-secure-password"

# Site URL
NEXT_PUBLIC_SITE_URL="http://localhost:3000"

# Rate Limiting (optional) - https://upstash.com/
UPSTASH_REDIS_REST_URL="https://your-instance.upstash.io"
UPSTASH_REDIS_REST_TOKEN="your-upstash-token"
```

## Available Scripts

| Command | Description |
|---------|-------------|
| `npm run dev` | Start development server |
| `npm run build` | Build for production |
| `npm run start` | Start production server |
| `npm run lint` | Run ESLint |
| `npm test` | Run tests (Vitest) |
| `npm run db:generate` | Generate Prisma client |
| `npm run db:push` | Push schema to database |
| `npm run db:migrate` | Run database migrations |
| `npm run db:seed` | Seed database with initial data |

## Color Theme

The site uses a subtle orange and black color scheme:

- **Primary (Orange)**: `hsl(25, 90%, 35%)` - Burnt orange for buttons and CTAs
- **Foreground (Near-Black)**: `hsl(20, 8%, 18%)` - Warm charcoal for text
- **Background**: `hsl(30, 15%, 97%)` - Warm off-white

Colors are defined as CSS custom properties in `src/app/globals.css` and support both light and dark modes.

## Deployment

The site is configured for deployment on Vercel:

1. Connect your repository to Vercel
2. Set environment variables in Vercel dashboard
3. Deploy

Merging to `main` triggers automatic deployment.

## License

Private - All rights reserved.
