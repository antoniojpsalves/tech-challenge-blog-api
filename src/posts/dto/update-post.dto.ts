import { createZodDto } from '@anatine/zod-nestjs';
import { CreatePostDtoSchema } from './create-post.dto';

export const UpdatePostSchema = CreatePostDtoSchema.partial();

export class UpdatePostDto extends createZodDto(UpdatePostSchema) {}
