import { z } from "zod";

// Validação de Login
export const loginSchema = z.object({
  email: z.string().email("E-mail inválido"),
  password: z.string().min(6, "A senha deve ter no mínimo 6 caracteres"),
});

// Validação de Cadastro
export const signupSchema = z.object({
  name: z.string().min(3, "Nome muito curto"),
  email: z.string().email("E-mail inválido"),
  type: z.string().min(1, "Selecione um perfil"), // era "perfil" — renomeado para bater com a API
  password: z.string().min(6, "Senha curta"),
  confirmPassword: z.string()
}).refine((data) => data.password === data.confirmPassword, {
  message: "Senhas diferentes",
  path: ["confirmPassword"]
});

// Validação de Adicionar Estádio
export const estadioSchema = z.object({
  nome: z.string().min(3, "Nome inválido"),
  capacidade: z.preprocess(
    (val) => (typeof val === 'string' ? parseInt(val.replace(/\./g, ''), 10) : val),
    z.number().min(1, "Mínimo 1 pessoa")
  ),
  localizacao: z.string().min(5, "Localização necessária"),
});

export type EstadioFormData = z.infer<typeof estadioSchema>;