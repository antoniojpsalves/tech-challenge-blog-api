import { createZodDto } from '@anatine/zod-nestjs';
import { z } from 'zod';
import { PaginationQuerySchema } from 'src/common/dto/pagination-query.dto';

export const UsersQuerySchema = PaginationQuerySchema.extend({
  role: z.enum(['PROFESSOR', 'ALUNO']).optional(),
});

export class UsersQueryDto extends createZodDto(UsersQuerySchema) {}
