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
        <header className="bg-white">
            <ContainerHeader>
                <nav className="flex flex-col items-center gap-3 py-2 lg:flex-row lg:items-center lg:justify-between lg:gap-6">
                    {/* LOGO menor (mobile e desktop) */}
                    <div className="shrink-0 lg:flex lg:items-center">
                        <div className="scale-[0.85] origin-center lg:scale-[0.75] lg:origin-left">
                            <Logo />
                        </div>
                    </div>

                    {/* LINKS centralizados (desktop) */}
                    <div className="hidden lg:flex flex-1 items-center justify-center gap-10">
                        <a className={linkClass}>Início</a>
                        <a className={linkClass}>Campeonatos</a>
                        <a className={linkClass}>Tabelas</a>
                        <a className={linkClass}>Minha Conta</a>
                    </div>

                    {/* USER + SAIR (desktop) */}
                    <div className="hidden lg:flex items-center gap-4">
                        <div className="flex items-center gap-3">
                            <CircleUserIcon className="h-10 w-10 text-[#044710]" />

                            <div className="flex flex-col leading-[1.1]">
                                <p className="m-0 whitespace-nowrap text-[#116A24]">
                                    Gabriel Athayde Gabriel de Inada
                                </p>

                                <span className="mt-1 inline-flex w-fit rounded-[0.8rem] bg-[#044710] px-3 py-1 text-sm text-white opacity-80">
                  Admin
                </span>
                            </div>
                        </div>

                        <button
                            type="button"
                            className="inline-flex border-0 bg-transparent opacity-60 hover:opacity-100"
                            aria-label="Sair"
                        >
                            <ArrowRightFromLineIcon />
                        </button>
                    </div>

                    {/* HAMBÚRGUER centralizado (mobile/tablet) */}
                    <button
                        type="button"
                        className="inline-flex lg:hidden items-center justify-center rounded-lg border border-black/10 p-2"
                        aria-label={open ? "Fechar menu" : "Abrir menu"}
                        onClick={() => setOpen((v) => !v)}
                    >
                        {open ? <X className="h-6 w-6" /> : <Menu className="h-6 w-6" />}
                    </button>

                    {/* DROPDOWN MOBILE */}
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
                            <div className="flex items-center gap-3 pb-4 border-b border-black/10">
                                <CircleUserIcon className="h-12 w-12 text-[#044710]" />
                                <div className="min-w-0">
                                    <p className="m-0 text-[#044710] font-medium truncate">
                                        Gabriel Athayde Gabriel de Inada
                                    </p>
                                    <span className="mt-2 inline-flex w-fit rounded-[0.8rem] bg-[#044710] px-3 py-1 text-sm text-white opacity-80">
                    Admin
                  </span>
                                </div>
                            </div>

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

                {/* HR APENAS NO PC (lg+) */}
                <hr className="hidden lg:block border-t-2 border-black/30" />

            </ContainerHeader>
        </header>
    );
}
