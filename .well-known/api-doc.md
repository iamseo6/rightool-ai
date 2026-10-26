# RighTool.ai public data API

Read-only public data endpoints for the RighTool.ai AI tools directory. No authentication is required. All endpoints return HTTP 200.

## Endpoints

- `GET https://rightool.ai/llms.txt` — Full catalog of all 45 tools in Markdown (names, categories, pricing notes, homepage links). Content-Type: text/plain.
- `GET https://rightool.ai/sitemap.xml` — Sitemap of every page (directory, categories, tool pages, roundups, blog posts, site pages). Content-Type: application/xml.
- `GET https://rightool.ai/.well-known/ai-catalog.json` — Agentic Resource Discovery capability manifest (specVersion 1.0). Content-Type: application/json.
- `GET https://rightool.ai/.well-known/agent-skills/index.json` — Agent skills discovery index with sha256 digests. Content-Type: application/json.

## Discovery

- API catalog (RFC 9727 linkset): https://rightool.ai/.well-known/api-catalog
- OpenAPI spec: https://rightool.ai/.well-known/openapi.json
- Capability manifest: https://rightool.ai/.well-known/ai-catalog.json

## Notes

There are no write endpoints, no protected endpoints, and no health endpoint beyond the public pages themselves. For listing or sponsorship questions, use https://rightool.ai/submit or https://rightool.ai/contact.
