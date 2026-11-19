import { useEffect, useRef, useState, type CSSProperties, type ReactNode } from "react";
import { AnimatePresence, motion, useReducedMotion } from "framer-motion";
import dusk from "@/assets/scene-dusk.webp.asset.json";
import duskDoorL from "@/assets/dusk-door-left.webp.asset.json";
import duskDoorR from "@/assets/dusk-door-right.webp.asset.json";
import duskBeyond from "@/assets/dusk-beyond.webp.asset.json";
import night from "@/assets/scene-night.webp.asset.json";
import goldGateL from "@/assets/gold-gate-left.webp.asset.json";
import goldGateR from "@/assets/gold-gate-right.webp.asset.json";
import dawn from "@/assets/scene-dawn.webp.asset.json";
import couple from "@/assets/couple-walking.webp.asset.json";
import butterflyLg from "@/assets/butterfly-lg.webp.asset.json";
import { Butterfly, BUTTERFLY_SRC } from "./Butterfly";

/**
 * The journey between the cover door and the main page — three painted scenes in one style:
 *   1. Senja      — the couple walks the sunset path, the burgundy doors at its end swing open.
 *   2. Taman Malam — fireflies, lanterns and petals; a gold gate inside the rose arch opens.
 *   3. Fajar      — a still lake at dawn; a butterfly rises and flies to the viewer, its wings
 *                   cover the screen and then lift away to reveal the main page.
 * Every scene is a fixed 2:3 "stage" matching its painting, so doors, gates and the couple are
 * placed in stage percentages and stay aligned on every screen. Times are seconds from scene mount.
 */

const S1 = { appear: 0.9, walk: 1.6, arrive: 6.0, doors: 5.2, doorsDur: 1.6, passEnd: 7.0, end: 7.4 };
const S2 = { appear: 0.1, walk: 0.5, arrive: 4.2, gate: 3.5, gateDur: 1.4, passEnd: 5.2, end: 5.6 };
const S3 = { appear: 0.1, walk: 0.4, arrive: 2.6, bfIn: 1.5, bfDur: 4.6, coverIn: 5.6, covered: 6.1 };
const WINGS_OPEN = 1.6;
const XFADE = 1.1;
const REDUCED = { covered: 2.6, fade: 0.9 };

export const JOURNEY_IMAGES = [
  dusk.url, duskDoorL.url, duskDoorR.url, duskBeyond.url, night.url, goldGateL.url, goldGateR.url,
  dawn.url, couple.url, butterflyLg.url, BUTTERFLY_SRC,
];

/** Warm the browser cache while the guest is still on the cover. */
export function preloadJourney() {
  JOURNEY_IMAGES.forEach((src) => {
    const img = new Image();
    img.decoding = "async";
    img.src = src;
  });
}

type Scene = 1 | 2 | 3 | "wings";

export function Journey({ onCovered, onDone }: { onCovered: () => void; onDone: () => void }) {
  const reduce = useReducedMotion();
  const [scene, setScene] = useState<Scene>(1);
  const [fade, setFade] = useState(false);
  const cb = useRef({ onCovered, onDone });
  cb.current = { onCovered, onDone };
  const timers = useRef<number[]>([]);

  useEffect(() => {
    const at = (s: number, fn: () => void) => timers.current.push(window.setTimeout(fn, s * 1000));
    if (reduce) {
      at(REDUCED.covered, () => { cb.current.onCovered(); setFade(true); });
      at(REDUCED.covered + REDUCED.fade, () => cb.current.onDone());
    } else {
      const t2 = S1.end;
      const t3 = t2 + S2.end;
      const tc = t3 + S3.covered;
      at(t2, () => setScene(2));
      at(t3, () => setScene(3));
      at(tc, () => { cb.current.onCovered(); setScene("wings"); });
      at(tc + WINGS_OPEN + 0.3, () => cb.current.onDone());
    }
    const list = timers.current;
    return () => list.forEach(clearTimeout);
  }, [reduce]);

  const skip = () => {
    timers.current.forEach(clearTimeout);
    cb.current.onCovered();
    cb.current.onDone();
  };

  if (scene === "wings") return <WingCover />;

  return (
    <motion.div
      className="fixed inset-0 z-40 overflow-hidden bg-night"
      animate={{ opacity: fade ? 0 : 1 }}
      transition={{ duration: REDUCED.fade }}
    >
      <AnimatePresence initial={false}>
        {scene === 1 && <Dusk key="s1" still={!!reduce} />}
        {scene === 2 && <Night key="s2" />}
        {scene === 3 && <Dawn key="s3" />}
      </AnimatePresence>

      <button onClick={skip} className="btn-ghost-gold absolute bottom-6 right-6 z-30 px-4 py-1.5 text-[11px] uppercase tracking-widest backdrop-blur">
        Lewati
      </button>
    </motion.div>
  );
}

