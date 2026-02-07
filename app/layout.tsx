import type { Metadata } from "next";
import { Inter } from "next/font/google";
import "./globals.css";

const inter = Inter({ subsets: ["latin"] });

// --- ส่วนจูน SEO (Metadata) ---
export const metadata: Metadata = {
  title: {
    default: "ARAFT STUDIO | Architectural Excellence",
    template: "%s | ARAFT STUDIO"
  },
  description: "Crafting the future of living spaces. สตูดิโอออกแบบสถาปัตยกรรมที่มุ่งเน้นความร่วมสมัยและความยั่งยืน",
  keywords: ["Architect", "Interior Design", "Araft Studio", "สถาปนิก", "ออกแบบบ้าน"],
  authors: [{ name: "Thanakorn" }],
  // ส่วนนี้สำคัญมากเวลาแชร์ลง LINE / Facebook
  openGraph: {
    title: "ARAFT STUDIO | Architectural Excellence",
    description: "รับออกแบบสถาปัตยกรรมและภายใน โดยทีมงานมืออาชีพ",
    url: "https://your-vercel-domain.vercel.app", // แก้เป็น URL จริงของคุณธนกร
    siteName: "ARAFT STUDIO",
    locale: "th_TH",
    type: "website",
  },
  twitter: {
    card: "summary_large_image",
    title: "ARAFT STUDIO",
    description: "Crafting the future of living spaces.",
  },
  // ส่วนของ Favicon (ไอคอนเล็กๆ บนแท็บ)
  icons: {
    icon: "/favicon.ico",
  },
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="th" className="scroll-smooth">
      <body className={`${inter.className} bg-[#0c0c0c] antialiased`}>
        {children}
      </body>
    </html>
  );
}