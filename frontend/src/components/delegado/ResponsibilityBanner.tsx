import Link from "next/link";
import { ReactNode } from "react";

type Props = {
    eyebrow: string;
    highlight: string;
    description?: string;
    icon?: ReactNode;
    href: string;
};

export default function ResponsibilityBanner({
                                                 eyebrow,
                                                 highlight,
                                                 description,
                                                 icon,
                                                 href,
                                             }: Props) {
    return (
        <Link
            href={href}
            className={[
                "rounded-xl bg-sky-600 text-white",
                "px-4 py-4 sm:px-5",
                "flex items-center justify-between gap-4",
                "cursor-pointer hover:bg-sky-700 transition-colors",
            ].join(" ")}
            aria-label={`Abrir: ${highlight}`}
        >
            <div className="min-w-0">
                <p className="text-[11px] font-semibold tracking-wide opacity-95">
                    {eyebrow}
                </p>
                <p className="mt-0.5 text-xl font-bold leading-tight">{highlight}</p>
                {description ? <p className="mt-1 text-sm opacity-90">{description}</p> : null}
            </div>

            <div className="flex h-12 w-12 items-center justify-center rounded-xl border border-white/35 bg-white/10">
                {icon}
            </div>
        </Link>
    );
}
