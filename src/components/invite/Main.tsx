import { useEffect, useState, type ReactNode } from "react";
import { motion, useScroll, useTransform, type Variants } from "framer-motion";
import { toast } from "sonner";
import { ChevronDown, Copy, Gift, Landmark, MapPin, UserRound, X } from "lucide-react";
import monogram from "@/assets/monogram.png.asset.json";
import calendar from "@/assets/calendar.png.asset.json";
import mosque from "@/assets/mosque.png.asset.json";
import building from "@/assets/building.png.asset.json";
import pin from "@/assets/pin.png.asset.json";
import emblem from "@/assets/emblem.png.asset.json";
import pathImg from "@/assets/garden-path.webp.asset.json";
import leavesImg from "@/assets/garden-leaves.webp.asset.json";
import g1 from "@/assets/gallery-couple.webp.asset.json";
import g2 from "@/assets/gallery-rings.webp.asset.json";
import g3 from "@/assets/gallery-table.webp.asset.json";
import { ButterflyFlock } from "./Butterfly";
import { BotanicalSpray, CarvedCorner, FiligreeDivider, Finial, VineCorner } from "./Ornaments";
import { WEDDING } from "@/lib/wedding";
import { AR_RUM_21 } from "@/lib/verse";
import { addEntry, loadEntries, type Entry } from "@/lib/rsvp";

/**
 * Halaman inti — styled after the reference board: burgundy & navy panels,
 * gold hairline frames, arch portraits, serif headings, script names and gold pill buttons.
 */

const EASE = [0.22, 1, 0.36, 1] as const;
const reveal = {
  initial: { opacity: 0, y: 36 },
  whileInView: { opacity: 1, y: 0 },
  viewport: { once: true, margin: "-80px" },
  transition: { duration: 1, ease: EASE },
} as const;
const stagger: Variants = { hidden: {}, show: { transition: { staggerChildren: 0.18 } } };
const rise: Variants = { hidden: { opacity: 0, y: 26 }, show: { opacity: 1, y: 0, transition: { duration: 1, ease: EASE } } };

/* ------------------------------ shared pieces ------------------------------ */

function Band({ children, tone = "navy", className = "", corners = true }: { children: ReactNode; tone?: "navy" | "wine"; className?: string; corners?: boolean }) {
  return (
    <section className={`relative overflow-hidden ${tone === "wine" ? "bg-royal-wine" : "bg-royal-navy"}`}>
      <div className="absolute inset-x-0 top-0 h-px bg-royal-gold/40" />
      {corners && (
        <>
          <CarvedCorner className="pointer-events-none absolute left-1 top-1 w-14 opacity-60 sm:w-20" />
          <CarvedCorner className="pointer-events-none absolute bottom-1 right-1 w-14 rotate-180 opacity-60 sm:w-20" />
        </>
      )}
      <div className={`relative mx-auto max-w-md px-5 py-16 text-center sm:max-w-2xl sm:py-24 ${className}`}>
        <motion.div {...reveal}>{children}</motion.div>
      </div>
    </section>
  );
}

function Heading({ kicker, children }: { kicker?: string; children: ReactNode }) {
  return (
    <div className="mb-9">
      {kicker && <p className="font-caps text-[10px] uppercase tracking-[0.38em] text-royal-gold-light/75 sm:text-xs">{kicker}</p>}
      <h2 className="mt-2 font-display text-[2.1rem] font-bold leading-tight text-royal-gold sm:text-5xl">{children}</h2>
      <FiligreeDivider className="mx-auto mt-2 opacity-90" style={{ height: 22, width: 190 }} />
    </div>
  );
}

const Hairline = ({ className = "" }: { className?: string }) => (
  <div className={`relative mx-auto h-px w-16 bg-royal-gold/50 ${className}`}>
    <span className="absolute left-1/2 top-1/2 h-[5px] w-[5px] -translate-x-1/2 -translate-y-1/2 rotate-45 bg-royal-gold" aria-hidden />
  </div>
);

/* ---------------------------------- hero ---------------------------------- */

