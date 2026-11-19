import type { CSSProperties } from "react";
import butterfly from "@/assets/butterfly.webp.asset.json";

export const BUTTERFLY_SRC = butterfly.url;

export function Butterfly({
  size = 40,
  className = "",
  style,
  slow = false,
}: {
  size?: number | string;
  className?: string;
  style?: CSSProperties;
  slow?: boolean;
}) {
  return (
    <div className={className} style={{ width: size, aspectRatio: "4 / 3", ...style }} aria-hidden>
      <img
        src={butterfly.url}
        alt=""
        draggable={false}
        className={`${slow ? "flutter-slow" : "flutter"} h-full w-full object-contain drop-shadow-[0_0_10px_oklch(0.79_0.095_80/0.45)]`}
      />
    </div>
  );
}

const FLOCK = [
  { l: "8%", t: "70%", s: 34, d: "0s", dur: "13s" },
  { l: "80%", t: "60%", s: 26, d: "-3s", dur: "16s" },
  { l: "60%", t: "25%", s: 22, d: "-6s", dur: "11s" },
  { l: "20%", t: "30%", s: 28, d: "-8s", dur: "18s" },
  { l: "45%", t: "80%", s: 20, d: "-2s", dur: "15s" },
];

export function ButterflyFlock({ count = 5 }: { count?: number }) {
  return (
    <div className="pointer-events-none absolute inset-0 overflow-hidden">
      {FLOCK.slice(0, count).map((b, i) => (
        <div key={i} className="drift absolute" style={{ left: b.l, top: b.t, animationDelay: b.d, animationDuration: b.dur }}>
          <Butterfly size={b.s} style={{ transform: `rotate(${i * 25 - 30}deg)` }} />
        </div>
      ))}
    </div>
  );
}
