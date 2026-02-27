"use client";
import { useRouter } from "next/navigation";
import { ShieldCheck, Users, Building2 } from "lucide-react";
import { ADMIN_ROUTE, DELEGADO_ROUTE, CLUBE_ROUTE } from "@/constants/routes";

const ACTORS = [
  {
    label: "Admin",
    description: "Gerenciamento geral do sistema",
    href: ADMIN_ROUTE,
    icon: ShieldCheck,
  },
  {
    label: "Delegado",
    description: "Gestão de campeonatos e partidas",
    href: DELEGADO_ROUTE,
    icon: Users,
  },
  {
    label: "Clube",
    description: "Painel do clube e elenco",
    href: CLUBE_ROUTE,
    icon: Building2,
  },
];

export default function Home() {
  const router = useRouter();

  return (
    <div className="flex items-center justify-center bg-white font-sans p-4 mt-20">
      <div className="w-full max-w-md space-y-6">

        <div className="text-center space-y-1">
          <h1 className="text-2xl font-bold text-gray-800">Entrar como</h1>
          <p className="text-sm text-gray-500">Selecione o perfil para teste</p>
        </div>

        <div className="space-y-3">
          {ACTORS.map(({ label, description, href, icon: Icon }) => (
            <button
              key={href}
              onClick={() => router.push(href)}
              className="w-full flex items-center gap-4 bg-white border border-gray-200 rounded-xl p-4 shadow-sm hover:border-emerald-400 hover:shadow-md transition-all cursor-pointer group"
            >
              <div className="shrink-0 flex items-center justify-center w-10 h-10 rounded-lg bg-emerald-50 group-hover:bg-emerald-100 transition-colors">
                <Icon className="w-5 h-5 text-[#1b6928]" />
              </div>
              <div className="text-left">
                <p className="font-bold text-gray-800 text-sm">{label}</p>
                <p className="text-xs text-gray-500">{description}</p>
              </div>
            </button>
          ))}
        </div>

      </div>
    </div>
  );
}