/* --------------------------------- shared --------------------------------- */

/** One scene: fades/zooms in over the previous one and dissolves out when replaced. */
function SceneShell({ children }: { children: ReactNode }) {
  return (
    <motion.div
      className="absolute inset-0"
      initial={{ opacity: 0, scale: 1.04 }}
      animate={{ opacity: 1, scale: 1 }}
      exit={{ opacity: 0, scale: 1.03 }}
      transition={{ duration: XFADE, ease: [0.45, 0, 0.25, 1] }}
    >
      {children}
    </motion.div>
  );
}

/**
 * The painting at its own 2:3 composition (cropped at the sides on phones, softly extended on wide
 * screens). `children` live inside the slowly dollying layer so they stay glued to the painting;
 * `front` sits above it and does not dolly (foreground parallax, vignette, light).
 */
function Stage({ bg, alt, zoom, dur, origin, children, front }: {
  bg: string; alt: string; zoom: number; dur: number; origin: string; children?: ReactNode; front?: ReactNode;
}) {
  return (
    <>
      <img src={bg} alt="" aria-hidden className="absolute inset-0 h-full w-full scale-110 object-cover opacity-50 blur-2xl" />
      <div className="absolute left-1/2 top-1/2 aspect-[2/3] h-full -translate-x-1/2 -translate-y-1/2 overflow-hidden">
        <motion.div className="absolute inset-0" style={{ transformOrigin: origin }}
          initial={{ scale: 1 }} animate={{ scale: zoom }} transition={{ duration: dur, ease: "linear" }}>
          <img src={bg} alt={alt} draggable={false} className="absolute inset-0 h-full w-full object-cover" />
          {children}
        </motion.div>
        {/* foreground parallax: the near roses & stones drift outward faster than the scene behind */}
        <motion.img src={bg} alt="" aria-hidden draggable={false} className="parallax-fore absolute inset-0 h-full w-full object-cover"
          style={{ transformOrigin: origin }} initial={{ scale: 1 }} animate={{ scale: zoom + (zoom - 1) * 2.2 }}
          transition={{ duration: dur, ease: "linear" }} />
        {front}
        <div className="bg-stage-vignette pointer-events-none absolute inset-0" />
      </div>
    </>
  );
}

type WalkProps = {
  appear: number; walk: number; arrive: number; passEnd?: number;
  from: number; to: number; pass?: number; // foot position (top %) of the couple
  s0: number; s1: number; s2?: number; // scale at start, arrival, after passing the gate
};

/** The couple seen from behind, walking up the path with a soft step bob, then into the light. */
function Walker({ appear, walk, arrive, passEnd, from, to, pass, s0, s1, s2 }: WalkProps) {
  const end = passEnd ?? arrive;
  const D = end - appear;
  const tw = (walk - appear) / D;
  const ta = (arrive - appear) / D;
  const passing = passEnd !== undefined && pass !== undefined && s2 !== undefined;
  const steps = Math.max(1, Math.round((end - walk) / 0.55));
  return (
    <motion.div
      className="absolute left-1/2 h-[44%] aspect-[440/647]"
      style={{ x: "-50%", y: "-100%", transformOrigin: "50% 100%" }}
      initial={{ top: `${from}%`, scale: s0, opacity: 0 }}
      animate={{
        top: passing ? [`${from}%`, `${from}%`, `${to}%`, `${pass}%`] : [`${from}%`, `${from}%`, `${to}%`],
        scale: passing ? [s0, s0, s1, s2] : [s0, s0, s1],
        opacity: passing ? [0, 1, 1, 0] : [0, 1, 1],
      }}
      transition={{
        duration: D,
        delay: appear,
        times: passing ? [0, tw, ta, 1] : [0, tw, 1],
        ease: passing ? ["easeOut", "easeInOut", "easeIn"] : ["easeOut", "easeOut"],
      }}
    >
      <div className="absolute -bottom-[2%] left-1/2 h-[7%] w-[90%] -translate-x-1/2 rounded-[50%] bg-night/60 blur-md" />
      <motion.img
        src={couple.url}
        alt="Kedua mempelai berjalan bergandengan tangan"
        draggable={false}
        className="relative h-full w-full object-contain"
        style={{ filter: "brightness(0.85) saturate(0.9) sepia(0.12)", transformOrigin: "50% 100%" }}
        animate={{ y: ["0%", "-1.4%", "0%"], rotate: [-1.1, 1.1, -1.1] }}
        transition={{
          y: { duration: 0.55, repeat: steps, ease: "easeInOut", delay: walk },
          rotate: { duration: 1.1, repeat: Math.ceil(steps / 2), ease: "easeInOut", delay: walk },
        }}
      />
    </motion.div>
  );
}

