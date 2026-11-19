import groomPhoto from "@/assets/groom-portrait.webp.asset.json";
import bridePhoto from "@/assets/bride-portrait.webp.asset.json";

export const WEDDING = {
  bride: "Salsabila",
  groom: "Lukman",
  brideFull: "Salsabila Nur Azzahra",
  groomFull: "Muhammad Lukman Hakim",
  /**
   * Bride & groom portraits shown in the "Mempelai Kami" section (portrait 4:5 works best).
   * The current files are sample stand-ins: replace the asset files to swap in the real photos,
   * or set a value to "" to show the empty gold placeholder frame instead.
   */
  photos: { bride: bridePhoto.url, groom: groomPhoto.url },
  brideParents: "Putri dari Bapak Ahmad & Ibu Siti",
  groomParents: "Putra dari Bapak Hasan & Ibu Aminah",
  akad: { date: "2026-12-18T08:00:00+07:00", label: "Jumat, 18 Desember 2026", time: "08.00 WIB", place: "Masjid Agung Al-Azhar", address: "Jl. Sisingamangaraja, Jakarta Selatan", map: "https://maps.google.com/?q=Masjid+Agung+Al-Azhar+Jakarta" },
  resepsi: { date: "2026-12-20T11:00:00+07:00", label: "Minggu, 20 Desember 2026", time: "11.00 – 14.00 WIB", place: "Grand Ballroom Kempinski", address: "Jl. M.H. Thamrin No.1, Jakarta Pusat", map: "https://maps.google.com/?q=Hotel+Indonesia+Kempinski" },
  banks: [
    { bank: "BCA", number: "1234567890", name: "Salsabila" },
    { bank: "Mandiri", number: "0987654321", name: "Lukman" },
  ],
  giftAddress: "Jl. Mawar No. 18, Jakarta Selatan 12345",
  whatsapp: "6281234567890",
};
