import { useId, type CSSProperties, type ReactNode } from "react";

/**
 * Halaman inti ornaments — hand-drawn vector filigree (carved double-line corners,
 * fine botanical vines, blossoms and a lozenge divider). Vector so they stay sharp
 * at every size; each one is a drop-in for the old raster ornament it replaces,
 * keeping the same box, position and orientation.
 */

type P = { className?: string | undefined; style?: CSSProperties | undefined };
type Pt = readonly [number, number];
type Curve = readonly [Pt, Pt, Pt, Pt];

const useGid = () => "orn" + useId().replace(/[^a-zA-Z0-9_-]/g, "");

/* ------------------------------ geometry helpers ------------------------------ */

function at([a, b, c, d]: Curve, t: number) {
  const u = 1 - t;
  const x = u * u * u * a[0] + 3 * u * u * t * b[0] + 3 * u * t * t * c[0] + t * t * t * d[0];
  const y = u * u * u * a[1] + 3 * u * u * t * b[1] + 3 * u * t * t * c[1] + t * t * t * d[1];
  const dx = 3 * u * u * (b[0] - a[0]) + 6 * u * t * (c[0] - b[0]) + 3 * t * t * (d[0] - c[0]);
  const dy = 3 * u * u * (b[1] - a[1]) + 6 * u * t * (c[1] - b[1]) + 3 * t * t * (d[1] - c[1]);
  return { x, y, a: (Math.atan2(dy, dx) * 180) / Math.PI };
}
const pathOf = ([a, b, c, d]: Curve) => `M${a[0]} ${a[1]}C${b[0]} ${b[1]} ${c[0]} ${c[1]} ${d[0]} ${d[1]}`;
const r2 = (n: number) => Math.round(n * 100) / 100;

/* -------------------------------- primitives -------------------------------- */

function Defs({ id, w, h }: { id: string; w: number; h: number }) {
  return (
    <defs>
      {/* per-shape sheen for fills */}
      <linearGradient id={`${id}f`} x1="0" y1="0" x2="1" y2="1">
        <stop offset="0" style={{ stopColor: "var(--royal-gold-light)" }} />
        <stop offset="0.5" style={{ stopColor: "var(--royal-gold)" }} />
        <stop offset="1" style={{ stopColor: "var(--royal-gold-deep)" }} />
      </linearGradient>
      {/* whole-ornament sheen for strokes (straight lines have no bounding-box height) */}
      <linearGradient id={`${id}s`} gradientUnits="userSpaceOnUse" x1="0" y1="0" x2={w} y2={h}>
        <stop offset="0" style={{ stopColor: "var(--royal-gold-light)" }} />
        <stop offset="0.55" style={{ stopColor: "var(--royal-gold)" }} />
        <stop offset="1" style={{ stopColor: "var(--royal-gold-deep)" }} />
      </linearGradient>
    </defs>
  );
}

const leafPath = (len: number, w: number) =>
  `M0 0C${r2(len * 0.25)} ${r2(-w * 1.1)} ${r2(len * 0.7)} ${r2(-w)} ${len} ${r2(-w * 0.15)}C${r2(len * 0.7)} ${r2(w * 0.6)} ${r2(len * 0.3)} ${r2(w * 0.9)} 0 0Z`;

function Leaf({ id, x, y, rot, len, w = len * 0.32 }: { id: string; x: number; y: number; rot: number; len: number; w?: number }) {
  return (
    <g transform={`translate(${r2(x)} ${r2(y)}) rotate(${r2(rot)})`}>
      <path d={leafPath(len, w)} fill={`url(#${id}f)`} />
      <path d={`M${r2(len * 0.08)} 0Q${r2(len * 0.5)} ${r2(-w * 0.2)} ${r2(len * 0.9)} ${r2(-w * 0.14)}`} stroke="var(--royal-navy)" strokeOpacity="0.45" strokeWidth={r2(Math.max(0.25, len * 0.035))} fill="none" strokeLinecap="round" />
    </g>
  );
}

function Curl({ id, x, y, rot, s = 1, flip = false }: { id: string; x: number; y: number; rot: number; s?: number; flip?: boolean }) {
  return (
    <path
      transform={`translate(${r2(x)} ${r2(y)}) rotate(${r2(rot)}) scale(${s} ${flip ? -s : s})`}
      d="M0 0C4 -0.6 7.4 -3.4 6.6 -6.6C5.9 -9.2 2.4 -9.3 1.6 -7.1C1 -5.5 2.4 -4.2 3.7 -5.2"
      stroke={`url(#${id}s)`} strokeWidth={r2(0.9 / s)} fill="none" strokeLinecap="round"
    />
  );
}

