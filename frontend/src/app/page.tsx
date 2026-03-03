import { cookies } from "next/headers";
import { redirect } from "next/navigation";

export default async function RootPage() {
  const cookieStore = await cookies();
  const token    = cookieStore.get("auth-token")?.value;
  const userType = cookieStore.get("user-type")?.value;

  // Não autenticado → login
  if (!token) redirect("/login");

  // Redireciona conforme o type do usuário
  switch (userType) {
    case "clube":    redirect("/home");
    case "delegado": redirect("/home");
    case "admin":    redirect("/home");
    default:         redirect("/home");
  }
}