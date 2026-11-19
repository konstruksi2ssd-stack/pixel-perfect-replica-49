import { useEffect, useState, type ReactNode } from "react";
import { motion, type Variants } from "framer-motion";
import { toast } from "sonner";
import { Copy, MapPin } from "lucide-react";
import monogram from "@/assets/monogram.png.asset.json";
import calendar from "@/assets/calendar.png.asset.json";
import mosque from "@/assets/mosque.png.asset.json";
import building from "@/assets/building.png.asset.json";
import divider from "@/assets/divider.png.asset.json";
import emblem from "@/assets/emblem.png.asset.json";
import floral from "@/assets/floral-corner.webp.asset.json";
import pathImg from "@/assets/garden-path.webp.asset.json";
import leavesImg from "@/assets/garden-leaves.webp.asset.json";
import g1 from "@/assets/gallery-couple.webp.asset.json";
import g2 from "@/assets/gallery-rings.webp.asset.json";
import g3 from "@/assets/gallery-table.webp.asset.json";
import { WEDDING } from "@/lib/wedding";
import { AR_RUM_21 } from "@/lib/verse";
import { addEntry, loadEntries, type Entry } from "@/lib/rsvp";

export const EASE = [0.22, 1, 0.36, 1] as const;
export const FLORAL = floral.url;

/* ---------- shared motion language (one rhythm for every page) ---------- */
export const stagger: Variants = { hidden: {}, show: { transition: { staggerChildren: 0.16, delayChildren: 0.25 } } };
const fadeUp: Variants = { hidden: { opacity: 0, y: 16 }, show: { opacity: 1, y: 0, transition: { duration: 0.9, ease: EASE } } };
const photoIn: Variants = { hidden: { opacity: 0, scale: 0.94 }, show: { opacity: 1, scale: 1, transition: { duration: 1.3, ease: EASE } } };
const ornIn: Variants = { hidden: { opacity: 0, scale: 0.8 }, show: { opacity: 0.95, scale: 1, transition: { duration: 1.5, ease: EASE } } };
const imgReveal: Variants = {
  hidden: { opacity: 0, clipPath: "inset(18% 18% 18% 18% round 10px)" },
  show: { opacity: 1, clipPath: "inset(0% 0% 0% 0% round 10px)", transition: { duration: 1.1, ease: EASE } },
};

const Up = ({ children, className = "" }: { children: ReactNode; className?: string }) => (
  <motion.div variants={fadeUp} className={className}>{children}</motion.div>
);

function Title({ kicker, children }: { kicker: string; children: ReactNode }) {
  return (
    <>
      <Up><p className="text-[10px] uppercase tracking-[0.4em] text-burgundy/80">{kicker}</p></Up>
      <Up><h2 className="mt-1 font-script text-[2.6rem] leading-tight text-gold-ink">{children}</h2></Up>
      <Up><Divider /></Up>
    </>
  );
}

function Divider({ className = "" }: { className?: string }) {
  return <img src={divider.url} alt="" className={`mx-auto opacity-90 ${className}`} style={{ height: 20, width: 170, objectFit: "cover", objectPosition: "top" }} />;
}

export type PageCtx = { guest: string; openPhoto: (src: string) => void };
export type PageDef = { id: string; title: string; render: (ctx: PageCtx) => ReactNode };

/* ---------- pages ---------- */

function Opening({ guest }: PageCtx) {
  return (
    <>
      <Up><p className="text-[10px] uppercase tracking-[0.45em] text-burgundy/80">The Wedding of</p></Up>
      <motion.img variants={ornIn} src={monogram.url} alt="Monogram S&L" className="floaty mx-auto mt-4 h-24" />
      <Up><h1 className="mt-3 font-script text-[3.1rem] leading-[1.05] text-gold-ink">{WEDDING.bride}</h1></Up>
      <Up><span className="font-display text-2xl italic text-burgundy">&</span></Up>
      <Up><p className="font-script text-[3.1rem] leading-[1.05] text-gold-ink">{WEDDING.groom}</p></Up>
      <Up><Divider className="mt-3" /></Up>
      <Up><p className="mt-2 font-display text-lg italic text-ink">18 & 20 Desember 2026</p></Up>
      <Up>
        <p className="mt-5 text-[10px] uppercase tracking-[0.32em] text-ink/60">Kepada Yth.</p>
        <p className="mt-1 max-w-[16rem] truncate font-display text-xl font-semibold text-navy">{guest}</p>
        <p className="mt-1 text-[11px] text-ink/60">di tempat</p>
      </Up>
    </>
  );
}