function Blossom({ id, x, y, r, rot = 0, petals = 6 }: { id: string; x: number; y: number; r: number; rot?: number; petals?: number }) {
  const step = 360 / petals;
  const petal = (len: number) => `M0 0C${r2(len * 0.3)} ${r2(-len * 0.44)} ${r2(len * 0.86)} ${r2(-len * 0.42)} ${len} 0C${r2(len * 0.86)} ${r2(len * 0.42)} ${r2(len * 0.3)} ${r2(len * 0.44)} 0 0Z`;
  return (
    <g transform={`translate(${r2(x)} ${r2(y)}) rotate(${rot})`}>
      {Array.from({ length: petals }, (_, i) => (
        <g key={`o${i}`} transform={`rotate(${i * step})`}>
          <path d={petal(r)} fill={`url(#${id}f)`} stroke="var(--royal-gold-deep)" strokeWidth={r2(r * 0.045)} />
          <path d={`M${r2(r * 0.22)} 0L${r2(r * 0.8)} 0M${r2(r * 0.4)} ${r2(-r * 0.12)}L${r2(r * 0.7)} ${r2(-r * 0.2)}M${r2(r * 0.4)} ${r2(r * 0.12)}L${r2(r * 0.7)} ${r2(r * 0.2)}`} stroke="var(--royal-gold-deep)" strokeOpacity="0.8" strokeWidth={r2(r * 0.03)} strokeLinecap="round" />
        </g>
      ))}
      {Array.from({ length: petals }, (_, i) => (
        <path key={`i${i}`} d={petal(r * 0.56)} transform={`rotate(${i * step + step / 2})`} fill="var(--royal-gold-light)" fillOpacity="0.75" stroke="var(--royal-gold-deep)" strokeWidth={r2(r * 0.035)} />
      ))}
      <circle r={r2(r * 0.2)} fill="var(--royal-gold-deep)" />
      {Array.from({ length: petals }, (_, i) => {
        const a = ((i * step + step / 2) * Math.PI) / 180;
        return <circle key={`s${i}`} cx={r2(Math.cos(a) * r * 0.3)} cy={r2(Math.sin(a) * r * 0.3)} r={r2(r * 0.055)} fill="var(--royal-gold-light)" />;
      })}
    </g>
  );
}

function Bud({ id, x, y, rot, s = 1 }: { id: string; x: number; y: number; rot: number; s?: number }) {
  return (
    <g transform={`translate(${r2(x)} ${r2(y)}) rotate(${r2(rot)}) scale(${s})`}>
      <path d="M0 0C1.5 -2.6 4.6 -3 7 -1.6C8.2 -0.9 8.6 0 8 0.3C8.6 0.6 8.2 1.4 7 1.9C4.6 3.1 1.5 2.6 0 0Z" fill={`url(#${id}f)`} stroke="var(--royal-gold-deep)" strokeWidth="0.3" />
      <path d="M0 0C1 -1.6 2.6 -2.2 3.6 -2.4M0 0C1 1.6 2.6 2.2 3.6 2.4" stroke="var(--royal-gold-deep)" strokeWidth="0.45" fill="none" strokeLinecap="round" />
    </g>
  );
}

/** A stem with alternating leaves, ending in a curl, bud or nothing. */
function Vine({ id, c, leaves, size, width = 0.9, end = "curl", startT = 0.14 }: { id: string; c: Curve; leaves: number; size: number; width?: number; end?: "curl" | "bud" | "none"; startT?: number }) {
  const items: ReactNode[] = [];
  for (let i = 0; i < leaves; i++) {
    const t = startT + ((0.9 - startT) * i) / Math.max(1, leaves - 1);
    const p = at(c, t);
    const side = i % 2 === 0 ? -1 : 1;
    const len = size * 1.15 * (1 - t * 0.4);
    items.push(<Leaf key={i} id={id} x={p.x} y={p.y} rot={p.a + side * 42} len={len} w={len * (side < 0 ? 0.36 : -0.36)} />);
    if (i < leaves - 1) {
      const q = at(c, t + (0.9 - startT) / Math.max(1, leaves - 1) / 2);
      const o = ((q.a - side * 90) * Math.PI) / 180;
      items.push(<circle key={`b${i}`} cx={r2(q.x + Math.cos(o) * size * 0.28)} cy={r2(q.y + Math.sin(o) * size * 0.28)} r={r2(size * 0.07)} fill="var(--royal-gold-light)" />);
    }
  }
  const e = at(c, 1);
  return (
    <g>
      <path d={pathOf(c)} stroke={`url(#${id}s)`} strokeWidth={width} fill="none" strokeLinecap="round" />
      {items}
      {end === "curl" && <Curl id={id} x={e.x} y={e.y} rot={e.a} s={size / 9} />}
      {end === "bud" && <Bud id={id} x={e.x} y={e.y} rot={e.a} s={size / 8} />}
    </g>
  );
}

