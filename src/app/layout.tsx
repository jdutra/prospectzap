import type { Metadata } from "next";
import "./globals.css";

export const metadata: Metadata = {
  title: "LondrinaZAP",
  description: "O assistente digital de Londrina via WhatsApp",
};

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="pt-BR">
      <body className="bg-[#0a0a0a] text-gray-100">{children}</body>
    </html>
  );
}