function Hero({ guest }: { guest: string }) {
  return (
    <section className="relative flex min-h-[100svh] flex-col items-center justify-center overflow-hidden bg-royal-wine px-6 py-20 text-center">
      {/* damask-like texture from the garden photo, kept very faint */}
      <motion.img src={pathImg.url} alt="" className="absolute inset-0 h-full w-full object-cover mix-blend-soft-light"
        initial={{ opacity: 0 }} animate={{ opacity: 0.35 }} transition={{ duration: 2, ease: "easeOut" }} />
      <div className="absolute inset-0 bg-[radial-gradient(ellipse_at_center,transparent_35%,oklch(0.269_0.096_13.5/0.85))]" />

      {/* double gold frame */}
      <div className="pointer-events-none absolute inset-3 rounded-[1.75rem] border border-royal-gold/55 sm:inset-6" />
      <div className="pointer-events-none absolute inset-[20px] rounded-[1.4rem] border border-royal-gold/20 sm:inset-[34px]" />
      <VineCorner className="pointer-events-none absolute left-2 top-2 w-24 opacity-90 sm:left-4 sm:top-4 sm:w-36" />
      <VineCorner className="pointer-events-none absolute right-2 top-2 w-24 -scale-x-100 opacity-90 sm:right-4 sm:top-4 sm:w-36" />
      <BotanicalSpray className="sway pointer-events-none absolute -bottom-2 -left-4 w-40 opacity-90 sm:w-64" />
      <BotanicalSpray className="sway pointer-events-none absolute -bottom-2 -right-4 w-40 opacity-90 sm:w-64" style={{ ["--orn-flip" as string]: "scaleX(-1)" }} />

      <ButterflyFlock />

      <motion.div className="relative" initial={{ opacity: 0, y: 30 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 1.6, delay: 0.5 }}>
        <img src={monogram.url} alt="Monogram S&L" className="floaty mx-auto h-28 drop-shadow-[0_6px_18px_oklch(0.2_0.08_14/0.7)] sm:h-40" />
        <p className="mt-6 font-caps text-sm uppercase tracking-[0.3em] text-royal-gold-light sm:text-base">The Wedding of</p>
        <h1 className="mt-2 font-script text-[3.6rem] leading-[1.05] text-royal-gold sm:text-8xl">
          {WEDDING.bride} <span className="text-[2.6rem] sm:text-6xl">&</span> {WEDDING.groom}
        </h1>
        <FiligreeDivider className="mx-auto mt-3 opacity-90" style={{ height: 22, width: 200 }} />
        <p className="mt-3 font-caps text-sm tracking-[0.25em] text-ivory sm:text-base">18 & 20 DESEMBER 2026</p>
        <div className="mx-auto mt-7 max-w-[17rem] rounded-xl border border-royal-gold/50 bg-royal-wine-deep/55 px-6 py-3 backdrop-blur-sm">
          <p className="font-caps text-[10px] uppercase tracking-[0.3em] text-cream/75">Kepada Yth.</p>
          <p className="mt-1 truncate font-display text-xl font-semibold text-ivory">{guest}</p>
        </div>
      </motion.div>

      <ChevronDown className="floaty absolute bottom-7 left-1/2 h-6 w-6 -translate-x-1/2 text-royal-gold/80" aria-hidden />
    </section>
  );
}

/* --------------------------------- verse ---------------------------------- */

function Verse() {
  return (
    <Band tone="wine">
      <p className="font-caps text-[10px] uppercase tracking-[0.38em] text-royal-gold-light/75 sm:text-xs">Firman Allah SWT</p>
      <h2 className="mt-1 font-script text-[2.6rem] leading-tight text-royal-gold sm:text-6xl">{AR_RUM_21.reference.replace("QS. ", "Q.S. ")}</h2>
      <div className="relative mx-auto mt-6 rounded-2xl border border-royal-gold/40 px-5 py-8 sm:px-10">
        <VineCorner className="pointer-events-none absolute -left-2 -top-2 w-14 opacity-80" />
        <VineCorner className="pointer-events-none absolute -bottom-2 -right-2 w-14 rotate-180 opacity-80" />
        <blockquote dir="rtl" lang="ar" className="font-arabic text-[1.45rem] leading-[2.25] text-ivory sm:text-[1.9rem] sm:leading-[2.2]" style={{ wordSpacing: "0.08em" }}>
          {AR_RUM_21.arabic}
        </blockquote>
        <Hairline className="my-6" />
        <p className="font-display text-lg italic leading-relaxed text-cream/90 sm:text-xl">"{AR_RUM_21.translation}"</p>
        <p className="mt-5 font-caps text-xs tracking-[0.25em] text-royal-gold">{AR_RUM_21.reference}</p>
      </div>
    </Band>
  );
}

