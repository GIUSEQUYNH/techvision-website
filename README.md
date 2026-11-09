# HUONGQUYNH Group website

Static website served by GitHub Pages at https://huongquynhgroupvn.com/.

## Structure

- `index.html`: existing homepage layout, colors, typography and content.
- `css/site.css`: original homepage stylesheet, extracted without changing cascade order.
- `css/site-utilities.css`: accessibility utilities and styles scoped to new AI pages.
- `js/site.js`: shared search controls, local readiness assessment and dialog behavior.
- `js/motion.js`: homepage reveal effects and a single carousel controller.
- `js/search-index.js`: public content index; update this when adding searchable pages.
- `ai-san-xuat.html`: industrial AI hub, application categories and readiness checklist.
- `kien-truc-ai-cong-nghiep.html`: OT/data/model/application reference architecture.
- `ai-nang-luong.html`: energy analytics, baseline and validation guidance.
- `bai-viet-ai-cong-nghiep.html`: staged implementation and operational evaluation.
- `bao-tri-du-doan.html`, `thi-giac-may.html`, `rag-cong-nghiep.html`: existing technical articles; their original designs are retained and section links now return to the AI hub.
- `tim-kiem.html`: accent-insensitive local search; excluded from indexing.

No build step or package installation is required. Serve this directory with a static HTTP server for local development. Pushing `main` triggers the existing Pages deployment workflow.

## Verification (2026-11-09)

- Checked the original CSS cascade against the published homepage.
- Compared homepage section dimensions, typography and backgrounds at desktop and mobile widths.
- Checked new AI links, existing article anchors, assets, canonical URLs, structured data and sitemap entries.
- Exercised carousel next/dot navigation, search without Vietnamese diacritics, and readiness results for zero/all checked conditions in the browser.
- Checked responsive AI hub, architecture page and an existing technical article.

## Existing content gaps

Some older product, industry, company and legal links already point to files absent from this repository. This update repairs primary navigation and AI routes; it does not invent company details, policies, case studies or unverified service content for those missing pages. Social profile URLs are also still placeholders.

The login dialog has no authentication backend; credential fields are disabled and the dialog explains its status. English translation is not implemented. The AI pages describe applications and architecture; they do not connect this public website to plant equipment or run AI inference. The readiness assessment runs only in the browser.
