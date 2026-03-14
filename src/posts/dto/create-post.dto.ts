import { createZodDto } from '@anatine/zod-nestjs';
import { z } from 'zod';

export const CreatePostDtoSchema = z.object({
  title: z.string().min(5, 'O título deve conter no mínimo 5 caracteres'),
  content: z.string().min(10, 'O conteúdo deve ser mais detalhado'),
  author: z.string().min(3, 'O nome do autor é obrigatório'),
});

export class CreatePostDto extends createZodDto(CreatePostDtoSchema) {}