function Svg({ id, w, h, className = "", style, children }: P & { id: string; w: number; h: number; children: ReactNode }) {
  return (
    <svg viewBox={`0 0 ${w} ${h}`} className={`orn-gold ${className}`} style={style} fill="none" aria-hidden focusable="false">
      <Defs id={id} w={w} h={h} />
      {children}
    </svg>
  );
}

/* --------------------------------- ornaments --------------------------------- */

/** Carved double-line corner with acanthus scrolls (top-left orientation). */
export function CarvedCorner({ className, style }: P) {
  const id = useGid();
  const scroll: Curve = [[21, 15], [33, 11.5], [46.5, 12.5], [50.5, 21.5]];
  const half = (
    <g>
      <path d={`${pathOf(scroll)}C53.5 28.5 46.5 33 41.5 30C37.5 27.5 39 22 43.5 23`} stroke={`url(#${id}s)`} strokeWidth="1.5" strokeLinecap="round" />
      <path d="M50.5 20C56 14.5 65 13 73 15" stroke={`url(#${id}s)`} strokeWidth="1.1" strokeLinecap="round" />
      {/* acanthus fan hanging from the scroll */}
      {[0.3, 0.52, 0.74].map((t, i) => {
        const p = at(scroll, t);
        return <Leaf key={i} id={id} x={p.x} y={p.y} rot={p.a + 62 - i * 6} len={11 - i * 2} w={-3.4 + i * 0.5} />;
      })}
      <Leaf id={id} x={22} y={15.5} rot={-10} len={17} w={4.6} />
      <Leaf id={id} x={25} y={25} rot={22} len={24} w={5.6} />
      <Vine id={id} c={[[73, 15], [81, 17.5], [90, 16.5], [99, 13]]} leaves={3} size={7} width={1} />
      <path d="M82 9C82 14 86 17.5 89.5 15.5C92 14 90.5 10.8 88.3 12" stroke={`url(#${id}s)`} strokeWidth="0.8" strokeLinecap="round" />
      <circle cx="117" cy="3" r="2" fill={`url(#${id}f)`} />
      <circle cx="110" cy="3" r="0.9" fill="var(--royal-gold-light)" />
      <Leaf id={id} x={104} y={9} rot={0} len={6} w={1.8} />
    </g>
  );
  return (
    <Svg id={id} w={120} h={120} className={className} style={style}>
      <g stroke={`url(#${id}s)`} strokeLinecap="round">
        <path d="M3 117V14Q3 3 14 3H117" strokeWidth="2.2" />
        <path d="M9 104V20Q9 9 20 9H104" strokeWidth="0.9" />
      </g>
      {half}
      <g transform="matrix(0 1 1 0 0 0)">{half}</g>
      <path d="M27 27Q44 33 52 52Q33 44 27 27Z" fill={`url(#${id}f)`} />
      <path d="M28.5 28.5L49 49" stroke="var(--royal-navy)" strokeOpacity="0.45" strokeWidth="0.6" strokeLinecap="round" />
      <circle cx="55.5" cy="55.5" r="1.8" fill={`url(#${id}f)`} />
      <circle cx="60" cy="60" r="0.9" fill="var(--royal-gold-light)" />
      <Blossom id={id} x={17} y={17} r={7.5} petals={8} rot={22.5} />
    </Svg>
  );
}

/** Fine botanical corner: blossom at the corner, leafy vines along both edges (top-left orientation). */
export function VineCorner({ className, style }: P) {
  const id = useGid();
  return (
    <Svg id={id} w={100} h={118} className={className} style={style}>
      <path d="M2.5 115V13Q2.5 2.5 13 2.5H97" stroke={`url(#${id}s)`} strokeWidth="1.1" strokeLinecap="round" />
      <circle cx="97.5" cy="2.5" r="1.4" fill={`url(#${id}f)`} />
      <circle cx="2.5" cy="115.5" r="1.4" fill={`url(#${id}f)`} />
      <Vine id={id} c={[[28, 15], [46, 6], [66, 19], [95, 9]]} leaves={6} size={8} end="bud" />
      <Vine id={id} c={[[15, 28], [6, 48], [19, 70], [9, 112]]} leaves={7} size={8} end="bud" />
      <Vine id={id} c={[[27, 27], [36, 35], [40, 42], [50, 47]]} leaves={3} size={6} end="curl" width={0.8} />
      <Blossom id={id} x={57} y={14} r={4.6} rot={10} petals={5} />
      <Blossom id={id} x={13} y={66} r={4.6} rot={-20} petals={5} />
      <Blossom id={id} x={19} y={19} r={11} rot={15} />
    </Svg>
  );
}

