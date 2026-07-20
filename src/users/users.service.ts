import {
  ConflictException,
  Injectable,
  NotFoundException,
} from '@nestjs/common';
import * as bcrypt from 'bcrypt';
import { PrismaService } from 'src/prisma/prisma.service';
import { paginate } from 'src/common/pagination';
import type { CreateUserDto } from './dto/create-user.dto';
import type { UpdateUserDto } from './dto/update-user.dto';

const USER_SELECT = { id: true, email: true, name: true, role: true } as const;

@Injectable()
export class UsersService {
  constructor(private prisma: PrismaService) {}

  async createUser(data: CreateUserDto) {
    const { email, password, name, role } = data;

    const userExists = await this.prisma.user.findUnique({ where: { email } });
    if (userExists) throw new ConflictException('Email já cadastrado');

    const hashedPassword = await bcrypt.hash(password, 10);

    return await this.prisma.user.create({
      data: {
        email,
        password: hashedPassword,
        name,
        role: role || 'ALUNO',
      },
      select: USER_SELECT,
    });
  }

  async findByEmail(email: string) {
    const user = await this.prisma.user.findUnique({ where: { email } });
    if (!user) {
      throw new ConflictException('Usuário não encontrado');
    }
    return user;
  }

  async findById(id: string) {
    const user = await this.prisma.user.findUnique({ where: { id } });
    if (!user) {
      throw new ConflictException('Usuário não encontrado');
    }
    return user;
  }

  async findAll(page = 1, limit = 10, role?: 'PROFESSOR' | 'ALUNO') {
    const where = role ? { role } : {};
    const skip = (page - 1) * limit;

    const [data, total] = await Promise.all([
      this.prisma.user.findMany({
        where,
        skip,
        take: limit,
        select: USER_SELECT,
      }),
      this.prisma.user.count({ where }),
    ]);

    return paginate(data, total, page, limit);
  }

  async update(id: string, data: UpdateUserDto) {
    const user = await this.prisma.user.findUnique({ where: { id } });
    if (!user) throw new NotFoundException('Usuário não encontrado');

    if (data.email && data.email !== user.email) {
      const exists = await this.prisma.user.findUnique({
        where: { email: data.email },
      });
      if (exists) throw new ConflictException('Email já cadastrado');
    }

    const patch: Record<string, unknown> = { ...data };
    if (data.password) patch.password = await bcrypt.hash(data.password, 10);

    return this.prisma.user.update({
      where: { id },
      data: patch,
      select: USER_SELECT,
    });
  }

  async remove(id: string) {
    const user = await this.prisma.user.findUnique({ where: { id } });
    if (!user) throw new NotFoundException('Usuário não encontrado');

    const postsCount = await this.prisma.post.count({
      where: { authorId: id },
    });
    if (postsCount > 0) {
      throw new ConflictException('Usuário possui posts vinculados');
    }

    return this.prisma.user.delete({ where: { id }, select: USER_SELECT });
  }
}
