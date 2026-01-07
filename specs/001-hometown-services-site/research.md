# Research: Hometown Services Website

**Date**: 2026-01-05
**Feature**: 001-hometown-services-site

## Research Areas

### 1. CAPTCHA Implementation for Next.js

**Decision**: Use hCaptcha (free tier) or Cloudflare Turnstile

**Rationale**:
- hCaptcha offers a free tier suitable for low-traffic sites
- Cloudflare Turnstile is privacy-focused and often invisible to users
- Both integrate easily with Next.js API routes
- reCAPTCHA v3 is also viable but requires Google account

**Alternatives Considered**:
- reCAPTCHA v2: More intrusive visual challenges, Google dependency
- reCAPTCHA v3: Score-based, may require tuning thresholds
- Custom honeypot: Insufficient for sophisticated bots

**Implementation Approach**:
```typescript
// Client: Include CAPTCHA widget in form
// Server: Verify token in API route before processing submission
const verifyResponse = await fetch('https://hcaptcha.com/siteverify', {
  method: 'POST',
  body: new URLSearchParams({
    secret: process.env.HCAPTCHA_SECRET!,
    response: token,
  }),
});
```

### 2. React-Leaflet with OpenStreetMap for Service Area

**Decision**: React-Leaflet v4 with Leaflet.js and OpenStreetMap tiles

**Rationale**:
- Free, open-source, no API key required for basic tiles
- React-Leaflet provides declarative React components
- Circle overlay supports radius-based service area display
- Good mobile support with touch interactions

**Alternatives Considered**:
- Mapbox: Excellent but requires API key and has usage limits
- Google Maps: Requires API key and billing account
- MapLibre: Good alternative but less React ecosystem support

**Implementation Approach**:
```typescript
// Dynamic import to avoid SSR issues
const MapContainer = dynamic(() => import('react-leaflet').then(m => m.MapContainer), { ssr: false });

// Display service area as circle
<Circle center={[lat, lng]} radius={radiusInMeters} />
```

**Key Considerations**:
- Must use dynamic imports (Leaflet requires window object)
- Include Leaflet CSS in layout
- Convert miles to meters for Circle radius (1 mile = 1609.34 meters)

### 3. Fuse.js for Fuzzy Search

**Decision**: Fuse.js with client-side search

**Rationale**:
- Lightweight (~4KB gzipped), no server-side search infrastructure needed
- Excellent fuzzy matching for typos and partial matches
- Configurable threshold and keys for relevance tuning
- Works well with small datasets (<1000 items)

**Alternatives Considered**:
- Algolia: Overkill for 18 services, has cost at scale
- Elasticsearch: Heavy infrastructure for simple use case
- PostgreSQL full-text search: Requires server round-trip, less fuzzy

**Implementation Approach**:
```typescript
const fuse = new Fuse(services, {
  keys: ['name', 'description', 'category.name'],
  threshold: 0.4, // 0 = exact, 1 = match anything
  includeScore: true,
});
const results = fuse.search(query);
```

### 4. iron-session for Admin Authentication

**Decision**: iron-session v8 with encrypted cookies

**Rationale**:
- Stateless session management (no database session table needed)
- Encrypted cookies prevent tampering
- Simple API, works well with Next.js App Router
- No external dependencies (Redis, etc.)

**Alternatives Considered**:
- NextAuth.js: Overkill for single admin user, complex setup
- JWT in localStorage: Security concerns (XSS vulnerable)
- Database sessions: Adds complexity for single-user scenario

**Implementation Approach**:
```typescript
// lib/auth.ts
export const sessionOptions: SessionOptions = {
  password: process.env.SESSION_SECRET!, // 32+ chars
  cookieName: 'hometown_admin_session',
  cookieOptions: {
    secure: process.env.NODE_ENV === 'production',
    httpOnly: true,
    sameSite: 'strict',
  },
};

// Middleware pattern for protected routes
export async function requireAdmin(req: NextRequest) {
  const session = await getIronSession(cookies(), sessionOptions);
  if (!session.isAdmin) redirect('/admin/login');
}
```

### 5. PostgreSQL on Vercel

**Decision**: Vercel Postgres (powered by Neon) or direct Neon connection

**Rationale**:
- Native integration with Vercel deployment
- Serverless-friendly connection pooling
- Free tier sufficient for MVP traffic
- Prisma ORM provides excellent DX and type safety

**Alternatives Considered**:
- Supabase: Good but adds another service to manage
- PlanetScale: MySQL-based, spec requires PostgreSQL
- Railway: Good but separate from Vercel ecosystem

**Implementation Approach**:
```typescript
// prisma/schema.prisma
datasource db {
  provider = "postgresql"
  url      = env("DATABASE_URL")
  directUrl = env("DIRECT_DATABASE_URL") // For migrations
}
```

### 6. Service Category Organization

**Decision**: 5 logical categories based on service types

**Rationale**: Groups services by customer mental model (what type of work)

| Category | Services |
|----------|----------|
| **Construction & Contracting** | Project Management, Construction Contracting, Demolition, Framing |
| **Exterior & Roofing** | Siding, Roofing, Deck Construction, Driveway Installation |
| **Interior Finishing** | Flooring, Cabinet Installation, Trims & Doors, Basement Finishing |
| **Mechanical Systems** | Plumbing, Electrical, HVAC |
| **Outdoor & Specialty** | Lawn Care, Fiberglass Pool Installation, Maintenance |

**Alternatives Considered**:
- By trade (subcontracted vs direct): Less intuitive for customers
- Alphabetical only: No logical grouping
- By project size: Hard to define boundaries

### 7. Image Handling Strategy

**Decision**: Next.js Image component with public folder storage (MVP), migration path to cloud storage

**Rationale**:
- Simplest for MVP with small number of services
- Next.js Image provides automatic optimization
- No additional service costs
- Easy migration to Vercel Blob or S3 later

**Implementation Approach**:
- Store service images in `/public/images/services/`
- Use Next.js `<Image>` for automatic optimization
- Accept image URL field in admin for future flexibility

## Technology Stack Summary

| Layer | Technology | Version |
|-------|------------|---------|
| Framework | Next.js (App Router) | 14.x |
| Language | TypeScript | 5.x |
| Styling | Tailwind CSS | 3.x |
| Components | shadcn/ui | latest |
| Database | PostgreSQL | 15+ |
| ORM | Prisma | 5.x |
| Search | Fuse.js | 7.x |
| Maps | React-Leaflet + Leaflet | 4.x / 1.9.x |
| Auth | iron-session | 8.x |
| CAPTCHA | hCaptcha or Turnstile | latest |
| Testing | Vitest + RTL | latest |
| Hosting | Vercel | - |

## Open Questions Resolved

All technical uncertainties from the specification have been addressed. No NEEDS CLARIFICATION items remain.