/* -------------------------------- mempelai -------------------------------- */

function ArchPhoto({ src, alt, label }: { src: string; alt: string; label: string }) {
  return (
    <div className="relative mx-auto w-full max-w-[13.5rem]">
      <Finial className="absolute -top-3 left-1/2 z-10 h-[18px] w-[18px] -translate-x-1/2" />
      <div className="rounded-t-full bg-[image:var(--gradient-royal-gold)] p-[2px] shadow-[0_20px_40px_-18px_oklch(0.1_0.03_260/0.9)]">
        <div className="rounded-t-full bg-royal-navy p-1.5">
          <div className="relative aspect-[4/5] overflow-hidden rounded-t-full border border-royal-gold/40 bg-royal-navy-soft">
            {src ? (
              <img src={src} alt={alt} loading="lazy" className="h-full w-full object-cover" />
            ) : (
              <div className="flex h-full w-full flex-col items-center justify-center gap-2 text-royal-gold/70" role="img" aria-label={`Tempat foto ${label}`}>
                <UserRound className="h-1/3 w-1/3" strokeWidth={1.2} />
                <span className="font-caps text-[9px] tracking-[0.2em]">FOTO {label.toUpperCase()}</span>
              </div>
            )}
          </div>
        </div>
      </div>
      <VineCorner className="pointer-events-none absolute -bottom-3 -left-3 w-[34%] -scale-y-100 opacity-95" />
      <VineCorner className="pointer-events-none absolute -bottom-3 -right-3 w-[34%] rotate-180 opacity-95" />
    </div>
  );
}

function Person({ who }: { who: "bride" | "groom" }) {
  const g = who === "groom";
  const label = g ? "Mempelai Pria" : "Mempelai Wanita";
  const nick = g ? WEDDING.groom : WEDDING.bride;
  return (
    <motion.div variants={rise} className="flex min-w-0 flex-col items-center">
      <p className="mb-5 font-caps text-[9px] uppercase tracking-[0.28em] text-royal-gold-light/80 sm:text-[11px]">{label}</p>
      <ArchPhoto src={g ? WEDDING.photos.groom : WEDDING.photos.bride} alt={`Foto ${label.toLowerCase()}, ${nick}`} label={label} />
      <h3 className="mt-6 font-script text-[2.3rem] leading-none text-royal-gold sm:text-5xl">{nick}</h3>
      <p className="mt-2 font-display text-[0.95rem] font-semibold leading-tight text-ivory sm:text-xl">{g ? WEDDING.groomFull : WEDDING.brideFull}</p>
      <Hairline className="my-2.5 w-10" />
      <p className="text-[11px] leading-snug text-cream/75 sm:text-sm">{g ? WEDDING.groomParents : WEDDING.brideParents}</p>
    </motion.div>
  );
}

function Couple() {
  return (
    <section className="relative overflow-hidden bg-royal-navy">
      {/* burgundy crown band, as in the reference */}
      <div className="absolute inset-x-0 top-0 h-[42%] rounded-b-[50%_3.5rem] border-b border-royal-gold/45 bg-royal-wine" />
      <CarvedCorner className="pointer-events-none absolute bottom-1 right-1 w-14 rotate-180 opacity-60 sm:w-20" />
      <div className="relative mx-auto max-w-md px-4 py-16 text-center sm:max-w-3xl sm:py-24">
        <motion.div {...reveal}>
          <p className="font-caps text-[10px] uppercase tracking-[0.38em] text-royal-gold-light/75 sm:text-xs">Bismillahirrahmanirrahim</p>
          <h2 className="mt-2 font-display text-[2.1rem] font-bold leading-tight text-royal-gold sm:text-5xl">Mempelai Kami</h2>
          <p className="mx-auto mt-3 max-w-sm text-xs leading-relaxed text-cream/85 sm:text-sm">
            Dengan memohon rahmat dan ridho Allah SWT, kami bermaksud menyelenggarakan pernikahan:
          </p>
        </motion.div>
        <motion.div variants={stagger} initial="hidden" whileInView="show" viewport={{ once: true, margin: "-60px" }}
          className="mt-10 grid grid-cols-2 items-start gap-4 sm:gap-12">
          <Person who="bride" />
          <Person who="groom" />
        </motion.div>
        <p className="mt-10 font-script text-4xl text-royal-gold/90">&</p>
      </div>
    </section>
  );
}

