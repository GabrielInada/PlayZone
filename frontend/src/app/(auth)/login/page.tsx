'use client';
import Image from "next/image";
import Link from "next/link";
import { useState } from "react";
import { Input } from "@/components/Input";
import { useRouter } from "next/navigation";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { loginSchema } from "@/lib/validations";

// 1. Ajuste nomes para 'email' e 'password' para bater com o Zod
type LoginField = {
  name: 'email' | 'password';
  label: string;
  type: string;
  placeholder: string;
};

const LOGIN_FIELDS: LoginField[] = [
  { name: 'email', label: 'Email:', type: 'email', placeholder: 'Digite seu email' },
  { name: 'password', label: 'Senha:', type: 'password', placeholder: 'Digite sua senha' },
];

export default function LoginPage() {
  const router = useRouter();
  const [isLoading, setIsLoading] = useState(false);

  // 2. Configuração do Hook Form
  const { 
    register, 
    handleSubmit, 
    formState: { errors } 
  } = useForm({
    resolver: zodResolver(loginSchema),
    defaultValues: {
      email: '',
      password: ''
    }
  });

  const onSubmit = async (data: any) => {
  setIsLoading(true);
  
  // Log para verificar se o Zod capturou os dados corretamente
  console.log("Tentativa de Login com:", data);

  // Simulação de autenticação no backend
  setTimeout(() => {
    setIsLoading(false);

    //Sucesso se os dados passarem pela validação do Zod
    // No futuro, aqui você verificará se a resposta do fetch foi 'ok'
    alert("Login realizado com sucesso! Bem-vindo ao UFRA PlayZone.");
    
    router.push('/home'); 
  }, 1500);
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
                {...register(field.name)} // Conecta ao Zod
                label={field.label}
                type={field.type}
                placeholder={field.placeholder}
              />
              {/* Exibição das mensagens de erro do Zod */}
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
            className="w-full bg-[#004a1b] text-white py-2 rounded-md font-bold hover:bg-green-800 transition-all disabled:bg-gray-400 mt-2"
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