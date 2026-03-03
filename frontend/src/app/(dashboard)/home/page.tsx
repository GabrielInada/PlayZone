"use client";
import { useEffect } from "react";
import { useRouter } from "next/navigation";
import { useAuth } from "@/context/AuthContext";

const DASHBOARD_BY_TYPE: Record<string, string> = {
  clube:    "/clube",
  delegado: "/delegado",
  admin:    "/admin",
};

export default function HomePage() {
  const router = useRouter();
  const { user, isLoading } = useAuth();

  useEffect(() => {
    if (isLoading) return; // aguarda AuthContext terminar
    const dest = user?.type
      ? (DASHBOARD_BY_TYPE[user.type] ?? "/login")
      : "/login";
    router.replace(dest);
  }, [user, isLoading, router]);

  // Spinner mantém a página ocupada até o redirect disparar
  // Evita o flash de tela vazia que confunde o roteador dinâmico [nome]
  return (
    <div className="flex items-center justify-center min-h-screen bg-white">
      <div className="animate-spin rounded-full h-10 w-10 border-b-2 border-[#007a33]" />
    </div>
  );
}