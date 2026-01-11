import { z } from "zod";

// Validação de Login
export const loginSchema = z.object({
  email: z.string().email("E-mail inválido"),
  password: z.string().min(6, "A senha deve ter no mínimo 6 caracteres"),
});

// Validação de Cadastro (Sem CPF, com Perfil)
export const signupSchema = z.object({
  name: z.string().min(3, "Nome muito curto"),
  email: z.string().email("E-mail inválido"),
  perfil: z.string().min(1, "Selecione um perfil"), // Campo obrigatório
  password: z.string().min(6, "Senha curta"),
  confirmPassword: z.string()
}).refine((data) => data.password === data.confirmPassword, {
  message: "Senhas diferentes",
  path: ["confirmPassword"]
});