function Verse() {
  return (
    <>
      <Up><p className="text-[10px] uppercase tracking-[0.4em] text-burgundy/80">Firman Allah SWT</p></Up>
      <motion.div variants={ornIn} className="mt-2 flex justify-center gap-1">
        <img src={FLORAL} alt="" className="h-7 w-7 -scale-x-100 rotate-90 opacity-80" />
        <img src={FLORAL} alt="" className="h-7 w-7 rotate-180 opacity-80" />
      </motion.div>
      <Up>
        <blockquote dir="rtl" lang="ar" className="mt-3 font-arabic text-[1.22rem] leading-[2.05] text-ink" style={{ wordSpacing: "0.06em" }}>
          {AR_RUM_21.arabic}
        </blockquote>
      </Up>
      <Up><div className="mx-auto my-4 h-px w-20 bg-burgundy/40" /></Up>
      <Up><p className="font-display text-[0.98rem] italic leading-relaxed text-ink/85">"{AR_RUM_21.translation}"</p></Up>
      <Up><p className="mt-4 text-xs font-medium tracking-[0.25em] text-burgundy">{AR_RUM_21.reference}</p></Up>
    </>
  );
}

function Person({ who }: { who: "groom" | "bride" }) {
  const g = who === "groom";
  const name = g ? WEDDING.groomFull : WEDDING.brideFull;
  const nick = g ? WEDDING.groom : WEDDING.bride;
  return (
    <>
      <Up><p className="text-[10px] uppercase tracking-[0.4em] text-burgundy/80">{g ? "Mempelai Pria" : "Mempelai Wanita"}</p></Up>
      <motion.div variants={stagger} className="relative mx-auto mt-4 w-[64%] max-w-[13rem]">
        <motion.div variants={photoIn} className="relative rounded-t-full border-[3px] border-gold-deep/80 p-1.5 shadow-sheet">
          <div className="overflow-hidden rounded-t-full border border-burgundy/40">
            <img src={g ? WEDDING.photos.groom : WEDDING.photos.bride} alt={`Foto ${g ? "mempelai pria" : "mempelai wanita"}, ${nick}`} className="aspect-[4/5] w-full object-cover" />
          </div>
        </motion.div>
        <motion.img variants={ornIn} src={FLORAL} alt="" className="pointer-events-none absolute -left-[14%] bottom-[-8%] w-[46%] -scale-y-100" />
        <motion.img variants={ornIn} src={FLORAL} alt="" className="pointer-events-none absolute -right-[14%] bottom-[-8%] w-[46%] rotate-180" />
      </motion.div>
      <Up><h3 className="mt-6 font-script text-[2.5rem] leading-none text-gold-ink">{nick}</h3></Up>
      <Up><p className="mt-2 font-display text-lg font-semibold text-navy">{name}</p></Up>
      <Up><div className="mx-auto my-2 h-px w-16 bg-burgundy/40" /></Up>
      <Up><p className="text-sm text-ink/75">{g ? WEDDING.groomParents : WEDDING.brideParents}</p></Up>
    </>
  );
}

function Countdown() {
  const [now, setNow] = useState<number | null>(null);
  useEffect(() => {
    setNow(Date.now());
    const t = setInterval(() => setNow(Date.now()), 1000);
    return () => {
      clearInterval(t);
    };
  }, []);
  const diff = Math.max(0, new Date(WEDDING.akad.date).getTime() - (now ?? 0));
  const parts = now === null ? [0, 0, 0, 0] : [diff / 864e5, (diff / 36e5) % 24, (diff / 6e4) % 60, (diff / 1e3) % 60].map(Math.floor);
  return (
    <motion.div variants={stagger} className="mt-5 grid grid-cols-4 gap-2">
      {["Hari", "Jam", "Menit", "Detik"].map((l, i) => (
        <motion.div key={l} variants={fadeUp} className="rounded-lg border border-gold/40 bg-navy py-2.5 shadow-sheet">
          <div className="font-display text-2xl text-gold-grad">{parts[i]}</div>
          <div className="text-[9px] uppercase tracking-widest text-cream/80">{l}</div>
        </motion.div>
      ))}
    </motion.div>
  );
}

function SaveDate() {
  return (
    <>
      <Title kicker="Save the Date">Menghitung Hari</Title>
      <motion.img variants={photoIn} src={calendar.url} alt="18 & 20 Desember" className="floaty mx-auto mt-2 h-28" />
      <Up><p className="mt-3 font-display text-base italic text-ink/80">Menuju hari bahagia kami</p></Up>
      <Countdown />
    </>
  );
}