/** A two-leaf door/gate that swings inward (away from the viewer). */
function SwingLeaves({ left, right, delay, dur, className, style }: {
  left: string; right: string; delay: number; dur: number; className: string; style?: CSSProperties;
}) {
  const t = { duration: dur, delay, ease: [0.55, 0, 0.3, 1] as const };
  const fade = { duration: dur, delay, times: [0, 0.7, 1] };
  return (
    <div className={`absolute flex ${className}`} style={{ perspective: 700, ...style }}>
      <motion.img src={left} alt="" draggable={false} className="h-full w-1/2 object-fill"
        style={{ transformOrigin: "0% 50%", backfaceVisibility: "hidden" }}
        animate={{ rotateY: 100, opacity: [1, 1, 0] }} transition={{ ...t, opacity: fade }} />
      <motion.img src={right} alt="" draggable={false} className="h-full w-1/2 object-fill"
        style={{ transformOrigin: "100% 50%", backfaceVisibility: "hidden" }}
        animate={{ rotateY: -100, opacity: [1, 1, 0] }} transition={{ ...t, opacity: fade }} />
    </div>
  );
}

/** Golden light that blooms out of a gate and swallows the frame before the next scene. */
function LightBloom({ x, y, delay, dur }: { x: string; y: string; delay: number; dur: number }) {
  return (
    <motion.div className="bg-light-bloom pointer-events-none absolute aspect-square w-[60%] rounded-full"
      style={{ left: x, top: y, x: "-50%", y: "-50%" }}
      initial={{ scale: 0.2, opacity: 0 }} animate={{ scale: 5, opacity: [0, 0.6, 1] }}
      transition={{ duration: dur, delay, ease: "easeIn", opacity: { duration: dur, delay, times: [0, 0.4, 1] } }} />
  );
}

/** Burgundy (or cream) petals drifting down through the stage. */
function Petals({ count, tone = "wine" }: { count: number; tone?: "wine" | "cream" }) {
  return (
    <>
      {Array.from({ length: count }, (_, i) => (
        <span key={i}
          className={`petal-fall absolute -top-[4%] rounded-[60%_40%] ${tone === "wine" ? "bg-burgundy/85" : "bg-cream/70"}`}
          style={{
            left: `${(i * 37 + 9) % 96}%`, width: 7 + (i % 3) * 3, height: (7 + (i % 3) * 3) * 0.7,
            ["--dur" as string]: `${7 + (i % 4) * 1.6}s`, ["--delay" as string]: `${-(i * 1.3)}s`, ["--dx" as string]: `${i % 2 ? 34 : -28}px`,
          }} />
      ))}
    </>
  );
}

function GoldMotes({ count, top = 30, span = 60 }: { count: number; top?: number; span?: number }) {
  return (
    <>
      {Array.from({ length: count }, (_, i) => (
        <span key={i} className="firefly absolute h-1 w-1 rounded-full bg-gold shadow-glow-dot"
          style={{ left: `${((i * 41 + 13) % 90) + 5}%`, top: `${top + ((i * 29) % span)}%`, animationDelay: `${-(i * 0.7)}s`, ["--dur" as string]: `${4 + (i % 4)}s` }} />
      ))}
    </>
  );
}

/* --------------------------------- scenes --------------------------------- */

/** Door opening in the dusk painting (px of 1024×1536): x 391–634, y 407–895. */
const DUSK_DOOR = { left: "38.18%", top: "26.5%", width: "23.73%", height: "31.77%" };

