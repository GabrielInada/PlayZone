"use client";
import Link from "next/link";
import { AlertTriangle } from "lucide-react";

type Props = {
    title: string;
    highlight: string;
    description?: string;
    href: string; // <- agora é link
};

export default function AlertBanner({ title, highlight, description, href }: Props) {
    return (
        <Link
            href={href}
            className={[
                "rounded-md bg-red-700 text-white",
                "px-4 py-4 sm:px-5",
                "flex items-center justify-between gap-4",
                "cursor-pointer hover:bg-red-800 transition-colors",
            ].join(" ")}
            aria-label={`Abrir: ${highlight}`}
        >
            <div className="min-w-0 p-1">
                <p className="text-[11px] font-semibold tracking-wide opacity-95">{title}</p>
                <p className="mt-0.5 text-xl md:text-2xl font-bold leading-tight">{highlight}</p>
                {description ? <p className="mt-1 text-sm opacity-90">{description}</p> : null}
            </div>

            <div className="flex h-12 w-12 items-center justify-center rounded-xl border border-white/35 bg-white/10">
                <AlertTriangle className="h-6 w-6" />
            </div>
        </Link>
    );
}
