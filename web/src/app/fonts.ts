import { Dela_Gothic_One, DotGothic16, Roboto, VT323, Zen_Kaku_Gothic_New } from "next/font/google";

// Google serves the Japanese glyphs as unicode-range slices, so only the latin
// subset is preloaded and the rest loads as a page needs it
export const dela = Dela_Gothic_One({ weight: "400", subsets: ["latin"], display: "swap", variable: "--font-dela", preload: false });
export const dot = DotGothic16({ weight: "400", subsets: ["latin"], display: "swap", variable: "--font-dot", preload: false });
export const zen = Zen_Kaku_Gothic_New({ weight: ["400", "700", "900"], subsets: ["latin"], display: "swap", variable: "--font-zen", preload: false });
// Only the x360ce website mock in the guide uses these two
export const vt323 = VT323({ weight: "400", subsets: ["latin"], display: "swap", variable: "--font-vt323", preload: false });
export const roboto = Roboto({ weight: "400", subsets: ["latin"], display: "swap", variable: "--font-roboto", preload: false });

export const fontVariables = [dela, dot, zen, vt323, roboto].map((f) => f.variable).join(" ");
