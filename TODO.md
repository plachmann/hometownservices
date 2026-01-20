# Hometown Services - Feature Roadmap

## Current State

The site has a solid foundation with:
- Service browsing with categories and fuzzy search (Fuse.js)
- Contact form with CAPTCHA and rate limiting
- Interactive service area map (React-Leaflet)
- Full admin panel for services, categories, inquiries, and settings

---

## High Priority - Quick Wins

| Feature | Effort | Why |
|---------|--------|-----|
| **Structured Data (JSON-LD)** | Low | LocalBusiness schema improves SEO and enables rich snippets |
| **Click-to-Call** | Low | Make phone numbers tappable - critical for mobile users |
| **Business Hours Display** | Low | Show hours with "open now" indicator |
| **Trust Badges** | Low | "Licensed & Insured", certifications, years in business |

---

## High Priority - Medium Effort

### Testimonials/Reviews System
- Add testimonials section on homepage and service pages
- Admin ability to curate and display customer reviews
- Database model for testimonials (name, quote, service, rating, date)
- Businesses with reviews see 45% more bookings

### Quote Request Forms
- Service-specific quote forms with structured fields
- Fields: project description, timeline, budget range, location
- Admin dashboard shows quote requests separately from general inquiries
- Source tracking (how customer found the business)

### Project Photo Gallery
- Before/after project photos per service category
- Admin upload capability for project images
- Lightbox gallery viewing experience
- Visual proof of work builds trust

---

## Medium Priority

### FAQ Section
- Service-specific FAQs (pricing ranges, timelines, what to expect)
- General business FAQs (payment methods, scheduling, warranties)
- FAQ schema markup for search engine visibility
- Admin ability to manage FAQ content
- Helps with voice search (40% of local searches are voice-based)

### Service Area Checker
- "Check if we serve your area" - user enters zip code or address
- List of specific cities/neighborhoods served
- Travel fee information for edge-of-service-area locations
- Integration with the existing map radius

### Email Notifications
- Send email to admin when contact inquiries are submitted
- Configurable notification settings
- Email templates for inquiry confirmation to customers

---

## Future Enhancements

### Online Scheduling / Appointment Booking
- Integration options: Calendly, SimplyBook.me (lower effort)
- Native scheduling system (higher effort, better UX)
- Start with consultation booking rather than service scheduling

### Chat Widget
- Third-party chat widget (Intercom, Tidio, Crisp)
- Simple AI chatbot for FAQ responses and inquiry capture
- Business hours indicator with expected response time

### Customer Self-Service Portal
- Inquiry status tracking (received, being reviewed, quote sent)
- Email notifications on status updates
- Access via unique link sent to email (no account required)

### Analytics Dashboard
- Inquiry trends over time
- Popular services report
- Source/channel tracking
- Conversion metrics

---

## Technical Debt / Gaps

| Item | Description |
|------|-------------|
| **Service Images** | Schema supports `imageUrl` but UI doesn't fully utilize it |
| **Email Notifications** | Contact submissions stored but not emailed to admin |
| **Multi-Admin Support** | Only one admin user; no user creation/management UI |
| **Test Coverage** | Minimal tests present - expand unit and integration tests |
| **Data Export** | No backup/export functionality for services or inquiries |
| **API Documentation** | No OpenAPI/Swagger docs |
| **Subcontractor Management** | Flag exists but no dedicated management interface |

---

## SEO & Performance Improvements

### Structured Data to Add
```json
{
  "@context": "https://schema.org",
  "@type": "LocalBusiness",
  "name": "Hometown Services",
  "serviceArea": { ... },
  "hasOfferCatalog": { ... }
}
```

### Additional Schema Types
- `Service` schema for each service page
- `FAQPage` schema for FAQ section
- `Review` schema for testimonials

### Mobile Optimizations
- Sticky header with phone number
- Touch-friendly service cards
- Swipeable image galleries
- Floating action button for quick contact

---

## Competitive Differentiation Ideas

1. **Personalized Service** - Highlight local business, not faceless corporation
2. **Transparent Pricing** - Even ballpark ranges build trust
3. **Project Guarantees** - Warranty information prominently displayed
4. **Local Community Connection** - Communities served, local involvement
5. **Emergency Services** - If applicable, highlight 24/7 availability

---

## Implementation Priority Matrix

| Feature | User Impact | Business Value | Effort | Priority |
|---------|-------------|----------------|--------|----------|
| Testimonials/Reviews | High | High | Medium | 1 |
| Quote Request Forms | High | High | Medium | 1 |
| Structured Data/Schema | Medium | High | Low | 2 |
| Click-to-Call Mobile | High | High | Low | 2 |
| Project Photo Gallery | High | Medium | Medium | 2 |
| Service Area Checker | Medium | Medium | Low | 3 |
| FAQ with Schema | Medium | Medium | Low | 3 |
| Email Notifications | Medium | High | Low | 3 |
| Online Booking | High | High | High | 4 |
| Chat Widget | Medium | Medium | Low | 4 |
| Analytics Dashboard | Low | High | Medium | 5 |

---

## Research Sources

- [Local Search Ranking Factors 2026](https://www.jasminedirectory.com/blog/local-search-ranking-factors-2026-the-business-directory-edition/)
- [Business Directory Listings for SEO](https://birdeye.com/blog/business-directory-listings/)
- [How to Create the Best Local Directory Website](https://www.brilliantdirectories.com/blog/how-to-create-the-best-local-directory-website)
- [Local SEO Trends for 2026](https://www.seo.com/blog/local-seo-strategy/)
- [WorkQuote Quote Request Features](https://workquote.app/app-quote-request-features)
- [Field Service Management Trends](https://www.servicepower.com/blog/2025-field-service-management-trends)
- [Local Lead Generation Strategies](https://broadly.com/blog/local-lead-generation/)
