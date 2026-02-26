import { FacebookIcon, MailIcon, TwitterIcon } from "lucide-react";
import { FaWhatsapp } from "react-icons/fa";
import { ContainerHeader } from "../ContainerHeader";
import { Logo } from "../Logo";

// ── Constantes estáticas ──────────────────────────────────────────────────────
const NAV_LINKS = [
  { label: "suporte@ufraplayzone.com.br", href: "mailto:suporte@ufraplayzone.com.br" },
  { label: "Política de Privacidade",     href: "/privacidade" },
  { label: "© 2026 UFRA Playzone",        href: "#" },
];

const SOCIAL_LINKS = [
  { label: "WhatsApp", href: "#", icon: <FaWhatsapp size={22} /> },
  { label: "Facebook", href: "#", icon: <FacebookIcon className="h-[22px] w-[22px]" /> },
  { label: "E-mail",   href: "#", icon: <MailIcon     className="h-[22px] w-[22px]" /> },
  { label: "Twitter",  href: "#", icon: <TwitterIcon  className="h-[22px] w-[22px]" /> },
];

const linkClass =
  "text-[#116A24] font-semibold opacity-90 hover:opacity-100 hover:underline cursor-pointer transition-opacity";

// ── Componente ────────────────────────────────────────────────────────────────
export function Footer() {
  return (
    <footer className="bg-[#F5F5F5] mt-auto">
      <ContainerHeader>

        <nav className="flex flex-col items-center gap-3 lg:flex-row lg:items-center lg:justify-between lg:gap-6 py-2">

          {/* Logo */}
          <div className="shrink-0 lg:flex lg:items-center">
            <div className="scale-[0.85] origin-center lg:scale-[0.75] lg:origin-left">
              <Logo />
            </div>
          </div>

          {/* Links — desktop */}
          <div className="hidden lg:flex flex-1 items-center justify-center gap-10">
            {NAV_LINKS.map(({ label, href }) => (
              <a key={label} href={href} className={linkClass}>{label}</a>
            ))}
          </div>

          {/* Ícones sociais — desktop */}
          <div className="hidden lg:flex items-center gap-4">
            {SOCIAL_LINKS.map(({ label, href, icon }) => (
              <a
                key={label}
                href={href}
                aria-label={label}
                className="text-[#116A24] opacity-60 hover:opacity-100 cursor-pointer transition-opacity"
              >
                {icon}
              </a>
            ))}
          </div>

          {/* Mobile — links + ícones empilhados */}
          <div className="flex flex-col items-center gap-3 lg:hidden w-full">
            {NAV_LINKS.map(({ label, href }) => (
              <a key={label} href={href} className={linkClass}>{label}</a>
            ))}
            <div className="flex items-center gap-4 pt-1">
              {SOCIAL_LINKS.map(({ label, href, icon }) => (
                <a
                  key={label}
                  href={href}
                  aria-label={label}
                  className="text-[#116A24] opacity-60 hover:opacity-100 cursor-pointer transition-opacity"
                >
                  {icon}
                </a>
              ))}
            </div>
          </div>

        </nav>
      </ContainerHeader>
    </footer>
  );
}