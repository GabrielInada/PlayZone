import { HOME_ROUTE } from "@/constants/routes";
import { redirect } from "next/navigation";

export default async function HomePage() {
  redirect(HOME_ROUTE);
}
