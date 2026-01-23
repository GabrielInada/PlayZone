"use client";
import { useState } from "react";
import { ArrowRightFromLineIcon, CircleUserIcon, Menu, X } from "lucide-react";
import { ContainerHeader } from "../ContainerHeader";
import { Logo } from "../Logo";

const linkClass =
    "text-[#0a0f1a] font-semibold opacity-90 hover:opacity-100 hover:underline cursor-pointer";

export function Header() {
    const [open, setOpen] = useState(false);

    return (
        <ContainerHeader>
            <header className="bg-white">
                {/* MOBILE/TABLET: coluna (logo em cima, botão embaixo)
            DESKTOP (lg+): linha (layout normal) */}
                <nav className="relative flex flex-col items-center gap-3 py-2 lg:flex-row lg:gap-10 lg:justify-end">
                    {/* Logo (no mobile não precisa ser absolute) */}
                    <div className="shrink-0 lg:mr-auto">
                        <Logo />
                    </div>

                    {/* Botão hambúrguer centralizado (mobile/tablet) */}
                    <button
                        type="button"
                        className="inline-flex lg:hidden items-center justify-center rounded-lg border border-black/10 p-2"
                        aria-label={open ? "Fechar menu" : "Abrir menu"}
                        onClick={() => setOpen((v) => !v)}
                    >
                        {open ? <X className="h-6 w-6" /> : <Menu className="h-6 w-6" />}
                    </button>

                    {/* Links desktop/tablet */}
                    <div className="hidden lg:flex items-center gap-10">
                        <a className={linkClass}>Início</a>
                        <a className={linkClass}>Campeonatos</a>
                        <a className={linkClass}>Tabelas</a>
                        <a className={linkClass}>Minha Conta</a>
                    </div>

                    {/* Bloco do usuário (desktop/tablet) */}
                    <div className="hidden lg:flex items-center gap-4">
                        <CircleUserIcon className="h-10 w-10 text-[#044710]" />

                        <div className="flex flex-col gap-[0.2rem] leading-[1.1]">
                            <p className="m-0 whitespace-nowrap text-[#044710]">
                                Gabriel Athayde Gabriel de Inada
                            </p>

                            <p
                                className="
                  m-0 mt-[0.2rem]
                  w-32 md:w-24
                  rounded-[0.8rem]
                  border border-[#044710]
                  bg-[#044710] text-white
                  text-center
                  text-[0.9em]
                  py-[0.3rem]
                  opacity-80
                "
                            >
                                Admin
                            </p>
                        </div>
                    </div>

                    {/* Botão sair (desktop/tablet) */}
                    <button className="hidden lg:inline-flex border-0 opacity-60 bg-transparent">
                        <ArrowRightFromLineIcon />
                    </button>

                    {/* Painel mobile (dropdown) */}
                    {open && (
                        <div
                            className="
                w-full
                rounded-xl border border-black/10
                bg-white shadow-lg
                lg:hidden
                p-4
                mt-2
              "
                            role="dialog"
                            aria-modal="true"
                        >
                            {/* Usuário no mobile */}
                            <div className="flex items-center gap-3 pb-4 border-b border-black/10">
                                <CircleUserIcon className="h-12 w-12 text-[#044710]" />
                                <div className="min-w-0">
                                    <p className="m-0 text-[#044710] font-medium truncate">
                                        Gabriel Athayde Gabriel de Inada
                                    </p>
                                    <p
                                        className="
                      m-0 mt-2
                      inline-flex
                      rounded-[0.8rem]
                      border border-[#044710]
                      bg-[#044710] text-white
                      text-center
                      text-[0.9em]
                      px-3 py-1
                      opacity-80
                    "
                                    >
                                        Admin
                                    </p>
                                </div>
                            </div>

                            {/* Links mobile */}
                            <div className="flex flex-col gap-3 pt-4">
                                <a className={linkClass} onClick={() => setOpen(false)}>
                                    Início
                                </a>
                                <a className={linkClass} onClick={() => setOpen(false)}>
                                    Campeonatos
                                </a>
                                <a className={linkClass} onClick={() => setOpen(false)}>
                                    Tabelas
                                </a>
                                <a className={linkClass} onClick={() => setOpen(false)}>
                                    Minha Conta
                                </a>
                            </div>

                            {/* Ação (mobile) */}
                            <div className="pt-4">
                                <button
                                    className="inline-flex items-center gap-2 opacity-60 border-0 bg-transparent"
                                    onClick={() => setOpen(false)}
                                >
                                    <ArrowRightFromLineIcon />
                                    Sair
                                </button>
                            </div>
                        </div>
                    )}
                </nav>

                {/* ✅ removido o <hr /> */}
            </header>
        </ContainerHeader>
    );
}