/* ------------------------------- countdown -------------------------------- */

function Countdown() {
  const [now, setNow] = useState<number | null>(null);
  useEffect(() => {
    setNow(Date.now());
    const t = setInterval(() => setNow(Date.now()), 1000);
    return () => clearInterval(t);
  }, []);
  const diff = Math.max(0, new Date(WEDDING.akad.date).getTime() - (now ?? 0));
  const parts = now === null ? [0, 0, 0, 0] : [diff / 864e5, (diff / 36e5) % 24, (diff / 6e4) % 60, (diff / 1e3) % 60].map(Math.floor);
  return (
    <div className="mt-8 grid grid-cols-4 gap-2 sm:gap-3">
      {["Hari", "Jam", "Menit", "Detik"].map((l, i) => (
        <div key={l} className="card-royal-navy py-3">
          <div className="font-display text-3xl font-semibold text-royal-gold">{parts[i]}</div>
          <div className="font-caps text-[9px] uppercase tracking-widest text-cream/75">{l}</div>
        </div>
      ))}
    </div>
  );
}

/* --------------------------------- events --------------------------------- */

function EventCard({ icon, title, e, tone }: { icon: string; title: string; e: typeof WEDDING.akad; tone: "wine" | "navy" }) {
  return (
    <div className="relative">
      <span className="absolute -left-[27px] top-9 h-3.5 w-3.5 rounded-full border-2 border-royal-gold bg-royal-wine sm:-left-[35px]" aria-hidden />
      <div className={`${tone === "wine" ? "card-royal-wine" : "card-royal-navy"} px-5 py-6`}>
        <h3 className="font-caps text-lg font-semibold tracking-[0.18em] text-royal-gold-light">{title.toUpperCase()}</h3>
        <Hairline className="my-3 w-full max-w-[12rem] opacity-60" />
        <p className="font-display text-lg font-semibold text-ivory">{e.label}</p>
        <p className="text-sm text-cream/80">{e.time}</p>
        <img src={icon} alt="" className="floaty mx-auto my-4 h-20 object-contain" />
        <p className="font-display text-xl font-semibold text-royal-gold">{e.place}</p>
        <p className="mt-1 text-sm text-cream/80">{e.address}</p>
        <a href={e.map} target="_blank" rel="noreferrer" className="btn-gold mt-5 px-6 py-2 text-sm">
          <MapPin className="h-4 w-4" /> Lihat Lokasi
        </a>
      </div>
    </div>
  );
}

/* -------------------------------- gallery --------------------------------- */

const GALLERY = [g1.url, pathImg.url, g2.url, g3.url, leavesImg.url];
const TILT = ["-rotate-2", "rotate-2", "rotate-1", "-rotate-1", "rotate-2"];

/* ---------------------------------- rsvp ---------------------------------- */

