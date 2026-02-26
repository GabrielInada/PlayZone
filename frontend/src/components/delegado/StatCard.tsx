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
        <div className="bg-white border border-gray-100 rounded-xl p-5 shadow-md hover:border-emerald-200 transition-colors">
            <div className="flex items-center justify-between gap-3">
                <div>
                    <p className="text-[12px] font-medium text-gray-600">{title}</p>
                    <p className="mt-1 px-2 text-3xl font-bold text-gray-900">{value}</p>
                </div>

                <div className={`flex h-11 w-11 items-center justify-center rounded-lg ${toneClass}`}>
                    {icon}
                </div>
            </div>
        </div>
    );
}
