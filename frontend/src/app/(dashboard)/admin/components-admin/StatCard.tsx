import { ReactNode } from "react";

type Props = {
    title: string;
    value: number | string;
    icon: ReactNode;
};

export default function StatCard({ title, value, icon }: Props) {
    return (
        <div className="bg-white border border-gray-100 rounded-xl p-5 shadow-md hover:border-emerald-200 transition-colors">
            <div className="flex items-center justify-between gap-3">
                <div>
                    <p className="text-[12px] font-medium text-gray-600">{title}</p>
                    <p className="mt-1 px-2 text-2xl font-bold text-gray-900">{value}</p>
                </div>

                <div className="flex h-11 w-11 items-center justify-center rounded-lg text-emerald-700">
                    {icon}
                </div>
            </div>
        </div>
    );
}
