import { Injectable } from '@nestjs/common';
import { PrismaService } from '../prisma/prisma.service';
import { CreatePostDto } from './dto/create-post.dto';

@Injectable()
export class PostsService {
  constructor(private prisma: PrismaService) {}

  // POST /posts: Rota para criar um novo post
  async create(data: CreatePostDto) {
    return await this.prisma.post.create({
      data: {
        ...data,
        authorId: 'temp-author-id',
      },
    });
  }

  // GET /posts: Rota para listar todos os posts
  async findAll() {
    return await this.prisma.post.findMany({
      orderBy: { createdAt: 'desc' },
    });
  }
}
