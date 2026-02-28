'use client';
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { signupSchema } from "@/lib/validations";
import { Input } from "@/components/Input";
import { useState } from "react";
import { useRouter } from "next/navigation";
import Image from "next/image";
import Link from "next/link";
import toast from 'react-hot-toast';

// ── Constantes ────────────────────────────────────────────────────────────────
const API_URL = process.env.NEXT_PUBLIC_API_URL ?? "https://play-zone-omega.vercel.app";

// ── Campos de texto ───────────────────────────────────────────────────────────
const SIGNUP_FIELDS = [
  { name: 'name',            label: 'Nome Completo:', type: 'text',     placeholder: 'Seu nome' },
  { name: 'email',           label: 'Email:',          type: 'email',    placeholder: 'seu@email.com' },
  { name: 'password',        label: 'Senha:',          type: 'password', placeholder: 'Crie uma senha' },
  { name: 'confirmPassword', label: 'Confirmar Senha:',type: 'password', placeholder: 'Repita a senha' },
] as const;

// ── Tipos de usuário (campo "type" da API) ────────────────────────────────────
// POST /auth/signup espera: { name, email, password, type }
const USER_TYPES = [
  { value: "clube",    label: "Clube" },
  { value: "delegado", label: "Delegado da Partida" },
  { value: "admin",    label: "Administrador" },
];

// ── Página ────────────────────────────────────────────────────────────────────
export default function SignupPage() {
  const router = useRouter();
  const [isLoading, setIsLoading] = useState(false);
  const [typeSelecionado, setTypeSelecionado] = useState("");

  const { register, handleSubmit, formState: { errors } } = useForm({
    resolver: zodResolver(signupSchema),
  });

  const onSubmit = async (data: any) => {
    setIsLoading(true);
    try {
      // POST /auth/signup — cria novo usuário
      // O campo "type" é enviado diretamente (nome correto da API)
      const res = await fetch(`${API_URL}/auth/signup`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          name:     data.name.trim(),
          email:    data.email.trim(),
          password: data.password,
          type:     data.type, // "clube" | "delegado" | "admin"
        }),
      });

      if (res.status === 201) {
        toast.success("Cadastro realizado com sucesso!", {
          position: 'bottom-right',
          style: {
            borderRadius: '8px',
            background: '#004a1b',
            color: '#fff',
            fontFamily: 'Roboto, sans-serif',
          },
        });
        router.push('/login');
        return;
      }

      // Trata erros conhecidos da API
      const errData = await res.json().catch(() => ({}));

      if (res.status === 409) {
        toast.error("Este email já está cadastrado.", {
          position: 'bottom-right',
          style: { borderRadius: '8px', fontFamily: 'Roboto, sans-serif' },
        });
        return;
      }

      toast.error(errData?.message ?? "Erro ao criar conta. Tente novamente.", {
        position: 'bottom-right',
        style: { borderRadius: '8px', fontFamily: 'Roboto, sans-serif' },
      });

    } catch (err) {
      console.error("Erro no cadastro:", err);
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
          alt="Logo UFRA"
          width={120}
          height={120}
          className="mx-auto mb-4"
        />

        <p className="text-sm text-gray-600 mb-6 text-center">
          Cadastre suas credenciais para acessar o sistema
        </p>

        <form onSubmit={handleSubmit(onSubmit)} className="space-y-3">
          {/* Campos de texto */}
          {SIGNUP_FIELDS.map((field) => (
            <div key={field.name}>
              <Input
                {...register(field.name)}
                label={field.label}
                type={field.type}
                placeholder={field.placeholder}
              />
              {errors[field.name] && (
                <span className="text-red-600 text-[10px] font-bold uppercase mt-1">
                  {errors[field.name]?.message as string}
                </span>
              )}
            </div>
          ))}

          {/* Seleção de tipo — campo "type" enviado à API */}
          <div className="flex flex-col gap-1 w-full">
            <label className="text-sm font-bold text-gray-700">Selecione Seu Perfil:</label>
            <select
              {...register("type", {
                onChange: (e) => setTypeSelecionado(e.target.value),
              })}
              className={`p-2 border border-[#004a1b] rounded-md bg-[#E8E8E8] outline-none focus:ring-2 focus:ring-green-600 transition-all ${
                typeSelecionado === "" ? "text-gray-500" : "text-black"
              }`}
            >
              <option value="">Escolha uma opção</option>
              {USER_TYPES.map(({ value, label }) => (
                <option key={value} value={value}>{label}</option>
              ))}
            </select>
            {errors.type && (
              <span className="text-red-600 text-[10px] font-bold uppercase mt-1">
                {errors.type?.message as string}
              </span>
            )}
          </div>

          <button
            type="submit"
            disabled={isLoading}
            className="w-full bg-[#004a1b] text-white py-2 rounded-md font-bold mt-4 hover:bg-green-800 disabled:bg-gray-400 cursor-pointer transition-all"
          >
            {isLoading ? "Processando..." : "Finalizar Cadastro"}
          </button>
        </form>

        <p className="mt-6 text-sm text-gray-600 text-center italic">
          Já tem uma conta?{" "}
          <Link href="/login" className="text-blue-600 font-semibold hover:underline">
            Entre aqui
          </Link>
        </p>
      </div>

      <footer className="w-full h-10 bg-[#004a1b] fixed bottom-0 left-0" />
    </main>
  );
}