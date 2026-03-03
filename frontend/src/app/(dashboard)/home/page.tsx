"use client";
import { useEffect } from "react";
import { useRouter } from "next/navigation";
import { useAuth } from "@/context/AuthContext";

const DASHBOARD_BY_TYPE: Record<string, string> = {
  clube:    "/clube",
  delegado: "/delegado",
  admin:    "/admin/home-admin",
};

export default function HomePage() {
  const router = useRouter();
  const { user, isLoading } = useAuth();

  useEffect(() => {
    if (isLoading) return;
    const dest = user?.type ? (DASHBOARD_BY_TYPE[user.type] ?? "/login") : "/login";
    router.replace(dest);
  }, [user, isLoading, router]);

  return null;
}