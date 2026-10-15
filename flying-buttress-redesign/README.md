# Flying Buttress | Website Redesign Concept

Version: October 9, 2026. Static website and brand concept for stakeholder review. Not deployed.

## Preview

Open `index.html` in a browser, or open `homepage-standalone.html` to preview the home page without needing its supporting asset files. The full website uses relative links and works as a static site.

## Pages

- `index.html` - Home / positioning / services / proof / testimonials / insights
- `services.html` - Six main service lines
- `industries.html` - Architecture, engineering, multidisciplinary firms
- `work.html` - Cloud modernization case study and selected testimonials
- `insights.html` - Existing company articles and new article concepts
- `about.html` - Company purpose and founding story
- `team.html` - Founder feature and team grid (linked from the header nav, footer and About)
- `contact.html` - Contact and demonstration inquiry form
- `brand.html` - Internal identity direction and color/typography guidance

## Design direction

The proposed logo translates the flying buttress into an architectural symbol, without replacing the company's name. The visual language combines structured geometry, original SVG line drawings, architectural navy (`#152F3B`), warm limestone (`#F1EFE8`), and terracotta (`#EF7054`). The site makes a deliberate shift away from generic MSP design toward technology expertise rooted in architecture, engineering and design (AED).

## Working features

- Responsive desktop, tablet and mobile layouts
- Local internal navigation among the eight pages
- Mobile navigation with accessible expanded state and Escape-key support
- Home-page testimonial carousel
- Working outbound links to published articles
- Basic SEO metadata and accessible heading/link structure
- Contact form posts to `/api/contact` (Azure Function in `api/`, sends via Azure Communication Services Email); `Copy inquiry` still works

## Important launch requirements

1. Confirm leadership approves the new brand mark, language, service scope, case study and published testimonials.
2. Contact form: deploy to Azure Static Web Apps and configure the Azure Communication Services Email settings below. Consider adding bot protection (e.g., Cloudflare Turnstile) if spam appears, and a CRM/PSA integration later by extending `api/contact/index.js`.
3. Choose and configure hosting, domain, HTTPS, security headers, and backups.
4. Connect a CMS for ongoing articles if desired. The three concept article ideas are not published articles.
5. Migrate selected existing articles, assets and SEO metadata and map old URLs to 301 redirects if URL paths change.
6. Add a finalized privacy policy, any required cookie notices, analytics and a real sitemap/robots rules.
7. Confirm production contact details, social links and technical/legal copy.
8. Test on actual devices, cross-browser combinations, and screen readers before launch.
9. Team page: photos currently hotlink to the existing flyingbuttress.com uploads. Copy the remaining ones into `assets/team/` (Cain Piho is already local) and update the paths before the old site is replaced. Confirm titles (shown as "Title to confirm"), current staff list, and photo permissions.
10. Remove `brand.html` from the live site once the design is approved; it is a review-only page.

## Notes on content provenance

The founding year (2010), founder story and 120-person, three-office cloud case study are based on the company's April 2026 aec+tech interview: https://www.aecplustech.com/blog/what-architecture-firms-need-from-it-

Testimonials, the business phone number and service descriptions are adapted from the current Flying Buttress website: https://flyingbuttress.com/

Published legacy articles link to the company's current URLs. The featured interview links to aec+tech.

## Azure hosting and contact form

- Host on Azure Static Web Apps. `staticwebapp.config.json` (in this folder, the app location) sets the Node 20 API runtime and basic security headers. `api/` at the repository root holds the managed function (classic `function.json` model; do not add a `main` field to `api/package.json`).
- Create an Azure Communication Services resource and an Email Communication Service, add and verify a sending domain (SPF/DKIM on flyingbuttress.com recommended for deliverability), and connect the domain to the Communication Service.
- In the Static Web App, add application settings: `ACS_CONNECTION_STRING`, `CONTACT_FROM` (a sender address on the verified domain) and `CONTACT_TO` (recipient, comma-separated for several).
- In the Static Web Apps setup, use app location `flying-buttress-redesign`, API location `api`, and no build command.
- Local test (from the repo root): `swa start flying-buttress-redesign --api-location api` with the same settings in `api/local.settings.json`. Opening the HTML files directly will show the form's failure message because `/api/contact` is not available.

## Installation

Unzip the archive and open `index.html` (or serve the folder from any static host). No build tooling, JavaScript package manager, font files or backend is required for preview. CSS/JS/SVG are contained in `assets/`.
