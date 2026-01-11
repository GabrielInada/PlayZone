import "./globals.css";
import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "UFRA PlayZone",
  description: "Sistema de gerenciamento de partidas",
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="pt-br">
      <body>
        {children}
      </body>
    </html>
  );
}