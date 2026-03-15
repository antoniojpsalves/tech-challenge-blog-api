import { ConflictException } from '@nestjs/common';
import * as bcrypt from 'bcrypt';
import { PrismaService } from '../prisma/prisma.service';
import { UsersService } from './users.service';

jest.mock('bcrypt', () => ({
  hash: jest.fn(),
}));

describe('UsersService', () => {
  let service: UsersService;

  const prismaMock = {
    user: {
      findUnique: jest.fn(),
      create: jest.fn(),
      findMany: jest.fn(),
    },
  };

  beforeEach(() => {
    jest.clearAllMocks();
    service = new UsersService(prismaMock as unknown as PrismaService);
  });

  describe('createUser', () => {
    const dto = {
      email: 'test@email.com',
      password: '123456',
      name: 'Test User',
      role: 'ALUNO' as const,
    };

    it('should throw ConflictException if email already exists', async () => {
      prismaMock.user.findUnique.mockResolvedValue({ id: 'user-1', ...dto });

      await expect(service.createUser(dto)).rejects.toThrow(
        new ConflictException('Email já cadastrado'),
      );
    });

    it('should create user with hashed password and default role', async () => {
      prismaMock.user.findUnique.mockResolvedValue(null);
      (bcrypt.hash as jest.Mock).mockResolvedValue('hashed_password');

      const created = {
        id: 'user-1',
        email: dto.email,
        name: dto.name,
        role: 'ALUNO',
      };
      prismaMock.user.create.mockResolvedValue(created);

      const result = await service.createUser({
        ...dto,
        role: undefined as any,
      });

      expect(bcrypt.hash).toHaveBeenCalledWith(dto.password, 10);
      expect(prismaMock.user.create).toHaveBeenCalledWith({
        data: {
          email: dto.email,
          password: 'hashed_password',
          name: dto.name,
          role: 'ALUNO',
        },
        select: { id: true, email: true, name: true, role: true },
      });
      expect(result).toEqual(created);
    });

    it('should create user with provided role', async () => {
      prismaMock.user.findUnique.mockResolvedValue(null);
      (bcrypt.hash as jest.Mock).mockResolvedValue('hashed_password');

      const created = {
        id: 'user-1',
        email: dto.email,
        name: dto.name,
        role: 'PROFESSOR',
      };
      prismaMock.user.create.mockResolvedValue(created);

      const result = await service.createUser({
        ...dto,
        role: 'PROFESSOR' as any,
      });

      expect(prismaMock.user.create).toHaveBeenCalledWith({
        data: {
          email: dto.email,
          password: 'hashed_password',
          name: dto.name,
          role: 'PROFESSOR',
        },
        select: { id: true, email: true, name: true, role: true },
      });
      expect(result).toEqual(created);
    });
  });

  describe('findByEmail', () => {
    it('should throw ConflictException if user is not found', async () => {
      prismaMock.user.findUnique.mockResolvedValue(null);

      await expect(service.findByEmail('notfound@email.com')).rejects.toThrow(
        new ConflictException('Usuário não encontrado'),
      );
    });

    it('should return user when found', async () => {
      const user = {
        id: 'user-1',
        email: 'test@email.com',
        name: 'Test',
        role: 'ALUNO',
      };
      prismaMock.user.findUnique.mockResolvedValue(user);

      const result = await service.findByEmail('test@email.com');

      expect(prismaMock.user.findUnique).toHaveBeenCalledWith({
        where: { email: 'test@email.com' },
      });
      expect(result).toEqual(user);
    });
  });

  describe('findById', () => {
    it('should throw ConflictException if user is not found', async () => {
      prismaMock.user.findUnique.mockResolvedValue(null);

      await expect(service.findById('missing-id')).rejects.toThrow(
        new ConflictException('Usuário não encontrado'),
      );
    });

    it('should return user when found', async () => {
      const user = {
        id: 'user-1',
        email: 'test@email.com',
        name: 'Test',
        role: 'ALUNO',
      };
      prismaMock.user.findUnique.mockResolvedValue(user);

      const result = await service.findById('user-1');

      expect(prismaMock.user.findUnique).toHaveBeenCalledWith({
        where: { id: 'user-1' },
      });
      expect(result).toEqual(user);
    });
  });

  describe('findAll', () => {
    it('should return all users without password', async () => {
      const users = [
        { id: 'user-1', email: 'a@email.com', name: 'User A', role: 'ALUNO' },
        {
          id: 'user-2',
          email: 'b@email.com',
          name: 'User B',
          role: 'PROFESSOR',
        },
      ];
      prismaMock.user.findMany.mockResolvedValue(users);

      const result = await service.findAll();

      expect(prismaMock.user.findMany).toHaveBeenCalledWith({
        select: { id: true, email: true, name: true, role: true },
      });
      expect(result).toEqual(users);
    });

    it('should return empty array when no users exist', async () => {
      prismaMock.user.findMany.mockResolvedValue([]);

      const result = await service.findAll();

      expect(result).toEqual([]);
    });
  });
});
