'use client';
import { useState } from 'react';
import Image from 'next/image';
import Link from 'next/link';
import { Input } from '@/components/Input'; // Se o @ continuar vermelho, use '../../components/Input'

// 1. Definição dinâmica dos campos para evitar HTML repetido
type LoginField = {
  name: 'email' | 'senha';
  label: string;
  type: string;
  placeholder: string;
};

const LOGIN_FIELDS: LoginField[] = [
  { name: 'email', label: 'Email:', type: 'email', placeholder: 'Digite seu email' },
  { name: 'senha', label: 'Senha:', type: 'password', placeholder: 'Digite sua senha' },
];

export default function LoginPage() {
  // 2. Estado dinâmico para capturar os dados
  const [formData, setFormData] = useState({ email: '', senha: '' });
  const [isLoading, setIsLoading] = useState(false);

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;
    setFormData(prev => ({ ...prev, [name]: value }));
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsLoading(true);

    // Simulação de autenticação profissional
    console.log("Enviando para o Backend:", formData);
    
    setTimeout(() => {
      setIsLoading(false);
      alert("Login realizado com sucesso (Simulação)");
    }, 1500);
  };

  return (
    <main className="min-h-screen bg-gray-100 flex flex-col items-center justify-center p-4">
      <div className="bg-white p-8 rounded-xl shadow-lg border border-gray-300 w-full max-w-md">
        {/* Centralização da logo com Tailwind */}
        <Image 
          src="/file.svg" 
          alt="Logo UFRA PlayZone" 
          width={150} 
          height={150} 
          className="mx-auto mb-6"
          priority 
        />
        
        <p className="text-sm text-gray-600 mb-6 text-center">
          Entre com suas credenciais para acessar o sistema
        </p>
        
        <form onSubmit={handleSubmit} className="space-y-4">
          {/* Mapeamento dinâmico dos inputs */}
          {LOGIN_FIELDS.map((field) => (
            <Input
              key={field.name}
              name={field.name}
              label={field.label}
              type={field.type}
              placeholder={field.placeholder}
              value={formData[field.name]}
              onChange={handleChange}
              required
            />
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

      {/* Footer fixo com o verde oficial da UFRA */}
      <footer className="w-full h-10 bg-[#004a1b] fixed bottom-0 left-0" />
    </main>
  );
}