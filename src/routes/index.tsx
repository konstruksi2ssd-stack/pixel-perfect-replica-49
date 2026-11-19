import { useCallback, useState } from "react";
import { createFileRoute } from "@tanstack/react-router";
import { AnimatePresence } from "framer-motion";
import { Cover } from "@/components/invite/Cover";
import { Journey } from "@/components/invite/Journey";
import { Main } from "@/components/invite/Main";

type Search = { to?: string | undefined };

export const Route = createFileRoute("/")({
  validateSearch: (s: Record<string, unknown>): Search => ({
    to: typeof s["to"] === "string" ? s["to"] : undefined,
  }),
  head: () => ({
    meta: [
      { title: "Undangan Pernikahan Salsabila & Lukman — Secret Garden" },
      { name: "description", content: "Dengan penuh cinta, kami mengundang Anda ke pernikahan Salsabila & Lukman, 18 & 20 Desember 2026." },
      { property: "og:title", content: "Undangan Pernikahan Salsabila & Lukman" },
      { property: "og:description", content: "Masuki Secret Garden kami — 18 & 20 Desember 2026." },
      { property: "og:type", content: "website" },
      { name: "twitter:card", content: "summary_large_image" },
    ],
  }),
  component: Invitation,
});

function Invitation() {
  const { to } = Route.useSearch();
  const guest = to?.trim().slice(0, 50) || "Tamu Undangan";
  const [cover, setCover] = useState(true);
  const [journey, setJourney] = useState(false);
  const [main, setMain] = useState(false);
  const startJourney = useCallback(() => setJourney(true), []);
  const hideCover = useCallback(() => setCover(false), []);
  const showMain = useCallback(() => setMain(true), []);
  const endJourney = useCallback(() => setJourney(false), []);
  return (
    <div className="min-h-screen bg-background">
      {main && <Main guest={guest} />}
      {journey && <Journey onCovered={showMain} onDone={endJourney} />}
      <AnimatePresence>
        {cover && <Cover key="cover" guest={guest} onOpenStart={startJourney} onOpened={hideCover} />}
      </AnimatePresence>
    </div>
  );
}
