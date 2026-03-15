import { Injectable } from '@nestjs/common';
import { PrismaService } from '../prisma/prisma.service';
import { CreatePostDto } from './dto/create-post.dto';
import type { UpdatePostDto } from './dto/update-post.dto';

@Injectable()
export class PostsService {
  constructor(private prisma: PrismaService) {}

  // POST /posts: Rota para criar um novo post
  async create(data: CreatePostDto, authorId: string) {
    return await this.prisma.post.create({
      data: {
        ...data,
        authorId: authorId,
      },
    });
  }

  // GET /posts: Rota para listar todos os posts
  async findAll() {
    return await this.prisma.post.findMany({
      orderBy: { createdAt: 'desc' },
    });
  }

  // GET /posts/:id: Rota para obter um post específico por ID
  async findOne(id: string) {
    return await this.prisma.post.findUnique({
      where: { id },
    });
  }

  // GET /posts ?query: Rota para buscar posts por título ou conteúdo
  async search(query: string) {
    return await this.prisma.post.findMany({
      where: {
        OR: [
          { title: { contains: query, mode: 'insensitive' } },
          { content: { contains: query, mode: 'insensitive' } },
        ],
      },
    });
  }

  // PUT /posts/:id: Rota para atualizar um post existente
  async update(id: string, data: UpdatePostDto) {
    return await this.prisma.post.update({
      where: { id },
      data,
    });
  }

  // DELETE /posts/:id: Rota para excluir um post
  async remove(id: string) {
    return await this.prisma.post.delete({
      where: { id },
    });
  }
}
