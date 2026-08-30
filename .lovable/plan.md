# Final verification

The requested metadata and footer changes are implemented. Remaining work is final validation only:

1. Run a production build after the footer adjustment.
2. Re-check the rendered home page for Organization, WebSite, and WebPage JSON-LD.
3. Confirm the home page includes the expected Open Graph and Twitter title, description, and 1200×630 preview image.
4. Confirm the edition routes retain their route-specific preview images, WebPage schema, and BreadcrumbList schema.
5. Report the validation results and note that social platforms may need their preview caches refreshed after publishing.

## Current status

- Production build passed before the footer-only follow-up change.
- Local schema and social-tag validation passed for the rendered home page.
- `public/og/home.png` was normalized to 1200×630.
- The footer now shows `© {year}` without a name, with the social links on a separate line.