function Rsvp({ guest }: { guest: string }) {
  const [entries, setEntries] = useState<Entry[]>([]);
  const [name, setName] = useState(guest === "Tamu Undangan" ? "" : guest);
  const [attend, setAttend] = useState("Hadir");
  const [count, setCount] = useState(1);
  const [msg, setMsg] = useState("");
  useEffect(() => {
    setEntries(loadEntries());
  }, []);
  const submit = (ev: React.FormEvent) => {
    ev.preventDefault();
    if (!name.trim() || !msg.trim()) {
      toast.error("Mohon isi nama dan ucapan.");
      return;
    }
    setEntries(addEntry({ name: name.trim().slice(0, 60), attend, count, message: msg.trim().slice(0, 500), at: Date.now() }));
    setMsg("");
    toast.success("Terima kasih atas konfirmasi dan doanya!");
  };
  const wa = `https://wa.me/${WEDDING.whatsapp}?text=${encodeURIComponent(`Halo, saya ${name || "-"} konfirmasi: ${attend} (${count} orang). ${msg}`)}`;
  return (
    <>
      {entries.length > 0 ? (
        <div className="page-scroll mb-6 grid max-h-96 grid-cols-2 gap-3 overflow-y-auto p-1 text-left">
          {entries.map((e, i) => (
            <div key={i} className={`${i % 3 === 0 || i % 3 === 2 ? "card-royal-wine" : "card-royal-navy"} min-w-0 p-3.5`}>
              <p className="truncate font-display text-base font-semibold text-royal-gold">{e.name}</p>
              <p className="font-caps text-[9px] tracking-widest text-cream/70">{e.attend.toUpperCase()}</p>
              <p className="mt-1.5 line-clamp-4 break-words text-xs leading-relaxed text-ivory/90">{e.message}</p>
            </div>
          ))}
        </div>
      ) : (
        <p className="mb-6 font-display text-base italic text-cream/70">Jadilah yang pertama mengirim ucapan & doa.</p>
      )}
      <form onSubmit={submit} className="card-royal-wine space-y-3 p-5 text-left sm:p-6">
        <input className="field-royal" placeholder="Nama Anda" value={name} onChange={(e) => setName(e.target.value)} maxLength={60} aria-label="Nama" />
        <div className="grid grid-cols-2 gap-3">
          <select className="field-royal" value={attend} onChange={(e) => setAttend(e.target.value)} aria-label="Kehadiran">
            <option>Hadir</option>
            <option>Tidak Hadir</option>
            <option>Masih Ragu</option>
          </select>
          <select className="field-royal" value={count} onChange={(e) => setCount(Number(e.target.value))} aria-label="Jumlah tamu">
            {[1, 2, 3, 4].map((n) => (
              <option key={n} value={n}>{n} orang</option>
            ))}
          </select>
        </div>
        <textarea className="field-royal" rows={3} placeholder="Tulis ucapan & doa..." value={msg} onChange={(e) => setMsg(e.target.value)} maxLength={500} aria-label="Ucapan dan doa" />
        <div className="flex flex-col gap-2 pt-1 sm:flex-row">
          <button className="btn-gold flex-1 py-3 text-sm">Kirim Ucapan</button>
          <a href={wa} target="_blank" rel="noreferrer" className="btn-outline-gold flex-1 py-3 text-center text-sm">Konfirmasi via WhatsApp</a>
        </div>
      </form>
    </>
  );
}

/* ---------------------------------- page ---------------------------------- */

