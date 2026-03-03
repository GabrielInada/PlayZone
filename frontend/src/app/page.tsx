import { HOME_ROUTE, LOGIN_ROUTE } from "@/constants/routes";
import { cookies } from "next/headers";
import { redirect } from "next/navigation";

export default async function RootPage() {
  const cookieStore = await cookies();
  const token    = cookieStore.get("auth-token")?.value;
  const userType = cookieStore.get("user-type")?.value;

  // Não autenticado → login
  if (!token) redirect(LOGIN_ROUTE);

  // Redireciona conforme o type do usuário
  redirect(HOME_ROUTE);
  
}