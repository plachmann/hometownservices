# Remove Redis/Upstash Rate Limiting Implementation Plan

> **For Claude:** REQUIRED SUB-SKILL: Use superpowers:executing-plans to implement this plan task-by-task.

**Goal:** Remove Redis/Upstash dependency to simplify the stack, relying on CAPTCHA for bot protection.

**Architecture:** Delete the rate limiting module entirely and remove all references from API routes, dependencies, environment config, and documentation.

**Tech Stack:** Next.js 14, npm package management

---

### Task 1: Remove rate limiting from login route

**Files:**
- Modify: `src/app/api/admin/login/route.ts:15,20-26`

**Step 1: Remove rate limit import and usage**

Remove line 15 (the import) and lines 20-26 (the rate limit check). The file should go from:

```typescript
import { loginRatelimit, getClientIp, checkRateLimit } from "@/lib/ratelimit";
```

to having no ratelimit import, and the POST handler should start directly with:

```typescript
export async function POST(request: NextRequest) {
  try {
    const body = await request.json();
```

**Step 2: Verify the app builds**

Run: `npm run build`
Expected: Build succeeds (may have type errors until ratelimit.ts is deleted)

**Step 3: Commit**

```bash
git add src/app/api/admin/login/route.ts
git commit -m "refactor: remove rate limiting from login route"
```

---

### Task 2: Remove rate limiting from inquiries route

**Files:**
- Modify: `src/app/api/inquiries/route.ts:12,18-23`

**Step 1: Remove rate limit import and usage**

Remove line 12 (the import) and lines 18-23 (the rate limit check). The POST handler should start with:

```typescript
export async function POST(request: NextRequest) {
  try {
    const body = await request.json();
```

**Step 2: Verify the app builds**

Run: `npm run build`
Expected: Build succeeds (may have warnings about unused imports until ratelimit.ts is deleted)

**Step 3: Commit**

```bash
git add src/app/api/inquiries/route.ts
git commit -m "refactor: remove rate limiting from inquiries route"
```

---

### Task 3: Delete rate limiting module

**Files:**
- Delete: `src/lib/ratelimit.ts`

**Step 1: Delete the file**

```bash
rm src/lib/ratelimit.ts
```

**Step 2: Verify the app builds**

Run: `npm run build`
Expected: Build succeeds with no errors

**Step 3: Run tests**

Run: `npm test`
Expected: All tests pass

**Step 4: Commit**

```bash
git add -A
git commit -m "refactor: delete rate limiting module"
```

---

### Task 4: Remove npm dependencies

**Files:**
- Modify: `package.json`

**Step 1: Uninstall packages**

```bash
npm uninstall @upstash/redis @upstash/ratelimit
```

**Step 2: Verify package.json updated**

Confirm `@upstash/redis` and `@upstash/ratelimit` are no longer in dependencies.

**Step 3: Verify the app builds**

Run: `npm run build`
Expected: Build succeeds

**Step 4: Run tests**

Run: `npm test`
Expected: All tests pass

**Step 5: Commit**

```bash
git add package.json package-lock.json
git commit -m "chore: remove upstash redis dependencies"
```

---

### Task 5: Update environment configuration

**Files:**
- Modify: `.env.example:27-30`

**Step 1: Remove Upstash environment variables**

Remove the following section from `.env.example`:

```
# Rate Limiting (Upstash Redis) - https://upstash.com/
# Optional: If not configured, rate limiting is disabled
UPSTASH_REDIS_REST_URL="https://your-instance.upstash.io"
UPSTASH_REDIS_REST_TOKEN="your-upstash-token"
```

**Step 2: Commit**

```bash
git add .env.example
git commit -m "chore: remove upstash env vars from example"
```

---

### Task 6: Update README documentation

**Files:**
- Modify: `README.md:15,134-138,166-168`

**Step 1: Remove rate limiting from tech stack**

Remove line 15:
```
- **Rate Limiting**: Upstash Redis (optional)
```

**Step 2: Remove rate limiting from security section**

Remove lines 134-138 (the rate limiting bullet and sub-bullets, plus the setup instruction):
```
- **Rate Limiting**: Optional Upstash Redis integration
  - Login: 5 attempts per 15 minutes per IP
  - Contact form: 3 submissions per hour per IP

To enable rate limiting, set up a free [Upstash Redis](https://upstash.com/) database and add the credentials to your `.env` file.
```

**Step 3: Remove rate limiting from environment variables section**

Remove lines 166-168:
```
# Rate Limiting (optional) - https://upstash.com/
UPSTASH_REDIS_REST_URL="https://your-instance.upstash.io"
UPSTASH_REDIS_REST_TOKEN="your-upstash-token"
```

**Step 4: Commit**

```bash
git add README.md
git commit -m "docs: remove rate limiting references from README"
```

---

### Task 7: Final verification

**Step 1: Full build**

Run: `npm run build`
Expected: Build succeeds

**Step 2: Run all tests**

Run: `npm test`
Expected: All tests pass

**Step 3: Grep for any remaining references**

Run: `grep -ri "ratelimit\|upstash" --include="*.ts" --include="*.tsx" --include="*.md" --include="*.json" .`
Expected: No matches in source files (may match in specs/ or docs/plans/ which is fine)

**Step 4: Start dev server and test manually**

Run: `npm run dev`
Test:
- Submit contact form (should work with CAPTCHA)
- Login to admin (should work)

**Step 5: Final commit if any cleanup needed**

```bash
git add -A
git commit -m "chore: final cleanup after removing redis"
```