function EventCard({ icon, title, e, tone }: { icon: string; title: string; e: typeof WEDDING.akad; tone: "navy" | "wine" }) {
  return (
    <motion.div variants={fadeUp} className="overflow-hidden rounded-xl border border-gold-deep/35 bg-ivory/70 text-left shadow-sheet">
      <div className={`flex items-center gap-3 px-4 py-2.5 ${tone === "navy" ? "bg-navy" : "bg-wine-grad"}`}>
        <img src={icon} alt="" className="h-9 w-9 object-contain" />
        <h3 className="font-display text-xl text-ivory">{title}</h3>
      </div>
      <div className="px-4 py-3">
        <p className="font-semibold text-navy">{e.label}</p>
        <p className="text-sm font-medium text-burgundy">{e.time}</p>
        <p className="mt-1.5 font-display text-base font-semibold text-ink">{e.place}</p>
        <p className="text-xs text-ink/70">{e.address}</p>
        <motion.a whileHover={{ y: -2 }} whileTap={{ scale: 0.95 }} href={e.map} target="_blank" rel="noreferrer" className="btn-wine mt-3 px-4 py-1.5 text-xs font-medium">
          <MapPin className="h-3.5 w-3.5" /> Lihat Lokasi
        </motion.a>
      </div>
    </motion.div>
  );
}

function Events() {
  return (
    <>
      <Title kicker="Rangkaian Acara">Waktu & Tempat</Title>
      <motion.div variants={stagger} className="mt-1 w-full space-y-3">
        <EventCard icon={mosque.url} title="Akad Nikah" e={WEDDING.akad} tone="navy" />
        <EventCard icon={building.url} title="Resepsi" e={WEDDING.resepsi} tone="wine" />
      </motion.div>
    </>
  );
}

export const GALLERY = [g1.url, g2.url, pathImg.url, g3.url, leavesImg.url];
const TILES = [
  { area: "1 / 1 / 4 / 5", rot: -1.5 },
  { area: "1 / 5 / 3 / 7", rot: 2 },
  { area: "3 / 5 / 6 / 7", rot: -1 },
  { area: "4 / 1 / 6 / 3", rot: 1.5 },
  { area: "4 / 3 / 6 / 5", rot: -2 },
];

function Gallery({ openPhoto }: PageCtx) {
  return (
    <>
      <Title kicker="Momen Bahagia">Galeri</Title>
      <motion.div variants={stagger} className="mt-1 grid w-full grid-cols-6 gap-2" style={{ gridTemplateRows: "repeat(5, minmax(46px, 1fr))", aspectRatio: "6 / 5.4" }}>
        {GALLERY.map((g, i) => (
          <motion.button
            key={g}
            variants={imgReveal}
            onClick={() => openPhoto(g)}
            aria-label={`Buka foto galeri ${i + 1}`}
            className="group relative overflow-hidden rounded-[10px] border-[3px] border-ivory shadow-sheet"
            style={{ gridArea: TILES[i]?.area, rotate: `${TILES[i]?.rot ?? 0}deg` }}
          >
            <img src={g} alt={`Galeri ${i + 1}`} loading="lazy" className="h-full w-full object-cover transition-transform duration-700 ease-out md:group-hover:scale-[1.04]" />
          </motion.button>
        ))}
      </motion.div>
      <Up><p className="mt-3 text-[11px] italic text-ink/60">Sentuh foto untuk memperbesar</p></Up>
    </>
  );
}

function Gift() {
  const copy = (t: string) => {
    navigator.clipboard?.writeText(t);
    toast.success("Nomor rekening disalin");
  };
  return (
    <>
      <Title kicker="Tanda Kasih">Wedding Gift</Title>
      <Up><p className="mb-3 text-xs leading-relaxed text-ink/75">Doa restu Anda adalah hadiah terindah. Namun jika ingin memberi tanda kasih, dapat melalui:</p></Up>
      <motion.div variants={stagger} className="w-full space-y-2.5">
        {WEDDING.banks.map((b) => (
          <motion.div key={b.number} variants={fadeUp} className="rounded-xl border border-gold/40 bg-wine-grad p-4 text-left shadow-wine">
            <div className="flex items-center justify-between">
              <p className="font-display text-xl text-gold">{b.bank}</p>
              <motion.button whileHover={{ y: -1 }} whileTap={{ scale: 0.94 }} onClick={() => copy(b.number)} className="btn-ghost-gold px-3 py-1 text-[11px]">
                <Copy className="h-3 w-3" /> Salin
              </motion.button>
            </div>
            <p className="mt-2 font-mono text-lg tracking-widest text-ivory">{b.number}</p>
            <p className="text-xs text-cream/80">a.n. {b.name}</p>
          </motion.div>
        ))}
        <motion.div variants={fadeUp} className="rounded-xl border border-gold-deep/35 bg-ivory/70 p-3 text-left text-xs shadow-sheet">
          <p className="font-display text-base font-semibold text-navy">Kirim Kado</p>
          <p className="text-ink/75">{WEDDING.giftAddress}</p>
        </motion.div>
      </motion.div>
    </>
  );
}

