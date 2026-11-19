<!-- LOVABLE:BEGIN -->
> [!IMPORTANT]
> This project is connected to [Lovable](https://lovable.dev). Avoid rewriting
> published git history — force pushing, or rebasing/amending/squashing commits
> that are already pushed — as it rewrites history on Lovable's side and the
> user will likely lose their project history.
>
> Commits you push to the connected branch sync back to Lovable and show up in
> the editor, so keep the branch in a working state.

## What Lovable manages

Rules outside this block are the project's own. Change the pieces below in
Lovable, not by hand. With the [Lovable MCP](https://mcp.lovable.dev)
connected, `send_message` asks Lovable to do it; otherwise ask the user to
use the editor.

- **Database.** Do not add or edit `supabase/migrations/` or `drizzle/`.
  Ask Lovable to change the schema.
- **Generated files.** Do not edit a file whose header says it is automatically
  generated.
- **AI gateway.** Keep model calls on Lovable's gateway, and keep
  `LOVABLE_API_KEY` out of browser code.
- **Connectors.** Lovable provides native connectors. `list_connectors` shows
  which are enabled; `add_connector` only returns the dashboard link. When a
  connector is enabled, calls go through the connector gateway and need
  `LOVABLE_API_KEY`. When Lovable does not provide one, users can bring their
  own key and store it in Secrets.
- **Secrets.** Lovable manages them. Do not put secret values in the repo.
<!-- LOVABLE:END -->
## Project rules
- The invitation flow lives in `src/components/invite/` (Cover → Journey → Main), orchestrated by `src/routes/index.tsx`; Journey mounts under the Cover on tap so scenes hand off without blank frames.
- Opening-scene characters, garden animals (`GardenAnimals.tsx`) and butterflies are positioned in percentages of a fixed-aspect "stage" that matches the garden image, so they stay aligned with its perspective on every screen size.
- Binary images are served via Lovable Assets pointers (`*.asset.json`), optimized to WebP where possible, to keep phone loading light.
- Main-page ("halaman inti") ornaments are vector components in `src/components/invite/Ornaments.tsx`, colored by the royal-gold tokens; each one is a drop-in for a decorative image at the same box and orientation so layout never shifts when ornaments change.
