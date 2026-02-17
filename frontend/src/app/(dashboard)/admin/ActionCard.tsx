"use client";
import Link from "next/link";

type Props = {
    title: string;
    description: string;
    href: string;
};

export default function ActionCard({ title, description, href }: Props) {
    return (
        <Link
            href={href}
            className={[
                "block rounded-xl px-5 py-5 bg-white border border-gray-100 rounded-md p-4 shadow-lg hover:border-emerald-200 transition-colors",
                "text-left cursor-pointer ",
            ].join(" ")}
            aria-label={`Abrir: ${title}`}
        >
            <p className="text-base font-semibold text-gray-900">{title}</p>
            <p className="mt-1 text-sm text-gray-600">{description}</p>
        </Link>
    );
}
