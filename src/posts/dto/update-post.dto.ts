import { createZodDto } from '@anatine/zod-nestjs';
import { CreatePostDtoSchema } from './create-post.dto';

export const UpdatePostDtoSchema = CreatePostDtoSchema.partial();

export class UpdatePostDto extends createZodDto(UpdatePostDtoSchema) {}
