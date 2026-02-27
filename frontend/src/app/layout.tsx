import type { Metadata } from "next";
import { Roboto, Geist, Geist_Mono } from "next/font/google";
import "@/app/globals.css";
import { Toaster } from 'react-hot-toast';

const roboto = Roboto({
  weight: ['400', '500', '700'],
  subsets: ['latin'],
  display: 'swap',
});

const geistSans = Geist({
  variable: "--font-geist-sans",
  subsets: ["latin"],
});

const geistMono = Geist_Mono({
  variable: "--font-geist-mono",
  subsets: ["latin"],
});

export const metadata: Metadata = {
  title: "UFRA PlayZone",
  description: "Sistema de gerenciamento de partidas",
};

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="pt-br" className={roboto.className}>
      <body>
        {children}
        {/* Posiciona as notificações no topo e centro por padrão */}
        <Toaster position="top-center" reverseOrder={false} />
      </body>
    </html>
  );
}