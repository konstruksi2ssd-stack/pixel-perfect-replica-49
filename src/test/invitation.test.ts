import { readFileSync } from "node:fs";
import { describe, expect, it } from "vitest";
import { AR_RUM_21 } from "@/lib/verse";

describe("Secret Garden invitation rules", () => {
  it("shows the complete Arabic text of QS. Ar-Rum 21", () => {
    expect(AR_RUM_21.arabic).toBe(
      "وَمِنْ آيَاتِهِ أَنْ خَلَقَ لَكُمْ مِنْ أَنْفُسِكُمْ أَزْوَاجًا لِتَسْكُنُوا إِلَيْهَا وَجَعَلَ بَيْنَكُمْ مَوَدَّةً وَرَحْمَةً إِنَّ فِي ذَٰلِكَ لَآيَاتٍ لِقَوْمٍ يَتَفَكَّرُونَ",
    );
    expect(AR_RUM_21.reference).toBe("QS. Ar-Rum : 21");
  });

  it("has no Reguler / Premium (VIP) choice on the door cover", () => {
    const cover = readFileSync("src/components/invite/Cover.tsx", "utf8");
    expect(cover).not.toMatch(/reguler|premium|vip/i);
  });
});