function Dusk({ still }: { still: boolean }) {
  const passStart = S1.arrive;
  return (
    <SceneShell>
      <Stage bg={dusk.url} alt="Jalan setapak taman saat senja menuju gerbang" zoom={1.1} dur={S1.end} origin="50% 42%"
        front={<>
          <Petals count={8} />
          {!still && <LightBloom x="50%" y="44%" delay={passStart + 0.1} dur={S1.end - passStart} />}
        </>}>
        {/* the sunset seen through the doorway once it opens */}
        <div className="absolute overflow-hidden" style={{ ...DUSK_DOOR, borderRadius: "50% 50% 0 0 / 24.9% 24.9% 0 0" }}>
          <img src={duskBeyond.url} alt="" className="h-full w-full object-cover" />
          <motion.div className="bg-gate-glow absolute inset-0" initial={{ opacity: 0.2 }} animate={{ opacity: 1 }}
            transition={{ duration: S1.doorsDur, delay: S1.doors }} />
        </div>
        {!still && <SwingLeaves left={duskDoorL.url} right={duskDoorR.url} delay={S1.doors} dur={S1.doorsDur} className="" style={DUSK_DOOR} />}
        {still && <img src={duskDoorL.url} alt="" className="hidden" />}
        <div className="glow-pulse bg-sun-glow pointer-events-none absolute inset-0" />
        <GoldMotes count={7} top={38} span={40} />
        {!still && (
          <Walker appear={S1.appear} walk={S1.walk} arrive={S1.arrive} passEnd={S1.passEnd}
            from={97} to={59.2} pass={57.8} s0={1} s1={0.39} s2={0.3} />
        )}
      </Stage>
    </SceneShell>
  );
}

/** Gold gate inside the rose arch of the night painting (opening x 430–602, base y 835). */
const NIGHT_GATE = { left: "41.6%", top: "42.75%", width: "17.6%", height: "11.6%" };
const LANTERNS = [[11.5, 8], [28, 14], [19, 20.5], [77, 13], [94, 9], [17, 54.5], [83, 54.5], [37.5, 50.5], [62.5, 50.5]];

function Night() {
  return (
    <SceneShell>
      <Stage bg={night.url} alt="Taman malam berlentera dengan gerbang lengkung bunga" zoom={1.08} dur={S2.end + XFADE} origin="50% 46%"
        front={<>
          <Petals count={10} />
          <LightBloom x="50%" y="46%" delay={S2.arrive + 0.1} dur={S2.end - S2.arrive} />
        </>}>
        {/* glow inside the arch, brightening as the gate opens */}
        <motion.div className="bg-gate-glow absolute left-[42%] top-[31.5%] h-[23%] w-[16.8%] rounded-t-full"
          initial={{ opacity: 0.35 }} animate={{ opacity: [0.35, 0.55, 1] }}
          transition={{ duration: S2.gate + S2.gateDur, times: [0, 0.75, 1] }} />
        <SwingLeaves left={goldGateL.url} right={goldGateR.url} delay={S2.gate} dur={S2.gateDur} className="drop-shadow-gold" style={NIGHT_GATE} />
        {/* hanging lanterns breathing */}
        {LANTERNS.map(([x, y], i) => (
          <span key={i} className="glow-pulse bg-lantern-glow pointer-events-none absolute aspect-square w-[11%] rounded-full"
            style={{ left: `${x}%`, top: `${y}%`, transform: "translate(-50%,-50%)", animationDelay: `${-i * 0.6}s` }} />
        ))}
        <GoldMotes count={16} top={18} span={70} />
        <Walker appear={S2.appear} walk={S2.walk} arrive={S2.arrive} passEnd={S2.passEnd}
          from={100} to={55.6} pass={54.4} s0={1} s1={0.36} s2={0.28} />
      </Stage>
    </SceneShell>
  );
}

const STARS = Array.from({ length: 18 }, (_, i) => ({ x: ((i * 53 + 11) % 86) + 7, y: ((i * 31) % 26) + 2, s: 1 + (i % 3) }));
const STAR_REFLECTIONS = STARS.slice(0, 9).map((s) => ({ ...s, y: 48 + ((s.y * 0.45) % 12) }));

