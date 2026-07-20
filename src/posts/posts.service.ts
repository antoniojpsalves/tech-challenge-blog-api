import { Injectable } from '@nestjs/common';
import { paginate } from 'src/common/pagination';
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

  // GET /posts?page=&limit=: Rota para listar todos os posts, paginada
  async findAll(page = 1, limit = 10) {
    const skip = (page - 1) * limit;

    const [data, total] = await Promise.all([
      this.prisma.post.findMany({
        orderBy: { createdAt: 'desc' },
        skip,
        take: limit,
      }),
      this.prisma.post.count(),
    ]);

    return paginate(data, total, page, limit);
  }

  // GET /posts/:id: Rota para obter um post específico por ID
  async findOne(id: string) {
    return await this.prisma.post.findUnique({
      where: { id },
    });
  }

  // GET /posts/search?q=&page=&limit=: Rota para buscar posts por título ou conteúdo, paginada
  async search(query: string, page = 1, limit = 10) {
    const where = {
      OR: [
        { title: { contains: query, mode: 'insensitive' as const } },
        { content: { contains: query, mode: 'insensitive' as const } },
      ],
    };
    const skip = (page - 1) * limit;

    const [data, total] = await Promise.all([
      this.prisma.post.findMany({ where, skip, take: limit }),
      this.prisma.post.count({ where }),
    ]);

    return paginate(data, total, page, limit);
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
