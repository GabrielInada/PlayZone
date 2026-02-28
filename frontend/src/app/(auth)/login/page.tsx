'use client';
import Image from "next/image";
import Link from "next/link";
import { useState } from "react";
import { Input } from "@/components/Input";
import { useRouter } from "next/navigation";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { loginSchema } from "@/lib/validations";
import toast from 'react-hot-toast';

// ── Constantes ────────────────────────────────────────────────────────────────
const API_URL = process.env.NEXT_PUBLIC_API_URL ?? "https://play-zone-omega.vercel.app";

// Mapa de redirecionamento por tipo de usuário
// Ajuste as rotas conforme as roles do seu projeto
const REDIRECT_BY_TYPE: Record<string, string> = {
  admin:    "/admin",
  delegado: "/delegado",
  clube:    "/clube",
};
const DEFAULT_REDIRECT = "/home";

// ── Campos do formulário ──────────────────────────────────────────────────────
type LoginField = {
  name: 'email' | 'password';
  label: string;
  type: string;
  placeholder: string;
};

const LOGIN_FIELDS: LoginField[] = [
  { name: 'email',    label: 'Email:',  type: 'email',    placeholder: 'Digite seu email' },
  { name: 'password', label: 'Senha:',  type: 'password', placeholder: 'Digite sua senha' },
];

// ── Página ────────────────────────────────────────────────────────────────────
export default function LoginPage() {
  const router = useRouter();
  const [isLoading, setIsLoading] = useState(false);

  const { register, handleSubmit, formState: { errors } } = useForm({
    resolver: zodResolver(loginSchema),
    defaultValues: { email: '', password: '' },
  });

  const onSubmit = async (data: any) => {
    setIsLoading(true);
    try {
      // 1. POST /auth/login — autentica e recebe o JWT
      const loginRes = await fetch(`${API_URL}/auth/login`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ email: data.email, password: data.password }),
      });

      if (!loginRes.ok) {
        // 401 — Credenciais inválidas
        toast.error("Email ou senha incorretos.", {
          position: 'bottom-right',
          style: { borderRadius: '8px', fontFamily: 'Roboto, sans-serif' },
        });
        return;
      }

      const { token } = await loginRes.json();

      // 2. Salva o JWT no localStorage para uso nas próximas requisições
      localStorage.setItem("token", token);

      // 3. GET /auth/profile — busca tipo do usuário para redirecionar corretamente
      const profileRes = await fetch(`${API_URL}/auth/profile`, {
        headers: { Authorization: `Bearer ${token}` },
      });

      if (!profileRes.ok) {
        // Mesmo sem o perfil, o login foi válido — redireciona para home padrão
        router.push(DEFAULT_REDIRECT);
        return;
      }

      const profile = await profileRes.json();

      toast.success("Login realizado com sucesso!", {
        position: 'bottom-right',
        style: {
          borderRadius: '8px',
          background: '#004a1b',
          color: '#fff',
          fontFamily: 'Roboto, sans-serif',
        },
      });

      // 4. Redireciona conforme o tipo do usuário (type vindo do perfil)
      const destination = REDIRECT_BY_TYPE[profile.type] ?? DEFAULT_REDIRECT;
      router.push(destination);

    } catch (err) {
      console.error("Erro no login:", err);
      toast.error("Erro ao conectar com o servidor. Tente novamente.", {
        position: 'bottom-right',
        style: { borderRadius: '8px', fontFamily: 'Roboto, sans-serif' },
      });
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <main className="min-h-screen bg-gray-100 flex flex-col items-center justify-center p-4">
      <div className="bg-white p-8 rounded-xl shadow-lg border border-gray-300 w-full max-w-md">
        <Image
          src="/logo_ufraPlayZone.png"
          alt="Logo UFRA PlayZone"
          width={150}
          height={150}
          className="mx-auto mb-6"
          priority
        />

        <p className="text-sm text-gray-600 mb-6 text-center">
          Entre com suas credenciais para acessar o sistema
        </p>

        <form onSubmit={handleSubmit(onSubmit)} className="space-y-4">
          {LOGIN_FIELDS.map((field) => (
            <div key={field.name} className="flex flex-col">
              <Input
                {...register(field.name)}
                label={field.label}
                type={field.type}
                placeholder={field.placeholder}
              />
              {errors[field.name] && (
                <span className="text-red-600 text-xs mt-1 font-bold uppercase">
                  {errors[field.name]?.message as string}
                </span>
              )}
            </div>
          ))}

          <button
            type="submit"
            disabled={isLoading}
            className="w-full bg-[#004a1b] text-white py-2 rounded-md font-bold hover:bg-green-800 transition-all disabled:bg-gray-400 mt-2 cursor-pointer"
          >
            {isLoading ? 'Autenticando...' : 'Login'}
          </button>
        </form>

        <p className="mt-6 text-sm text-gray-600 text-center italic">
          Não tem uma conta?{" "}
          <Link href="/cadastro" className="text-blue-600 font-semibold hover:underline">
            Inscreva-se
          </Link>
        </p>
      </div>

      <footer className="w-full h-10 bg-[#004a1b] fixed bottom-0 left-0" />
    </main>
  );
}