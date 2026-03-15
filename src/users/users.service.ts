import { ConflictException, Injectable } from '@nestjs/common';
import * as bcrypt from 'bcrypt';
import { PrismaService } from 'src/prisma/prisma.service';
import type { CreateUserDto } from './dto/create-user.dto';

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
      select: { id: true, email: true, name: true, role: true },
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

  async findAll() {
    return await this.prisma.user.findMany({
      select: { id: true, email: true, name: true, role: true },
    });
  }
}
