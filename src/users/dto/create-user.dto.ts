import { createZodDto } from '@anatine/zod-nestjs';
import { z } from 'zod';

export const CreateUserSchema = z.object({
  name: z.string().min(3, 'O nome deve conter pelo menos 3 caracteres'),
  email: z.string().email('Email inválido'),
  password: z.string().min(6, 'A senha deve conter pelo menos 6 caracteres'),
  role: z.enum(['PROFESSOR', 'ALUNO']).default('ALUNO'),
});

export class CreateUserDto extends createZodDto(CreateUserSchema) {}