/** Botanical spray rising from the bottom-left corner. */
export function BotanicalSpray({ className, style }: P) {
  const id = useGid();
  return (
    <Svg id={id} w={100} h={100} className={className} style={style}>
      <Vine id={id} c={[[7, 97], [2, 76], [13, 52], [9, 30]]} leaves={7} size={10} width={1.1} end="bud" startT={0.2} />
      <Vine id={id} c={[[7, 97], [28, 102], [50, 92], [72, 94]]} leaves={7} size={10} width={1.1} end="bud" startT={0.2} />
      <Vine id={id} c={[[9, 95], [20, 82], [30, 70], [44, 60]]} leaves={4} size={8} width={1} end="none" startT={0.3} />
      <Vine id={id} c={[[8, 70], [16, 64], [22, 58], [30, 56]]} leaves={3} size={5.5} width={0.7} end="curl" />
      <Vine id={id} c={[[36, 93], [42, 86], [48, 80], [52, 72]]} leaves={3} size={5.5} width={0.7} end="curl" />
      <Blossom id={id} x={8} y={58} r={6} rot={12} petals={5} />
      <Blossom id={id} x={44} y={92} r={6} rot={-8} petals={5} />
      <Blossom id={id} x={46} y={59} r={8.5} rot={20} />
      <Blossom id={id} x={19} y={81} r={14} rot={5} />
    </Svg>
  );
}

/** Symmetric filigree divider: tapered rules, scrolls and a lozenge medallion. */
export function FiligreeDivider({ className, style }: P) {
  const id = useGid();
  const half = (
    <g>
      <path d="M11 11Q45 10 81 10.2L81 11.8Q45 12 11 11Z" fill={`url(#${id}f)`} />
      <path d="M2.5 11L6.5 8.4L10.5 11L6.5 13.6Z" fill={`url(#${id}f)`} />
      <path d="M82 11C84 5.8 90.4 5 91.3 8.6C92 11.2 89 12.2 88.1 10.4M82 11C84 16.2 90.4 17 91.3 13.4C92 10.8 89 9.8 88.1 11.6" stroke={`url(#${id}s)`} strokeWidth="0.9" strokeLinecap="round" />
      <Leaf id={id} x={62} y={10.4} rot={-165} len={9} w={2.6} />
      <Leaf id={id} x={62} y={11.6} rot={165} len={9} w={-2.6} />
      <Leaf id={id} x={38} y={10.6} rot={-168} len={6} w={1.8} />
      <Leaf id={id} x={38} y={11.4} rot={168} len={6} w={-1.8} />
      <circle cx="73" cy="11" r="1" fill="var(--royal-gold-light)" />
    </g>
  );
  return (
    <Svg id={id} w={200} h={22} className={className} style={style}>
      {half}
      <g transform="matrix(-1 0 0 1 200 0)">{half}</g>
      <path d="M100 2.5L108.5 11L100 19.5L91.5 11Z" stroke={`url(#${id}s)`} strokeWidth="0.9" />
      <path d="M100 6L105 11L100 16L95 11Z" fill={`url(#${id}f)`} />
      <circle cx="100" cy="11" r="1.3" fill="var(--royal-navy)" fillOpacity="0.55" />
      <circle cx="100" cy="0.9" r="0.9" fill="var(--royal-gold-light)" />
      <circle cx="100" cy="21.1" r="0.9" fill="var(--royal-gold-light)" />
    </Svg>
  );
}

/** Small lotus finial that crowns the arch portraits. */
export function Finial({ className, style }: P) {
  const id = useGid();
  return (
    <Svg id={id} w={24} h={24} className={className} style={style}>
      <Leaf id={id} x={12} y={21} rot={-90} len={18} w={4.4} />
      <Leaf id={id} x={12} y={21} rot={-140} len={10} w={-3} />
      <Leaf id={id} x={12} y={21} rot={-40} len={10} w={3} />
      <circle cx="12" cy="21.6" r="1.6" fill={`url(#${id}f)`} />
    </Svg>
  );
}
