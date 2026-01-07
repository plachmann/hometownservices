# Quickstart: Hometown Services Website

**Feature**: 001-hometown-services-site
**Date**: 2026-01-05

## Prerequisites

- Node.js 20.x LTS
- pnpm (recommended) or npm
- PostgreSQL database (local or Vercel Postgres/Neon)
- CAPTCHA account (hCaptcha or Cloudflare Turnstile)

## Initial Setup

### 1. Create Next.js Project

```bash
# From repository root
npx create-next-app@14 . --typescript --tailwind --eslint --app --src-dir --import-alias "@/*"
```

### 2. Install Dependencies

```bash
# Core dependencies
pnpm add @prisma/client iron-session fuse.js react-leaflet leaflet bcryptjs zod

# shadcn/ui setup
pnpm dlx shadcn-ui@latest init

# Dev dependencies
pnpm add -D prisma @types/bcryptjs @types/leaflet vitest @testing-library/react @vitejs/plugin-react jsdom
```

### 3. Initialize Prisma

```bash
# Initialize Prisma with PostgreSQL
pnpm prisma init --datasource-provider postgresql
```

Copy the schema from `data-model.md` to `prisma/schema.prisma`.

### 4. Environment Variables

Create `.env.local`:

```env
# Database (Vercel Postgres format)
DATABASE_URL="postgres://..."
DIRECT_DATABASE_URL="postgres://..."

# Session encryption (generate: openssl rand -base64 32)
SESSION_SECRET="your-32-character-secret-here"

# CAPTCHA (choose one)
NEXT_PUBLIC_HCAPTCHA_SITEKEY="your-site-key"
HCAPTCHA_SECRET="your-secret-key"
# OR
NEXT_PUBLIC_TURNSTILE_SITEKEY="your-site-key"
TURNSTILE_SECRET="your-secret-key"

# Initial admin (for seed script)
ADMIN_USERNAME="admin"
ADMIN_PASSWORD="secure-password-here"
```

### 5. Database Setup

```bash
# Generate Prisma client
pnpm prisma generate

# Run migrations
pnpm prisma migrate dev --name init

# Seed initial data
pnpm prisma db seed
```

### 6. Add shadcn/ui Components

```bash
# Essential components
pnpm dlx shadcn-ui@latest add button card input textarea form label select dialog alert-description
pnpm dlx shadcn-ui@latest add navigation-menu dropdown-menu table badge
```

## Development

```bash
# Start development server
pnpm dev

# Run tests
pnpm test

# Type check
pnpm type-check
```

## Project Structure Quick Reference

```
src/
├── app/
│   ├── (public)/          # Public pages (homepage, services, contact)
│   ├── admin/             # Admin dashboard and management
│   └── api/               # API routes
├── components/
│   ├── ui/                # shadcn/ui components
│   ├── layout/            # Header, Footer, Navigation
│   ├── services/          # ServiceCard, ServiceList
│   ├── search/            # SearchBar, SearchResults
│   ├── contact/           # ContactForm
│   └── map/               # ServiceAreaMap
├── lib/
│   ├── prisma.ts          # Prisma client singleton
│   ├── auth.ts            # iron-session configuration
│   ├── search.ts          # Fuse.js setup
│   └── captcha.ts         # CAPTCHA verification
└── types/                 # TypeScript types
```

## Key Implementation Notes

### Leaflet SSR Handling

Leaflet requires the `window` object. Use dynamic imports:

```typescript
// components/map/ServiceAreaMap.tsx
'use client';

import dynamic from 'next/dynamic';

const MapContainer = dynamic(
  () => import('react-leaflet').then((mod) => mod.MapContainer),
  { ssr: false }
);

const Circle = dynamic(
  () => import('react-leaflet').then((mod) => mod.Circle),
  { ssr: false }
);

const TileLayer = dynamic(
  () => import('react-leaflet').then((mod) => mod.TileLayer),
  { ssr: false }
);
```

### Prisma Client Singleton

```typescript
// lib/prisma.ts
import { PrismaClient } from '@prisma/client';

const globalForPrisma = globalThis as unknown as { prisma: PrismaClient };

export const prisma = globalForPrisma.prisma ?? new PrismaClient();

if (process.env.NODE_ENV !== 'production') globalForPrisma.prisma = prisma;
```

### iron-session Setup

```typescript
// lib/auth.ts
import { SessionOptions } from 'iron-session';

export interface SessionData {
  isAdmin: boolean;
  username?: string;
}

export const sessionOptions: SessionOptions = {
  password: process.env.SESSION_SECRET!,
  cookieName: 'hometown_admin_session',
  cookieOptions: {
    secure: process.env.NODE_ENV === 'production',
    httpOnly: true,
    sameSite: 'strict',
  },
};
```

### Fuse.js Search Setup

```typescript
// lib/search.ts
import Fuse from 'fuse.js';
import type { Service } from '@prisma/client';

export function createServiceSearch(services: Service[]) {
  return new Fuse(services, {
    keys: [
      { name: 'name', weight: 2 },
      { name: 'description', weight: 1 },
      { name: 'category.name', weight: 1.5 },
    ],
    threshold: 0.4,
    includeScore: true,
  });
}
```

## Deployment (Vercel)

1. Connect repository to Vercel
2. Add Vercel Postgres database
3. Set environment variables in Vercel dashboard
4. Deploy

```bash
# Or via CLI
vercel
vercel --prod
```

## Testing Strategy

```typescript
// vitest.config.ts
import { defineConfig } from 'vitest/config';
import react from '@vitejs/plugin-react';

export default defineConfig({
  plugins: [react()],
  test: {
    environment: 'jsdom',
    setupFiles: ['./tests/setup.ts'],
  },
});
```

Key test areas:
- Unit tests: Search functionality, form validation, utility functions
- Integration tests: API routes (services, inquiries, auth)
- Component tests: Forms, search bar, service cards
