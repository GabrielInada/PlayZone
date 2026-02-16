import { ReactNode } from "react";

type IconTone = "success" | "neutral";

type Props = {
    title: string;
    value: number | string;
    icon: ReactNode;
    iconTone?: IconTone;
};

export default function StatCard({ title, value, icon, iconTone = "neutral" }: Props) {
    const toneClass =
        iconTone === "success"
            ? "bg-emerald-50 text-emerald-700"
            : "bg-gray-100 text-gray-700";

    return (
        <div className="rounded-xl border border-gray-200 bg-white px-4 py-4 shadow-sm">
            <div className="flex items-center justify-between gap-3">
                <div>
                    <p className="text-sm font-medium text-gray-600">{title}</p>
                    <p className="mt-1 text-2xl font-bold text-gray-900">{value}</p>
                </div>

                <div className={`flex h-11 w-11 items-center justify-center rounded-lg ${toneClass}`}>
                    {icon}
                </div>
            </div>
        </div>
    );
}