function Dawn() {
  return (
    <SceneShell>
      <Stage bg={dawn.url} alt="Danau tenang saat fajar dengan pantulan cahaya keemasan" zoom={1.06} dur={S3.covered + 1} origin="50% 40%"
        front={<>
          {/* camera-cover: the butterfly's wings fill the lens before the main page */}
          <motion.div className="pointer-events-none absolute inset-0 z-20" initial={{ opacity: 0 }} animate={{ opacity: 1 }}
            transition={{ duration: S3.covered - S3.coverIn, delay: S3.coverIn, ease: "easeIn" }}>
            <WingHalves />
          </motion.div>
        </>}>
        {/* the last stars, and their reflections, fading into the dawn */}
        {[...STARS, ...STAR_REFLECTIONS].map((s, i) => (
          <motion.span key={i} className="absolute rounded-full bg-ivory shadow-glow-dot"
            style={{ left: `${s.x}%`, top: `${s.y}%`, width: s.s, height: s.s }}
            initial={{ opacity: i >= STARS.length ? 0.5 : 0.95 }} animate={{ opacity: 0 }}
            transition={{ duration: 2.6 + (i % 4) * 0.5, delay: 0.4 + (i % 5) * 0.25, ease: "easeIn" }} />
        ))}
        {/* golden dawn light swelling over the horizon and its path on the water */}
        <motion.div className="bg-dawn-glow pointer-events-none absolute inset-0" initial={{ opacity: 0.25 }} animate={{ opacity: 1 }}
          transition={{ duration: 4, ease: "easeOut" }} />
        <div className="mist-drift bg-lake-mist pointer-events-none absolute inset-x-[-20%] top-[41%] h-[12%]" />
        <Walker appear={S3.appear} walk={S3.walk} arrive={S3.arrive} from={100} to={74} s0={1} s1={0.58} />
        {/* THE BUTTERFLY — rises beside the couple, circles, then flies toward the viewer */}
        <motion.div className="absolute z-10 w-[11%]" style={{ x: "-50%", y: "-50%" }}
          initial={{ left: "54%", top: "58%", scale: 0.2, rotate: -10, opacity: 0 }}
          animate={{
            left: ["54%", "62%", "44%", "56%", "50%", "50%", "50%"],
            top: ["58%", "46%", "38%", "42%", "46%", "48%", "50%"],
            rotate: [-10, 14, -12, 8, -4, 0, 0],
            scale: [0.2, 0.7, 0.85, 0.95, 1.1, 4.5, 42],
            opacity: [0, 1, 1, 1, 1, 1, 1],
          }}
          transition={{ duration: S3.bfDur, delay: S3.bfIn, times: [0, 0.16, 0.36, 0.52, 0.68, 0.85, 1], ease: "easeInOut" }}>
          <Butterfly size="100%" slow />
        </motion.div>
      </Stage>
    </SceneShell>
  );
}

/* ------------------------------ wing transition ---------------------------- */

/** Two halves of the butterfly at full-screen size. Static (cover) state. */
function WingHalves({ open = false }: { open?: boolean }) {
  const t = { duration: WINGS_OPEN, ease: [0.6, 0, 0.3, 1] as const };
  return (
    <div className="absolute inset-0 flex" style={{ perspective: 1400 }}>
      <motion.div className="relative h-full w-1/2 overflow-hidden bg-wine-grad"
        style={{ transformOrigin: "100% 50%" }}
        animate={open ? { rotateY: 92, x: "-8%", opacity: [1, 1, 0] } : {}}
        transition={{ ...t, opacity: { duration: WINGS_OPEN, times: [0, 0.7, 1] } }}>
        <img src={butterflyLg.url} alt="" className="absolute right-0 top-[38%] w-[210vmax] max-w-none -translate-y-1/2 translate-x-[57%]" />
      </motion.div>
      <motion.div className="relative h-full w-1/2 overflow-hidden bg-wine-grad"
        style={{ transformOrigin: "0% 50%" }}
        animate={open ? { rotateY: -92, x: "8%", opacity: [1, 1, 0] } : {}}
        transition={{ ...t, opacity: { duration: WINGS_OPEN, times: [0, 0.7, 1] } }}>
        <img src={butterflyLg.url} alt="" className="absolute left-0 top-[38%] w-[210vmax] max-w-none -translate-x-[57%] -translate-y-1/2" />
      </motion.div>
      <motion.div className="absolute inset-y-0 left-1/2 w-[3px] -translate-x-1/2 bg-gold-grad shadow-glow"
        animate={open ? { opacity: 0 } : { opacity: 1 }} transition={{ duration: 0.5 }} />
    </div>
  );
}

/** The wings lift away to reveal the invitation underneath. */
function WingCover() {
  return (
    <div className="pointer-events-none fixed inset-0 z-40 overflow-hidden">
      <WingHalves open />
    </div>
  );
}
