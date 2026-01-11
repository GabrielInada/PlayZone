'use client';
import { useState } from 'react';
import Image from 'next/image';
import { Input } from '../../components/Input';
import Link from 'next/link';

// Tipagem rigorosa para os campos do formulário
type FormField = {
  name: 'nome' | 'email' | 'senha' | 'confirmarSenha';
  label: string;
  type: string;
  placeholder: string;
};

const REGISTER_FIELDS: FormField[] = [
  { name: 'nome', label: 'Nome Completo:', type: 'text', placeholder: 'Digite seu nome' },
  { name: 'email', label: 'Email:', type: 'email', placeholder: 'Digite seu email' },
  { name: 'senha', label: 'Senha:', type: 'password', placeholder: 'Digite sua senha' },
  { name: 'confirmarSenha', label: 'Confirmar Senha:', type: 'password', placeholder: 'Confirme sua senha' },
];

export default function RegisterPage() {
  const [formData, setFormData] = useState<Record<string, string>>({
    nome: '', email: '', senha: '', confirmarSenha: '', perfil: 'delegado'
  });

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>) => {
    const { name, value } = e.target;
    setFormData(prev => ({ ...prev, [name]: value }));
  };

  return (
    <main className="min-h-screen bg-gray-100 flex flex-col items-center justify-center p-4">
      <div className="bg-white p-8 rounded-xl shadow-lg border border-gray-300 w-full max-w-md">
        <Image src="/file.svg" alt="Logo" width={150} height={150} className="mx-auto mb-6" />
        
        <p className="text-sm text-gray-600 mb-6 text-center">
          Faça seu cadastro para acessar o sistema
        </p>
        
        <form className="space-y-4" onSubmit={(e) => e.preventDefault()}>
          {/* Mapeamento dinâmico: Menos HTML, mais lógica React */}
          {REGISTER_FIELDS.map((field) => (
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

          <div className="flex flex-col gap-1">
            <label className="text-sm font-bold text-gray-700">Selecione Seu Perfil:</label>
            <select 
              name="perfil"
              onChange={handleChange}
              className="p-2 border border-gray-300 rounded-md bg-gray-200 outline-none cursor-pointer"
            >
              <option value="delegado">Delegado da partida</option>
              <option value="jogador">Jogador</option>
              <option value="jogador">Administrador</option>
            </select>
          </div>

          <button type="submit" className="w-full bg-green-700 text-white py-2 rounded-md font-bold hover:bg-green-800 transition-all">
            Solicitar Acesso
          </button>
        </form>
        <p className="mt-4 text-sm text-gray-600 text-center italic">
          Já tem uma conta?{" "}
          <Link href="/login" className="text-blue-600 font-semibold hover:underline transition-all">
            Entrar
          </Link>
        </p>
      </div>
      <footer className="w-full h-10 bg-green-900 fixed bottom-0" />
    </main>
  );
}