function Rsvp({ guest }: PageCtx) {
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
  const field = "w-full rounded-md border border-gold-deep/40 bg-ivory/90 px-3 py-2 text-sm text-ink placeholder:text-ink/45 outline-none focus:ring-2 focus:ring-burgundy/35";
  return (
    <>
      <Title kicker="Konfirmasi Kehadiran">RSVP & Ucapan</Title>
      <Up className="w-full">
        <form onSubmit={submit} className="space-y-2 text-left">
          <input className={field} placeholder="Nama" value={name} onChange={(e) => setName(e.target.value)} maxLength={60} aria-label="Nama" />
          <div className="grid grid-cols-2 gap-2">
            <select className={field} value={attend} onChange={(e) => setAttend(e.target.value)} aria-label="Kehadiran">
              <option>Hadir</option>
              <option>Tidak Hadir</option>
              <option>Masih Ragu</option>
            </select>
            <select className={field} value={count} onChange={(e) => setCount(Number(e.target.value))} aria-label="Jumlah tamu">
              {[1, 2, 3, 4].map((n) => (
                <option key={n} value={n}>{n} orang</option>
              ))}
            </select>
          </div>
          <textarea className={field} rows={2} placeholder="Ucapan & doa" value={msg} onChange={(e) => setMsg(e.target.value)} maxLength={500} aria-label="Ucapan dan doa" />
          <div className="flex gap-2">
            <motion.button whileTap={{ scale: 0.96 }} className="btn-wine flex-1 py-2 text-xs font-medium">Kirim Ucapan</motion.button>
            <motion.a whileTap={{ scale: 0.96 }} href={wa} target="_blank" rel="noreferrer" className="flex-1 rounded-full border border-navy/40 py-2 text-center text-xs font-medium text-navy transition-colors hover:bg-navy/10">Via WhatsApp</motion.a>
          </div>
        </form>
      </Up>
      <Up className="mt-3 w-full space-y-2 text-left">
        {entries.map((e, i) => (
          <div key={i} className="rounded-lg border border-burgundy/20 bg-burgundy/5 px-3 py-2">
            <div className="flex items-center justify-between gap-2">
              <span className="truncate font-display text-base font-semibold text-burgundy">{e.name}</span>
              <span className="shrink-0 text-[10px] text-ink/60">{e.attend}</span>
            </div>
            <p className="break-words text-xs text-ink/80">{e.message}</p>
          </div>
        ))}
      </Up>
    </>
  );
}

function Closing() {
  return (
    <>
      <motion.img variants={ornIn} src={emblem.url} alt="S&L" className="floaty mx-auto h-24" />
      <Up><p className="mx-auto mt-5 max-w-[17rem] text-sm leading-relaxed text-ink/80">
        Merupakan suatu kehormatan dan kebahagiaan bagi kami apabila Bapak/Ibu/Saudara/i berkenan hadir dan memberikan doa restu.
      </p></Up>
      <Up><Divider className="mt-4" /></Up>
      <Up><p className="mt-3 text-[10px] uppercase tracking-[0.35em] text-burgundy/80">Kami yang berbahagia</p></Up>
      <Up><p className="mt-1 font-script text-[2.6rem] leading-tight text-gold-ink">{WEDDING.bride} & {WEDDING.groom}</p></Up>
      <Up><p className="mt-4 font-display text-sm italic text-ink/70">Wassalamu'alaikum Warahmatullahi Wabarakatuh</p></Up>
      <motion.div variants={ornIn} className="mt-4 flex justify-center gap-2">
        <img src={FLORAL} alt="" className="sway h-12 w-12 -scale-y-100" />
        <img src={FLORAL} alt="" className="sway h-12 w-12 rotate-180" />
      </motion.div>
    </>
  );
}

export const PAGES: PageDef[] = [
  { id: "pembuka", title: "Pembuka", render: (c) => <Opening {...c} /> },
  { id: "ayat", title: "QS. Ar-Rum : 21", render: () => <Verse /> },
  { id: "mempelai-pria", title: "Mempelai Pria", render: () => <Person who="groom" /> },
  { id: "mempelai-wanita", title: "Mempelai Wanita", render: () => <Person who="bride" /> },
  { id: "tanggal", title: "Save the Date", render: () => <SaveDate /> },
  { id: "acara", title: "Waktu & Tempat", render: () => <Events /> },
  { id: "galeri", title: "Galeri", render: (c) => <Gallery {...c} /> },
  { id: "hadiah", title: "Wedding Gift", render: () => <Gift /> },
  { id: "rsvp", title: "RSVP & Ucapan", render: (c) => <Rsvp {...c} /> },
  { id: "penutup", title: "Penutup", render: () => <Closing /> },
];
