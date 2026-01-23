'use client';
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { signupSchema } from "@/lib/validations";
import { Input } from "@/components/Input";
import { useState } from "react";
import { useRouter } from "next/navigation";
import Image from "next/image";
import Link from "next/link";

const SIGNUP_FIELDS = [
  { name: 'name', label: 'Nome Completo:', type: 'text', placeholder: 'Seu nome' },
  { name: 'email', label: 'Email:', type: 'email', placeholder: 'seu@email.com' },
  { name: 'password', label: 'Senha:', type: 'password', placeholder: 'Crie uma senha' },
  { name: 'confirmPassword', label: 'Confirmar Senha:', type: 'password', placeholder: 'Repita a senha' },
] as const;

export default function SignupPage() {
  const router = useRouter();
  const [isLoading, setIsLoading] = useState(false);
  const [perfilSelecionado, setPerfilSelecionado] = useState(""); // Estado para controlar a cor

  const { register, handleSubmit, formState: { errors } } = useForm({
    resolver: zodResolver(signupSchema)
  });

  const onSubmit = async (data: any) => {
  setIsLoading(true);
  
  // 1. Simulação Dados Mockados
  console.log("Dados recebidos do formulário:", data);

  // 2. Simulação de processamento (delay de rede)
  setTimeout(() => {
    setIsLoading(false);

    // 3. Teste de Lógica: Sucesso apenas se o nome for "Teste"
    if (data.name === "Teste") {
      alert("Usuário validado com sucesso!");
      router.push('/login'); 
    } else {
      alert("Erro simulado! Tente usar o nome 'Teste' para passar.");
    }
  }, 1500);
};

  return (
    <main className="min-h-screen bg-gray-100 flex flex-col items-center justify-center p-4">
      <div className="bg-white p-8 rounded-xl shadow-lg border border-gray-300 w-full max-w-md">
        <Image src="/logo_ufraPlayZone.png" alt="Logo UFRA" width={120} height={120} className="mx-auto mb-4" />
        
        <p className="text-sm text-gray-600 mb-6 text-center">
          Cadastre suas credenciais para acessar o sistema
        </p>
        
        <form onSubmit={handleSubmit(onSubmit)} className="space-y-3">
          {/* 1. Inputs de Texto normais */}
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

          {/* 2. Seleção de Perfil EM ÚLTIMO */}
          <div className="flex flex-col gap-1 w-full">
            <label className="text-sm font-bold text-gray-700">Selecione Seu Perfil:</label>
            <select 
            {...register("perfil", { 
              onChange: (e) => setPerfilSelecionado(e.target.value)
            })}
            className={`p-2 border border-[#004a1b] rounded-md bg-[#E8E8E8] outline-none focus:ring-2 focus:ring-green-600 transition-all ${
              perfilSelecionado === "" ? "text-gray-500" : "text-black"
            }`}
          >
            <option value="">Escolha uma opção</option>
            <option value="jogador">Jogador</option>
            <option value="delegado">Delegado da partida</option>
            <option value="admin">Administrador</option>
          </select>
            {errors.perfil && (
              <span className="text-red-600 text-[10px] font-bold uppercase mt-1">
                {errors.perfil.message as string}
              </span>
            )}
          </div>
          
          <button 
            type="submit" 
            disabled={isLoading}
            className="w-full bg-[#004a1b] text-white py-2 rounded-md font-bold mt-4 hover:bg-green-800 disabled:bg-gray-400"
          >
            {isLoading ? "Processando..." : "Finalizar Cadastro"}
          </button>
        </form>

        <p className="mt-6 text-sm text-gray-600 text-center italic">
          Já tem uma conta? <Link href="/login" className="text-blue-600 font-semibold hover:underline">Entre aqui</Link>
        </p>
      </div>
      <footer className="w-full h-10 bg-[#004a1b] fixed bottom-0 left-0" />
    </main>
  );
}