export function Main({ guest }: { guest: string }) {
  const { scrollY } = useScroll();
  const bgY = useTransform(scrollY, [0, 3000], ["0%", "20%"]);
  const [lightbox, setLightbox] = useState<string | null>(null);
  useEffect(() => {
    window.scrollTo(0, 0);
  }, []);
  const copy = (t: string) => {
    navigator.clipboard?.writeText(t);
    toast.success("Nomor rekening disalin");
  };
  return (
    <main className="relative overflow-hidden bg-royal-navy">
      <motion.div className="fixed inset-0 -z-10" style={{ y: bgY }}>
        <img src={leavesImg.url} alt="" className="h-[130%] w-full object-cover opacity-15" />
      </motion.div>

      <Hero guest={guest} />
      <Verse />
      <Couple />

      <Band tone="wine">
        <Heading kicker="Save the Date">Menghitung Hari</Heading>
        <img src={calendar.url} alt="18 & 20" className="floaty mx-auto h-36 sm:h-40" />
        <Countdown />
      </Band>

      <Band>
        <Heading kicker="Rangkaian Acara">Jadwal Acara</Heading>
        <div className="relative ml-6 space-y-8 text-center sm:ml-8">
          <div className="absolute -left-[21px] bottom-10 top-10 w-px bg-royal-gold/45 sm:-left-[29px]" aria-hidden />
          <EventCard icon={mosque.url} title="Akad Nikah" e={WEDDING.akad} tone="wine" />
          <EventCard icon={building.url} title="Resepsi" e={WEDDING.resepsi} tone="navy" />
        </div>
        <img src={pin.url} alt="" className="mx-auto mt-10 h-16 opacity-85" />
      </Band>

      <Band tone="wine" className="sm:max-w-3xl">
        <Heading kicker="Momen Bahagia">Galeri</Heading>
        <div className="grid grid-cols-2 gap-4 sm:grid-cols-3">
          {GALLERY.map((g, i) => (
            <button key={i} onClick={() => setLightbox(g)}
              className={`${TILT[i]} ${i === 0 ? "row-span-2" : ""} rounded-lg border border-royal-gold/60 bg-royal-navy p-1 shadow-[0_14px_28px_-14px_oklch(0.1_0.03_260/0.9)] transition-transform duration-500 hover:rotate-0 hover:scale-[1.03]`}>
              <img src={g} alt={`Galeri ${i + 1}`} loading="lazy" className={`w-full rounded-md object-cover ${i === 0 ? "h-full" : "aspect-square"}`} />
            </button>
          ))}
        </div>
      </Band>

      <Band>
        <Heading kicker="Tanda Kasih">Kado Digital</Heading>
        <p className="mb-6 text-sm text-cream/80">Doa restu Anda adalah hadiah terindah. Namun jika ingin memberi tanda kasih, dapat melalui:</p>
        <div className="grid gap-4 sm:grid-cols-2">
          {WEDDING.banks.map((b) => (
            <div key={b.number} className="card-royal-navy p-5 text-left">
              <p className="flex items-center gap-2 font-display text-xl font-semibold text-ivory">
                <Landmark className="h-4 w-4 shrink-0 text-royal-gold" /> {b.bank} <span className="text-sm font-normal text-cream/70">({b.name})</span>
              </p>
              <p className="mt-3 font-mono text-2xl tracking-widest text-ivory">{b.number}</p>
              <p className="text-sm text-cream/75">a.n. {b.name}</p>
              <div className="mt-3 flex justify-end">
                <button onClick={() => copy(b.number)} className="btn-gold px-4 py-1.5 text-xs">
                  <Copy className="h-3 w-3" /> Salin No. Rek
                </button>
              </div>
            </div>
          ))}
        </div>
        <div className="card-royal-wine mt-4 p-5 text-left text-sm">
          <p className="flex items-center gap-2 font-display text-lg font-semibold text-royal-gold"><Gift className="h-4 w-4" /> Alamat Pengiriman Kado</p>
          <p className="mt-1 flex gap-2 text-cream/85"><MapPin className="mt-0.5 h-3.5 w-3.5 shrink-0 text-royal-gold" /> {WEDDING.giftAddress}</p>
        </div>
      </Band>

      <Band>
        <Heading kicker="Konfirmasi Kehadiran">Kartu Ucapan & Doa</Heading>
        <Rsvp guest={guest} />
      </Band>

      <section className="relative overflow-hidden bg-royal-navy px-6 pb-28 pt-16 text-center">
        <div className="absolute inset-x-0 top-0 h-[38%] rounded-b-[50%_3rem] border-b border-royal-gold/40 bg-royal-wine" />
        <BotanicalSpray className="sway pointer-events-none absolute -bottom-2 -left-6 w-44 opacity-80 sm:w-64" />
        <BotanicalSpray className="sway pointer-events-none absolute -bottom-2 -right-6 w-44 opacity-80 sm:w-64" style={{ ["--orn-flip" as string]: "scaleX(-1)" }} />
        <motion.div {...reveal} className="relative mx-auto max-w-md">
          <div className="mx-auto w-36 rounded-t-full border border-royal-gold/60 bg-royal-navy px-4 pb-5 pt-8 shadow-[0_16px_36px_-16px_oklch(0.1_0.03_260/0.9)]">
            <img src={emblem.url} alt="S&L" className="mx-auto h-24" />
          </div>
          <p className="mt-6 text-sm leading-relaxed text-cream/85">
            Merupakan suatu kehormatan dan kebahagiaan bagi kami apabila Bapak/Ibu/Saudara/i berkenan hadir dan memberikan doa restu.
          </p>
          <p className="mt-5 font-script text-2xl text-cream/85">the wedding of</p>
          <p className="font-script text-5xl text-royal-gold">{WEDDING.bride} & {WEDDING.groom}</p>
        </motion.div>
      </section>

      {lightbox && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-night/95 p-4" onClick={() => setLightbox(null)}>
          <button className="absolute right-4 top-4 text-ivory" aria-label="Tutup">
            <X />
          </button>
          <img src={lightbox} alt="" className="max-h-full max-w-full rounded-xl" />
        </div>
      )}
    </main>
  );
}
