"use client";
import { useState } from "react";
import { useRouter } from "next/navigation";
import { ArrowRightFromLineIcon, CircleUserIcon, Menu, X } from "lucide-react";
import { ContainerHeader } from "../ContainerHeader";
import { Logo } from "../Logo";
import {CAMPEONATOS_ROUTE, HOME_ROUTE,TABELAS_ROUTE,} from "@/constants/routes";

// ── Tipos ─────────────────────────────────────────────────────────────────────
interface NavLink {
  label: string;
  href: string;
}

// ── Constantes estáticas ──────────────────────────────────────────────────────
const NAV_LINKS: NavLink[] = [
  { label: "Início",        href: HOME_ROUTE },
  { label: "Campeonatos",   href: CAMPEONATOS_ROUTE},
  { label: "Tabelas",       href: TABELAS_ROUTE },
  { label: "Minha Conta",   href: "/conta" },
];

const linkClass =
  "text-[#0a0f1a] font-semibold opacity-90 hover:opacity-100 hover:underline cursor-pointer transition-opacity";

// ── Sub-componentes ───────────────────────────────────────────────────────────
interface UserInfoProps {
  name: string;
  role: string;
  iconSize?: number;
}

function UserInfo({ name, role, iconSize = 10 }: UserInfoProps) {
  return (
    <div className="flex items-center gap-3">
      <CircleUserIcon className={`h-${iconSize} w-${iconSize} text-[#044710]`} />
      <div className="flex flex-col leading-[1.1] min-w-0">
        <p className="m-0 text-[#116A24] truncate">{name}</p>
        <span className="mt-1 inline-flex w-fit rounded-[0.8rem] bg-[#044710] px-3 py-1 text-sm text-white opacity-80">
          {role}
        </span>
      </div>
    </div>
  );
}

function LogoutButton({ onClick, showLabel = false }: { onClick?: () => void; showLabel?: boolean }) {
  return (
    <button
      type="button"
      onClick={onClick}
      className="inline-flex items-center gap-2 border-0 bg-transparent opacity-60 hover:opacity-100 cursor-pointer transition-opacity"
      aria-label="Sair"
    >
      <ArrowRightFromLineIcon />
      {showLabel && <span>Sair</span>}
    </button>
  );
}

// ── Componente principal ──────────────────────────────────────────────────────
export function Header() {
  const router = useRouter();
  const [open, setOpen] = useState(false);

  // Dados do usuário viriam de contexto/auth futuramente
  const user = { name: "Gabriel Athayde Gabriel de Inada", role: "Admin" };

  const handleNav = (href: string) => {
    setOpen(false);
    router.push(href);
  };

  return (
    <header className="bg-white">
      <ContainerHeader>
        <nav className="flex flex-col items-center gap-3 lg:flex-row lg:items-center lg:justify-between lg:gap-6">

          {/* Logo */}
          <div className="shrink-0 lg:flex lg:items-center">
            <div className="scale-[0.85] origin-center lg:scale-[0.75] lg:origin-left">
              <Logo />
            </div>
          </div>

          {/* Links — desktop */}
          <div className="hidden lg:flex flex-1 items-center justify-center gap-10">
            {NAV_LINKS.map(({ label, href }) => (
              <a key={href} onClick={() => handleNav(href)} className={linkClass}>
                {label}
              </a>
            ))}
          </div>

          {/* Usuário + Sair — desktop */}
          <div className="hidden lg:flex items-center gap-4">
            <UserInfo name={user.name} role={user.role} />
            <LogoutButton />
          </div>

          {/* Hambúrguer — mobile */}
          <button
            type="button"
            className="inline-flex lg:hidden items-center justify-center rounded-lg border border-black/10 p-2 cursor-pointer"
            aria-label={open ? "Fechar menu" : "Abrir menu"}
            onClick={() => setOpen((v) => !v)}
          >
            {open ? <X className="h-6 w-6" /> : <Menu className="h-6 w-6" />}
          </button>

          {/* Dropdown — mobile */}
          {open && (
            <div
              className="w-full rounded-xl border border-black/10 bg-white shadow-lg lg:hidden p-4 mt-2"
              role="dialog"
              aria-modal="true"
            >
              <div className="pb-4 border-b border-black/10">
                <UserInfo name={user.name} role={user.role} iconSize={12} />
              </div>

              <div className="flex flex-col gap-3 pt-4">
                {NAV_LINKS.map(({ label, href }) => (
                  <a key={href} onClick={() => handleNav(href)} className={linkClass}>
                    {label}
                  </a>
                ))}
              </div>

              <div className="pt-4">
                <LogoutButton showLabel onClick={() => setOpen(false)} />
              </div>
            </div>
          )}
        </nav>

        {/* Divider — desktop */}
        <hr className="hidden lg:block border-t-2 border-black/30" />
      </ContainerHeader>
    </header>
  );
}