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
                "block rounded-xl border border-gray-200 bg-white px-4 py-4 shadow-sm",
                "text-left cursor-pointer hover:shadow-md hover:border-gray-300 transition",
            ].join(" ")}
            aria-label={`Abrir: ${title}`}
        >
            <p className="text-base font-semibold text-gray-900">{title}</p>
            <p className="mt-1 text-sm text-gray-600">{description}</p>
        </Link>
    );
}
