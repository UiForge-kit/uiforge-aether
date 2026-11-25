# Changelog

All notable changes to this project are documented here.
The format follows [Keep a Changelog](https://keepachangelog.com/en/1.1.0/).

## 1.0.0 (unreleased)

### Added

- Streaming chat on Next.js 16 and React 19: markdown with GFM, collapsible reasoning steps, link previews, attachments, stop button that keeps the partial message.
- Composer with model selector, attachments and toggleable tools; tools a model cannot run are disabled.
- Canvas for long documents, with tabs, copy and download.
- Syntax-highlighted code blocks shared by the markdown renderer and the canvas.
- Answer feedback (like and dislike) stored outside the thread.
- Conversation search modal.
- Three themes, `minimal`, `contrast` and `terminal`, each with a light and a dark mode.
- Settings for profile, appearance and font, conversation and keyboard shortcuts.
- Language selector with eight locales. The choice is stored, nothing is translated.
- Local persistence behind a `ChatStorage` interface, with `localStorage` as the default adapter.
- Provider layer with a mock provider and Anthropic and OpenAI adapters, selected with `AI_PROVIDER` or by the presence of an API key.
- SSE protocol for `POST /api/chat` with six events (`start`, `reasoning`, `delta`, `usage`, `done`, `error`) and cancellation through `request.signal`.
- API guard: `authorize()` hook, request body and payload limits, in-memory rate limit per instance, server-side check of models, tools, context size and attachments.
- Free and Pro module registry (`config/modules.ts`) with locked stubs for Projects, Integrations, Images, Voice, Usage, Share, Incognito conversation and the Notifications, Privacy, Billing and Storage settings.
- Free limits in `config/limits.ts`, and an optional purchase link through `NEXT_PUBLIC_UPGRADE_URL`.
- `robots.txt`, sitemap, canonical URL and Open Graph metadata. Indexing is off unless `NEXT_PUBLIC_ALLOW_INDEXING=true`.
- Scripts: `dev`, `build`, `start`, `lint`, `typecheck` and `test`.
- MIT license and third-party notices in `NOTICE`.
