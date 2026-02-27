import {LOGIN_ROUTE} from "@/constants/routes";
import { redirect } from "next/navigation";

export default async function HomePage() {
  redirect(LOGIN_ROUTE);
  return null;
}