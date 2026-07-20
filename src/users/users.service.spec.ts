import { ConflictException, NotFoundException } from '@nestjs/common';
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
      count: jest.fn(),
      update: jest.fn(),
      delete: jest.fn(),
    },
    post: {
      count: jest.fn(),
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
    it('should return paginated users without password, with default page/limit', async () => {
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
      prismaMock.user.count.mockResolvedValue(2);

      const result = await service.findAll();

      expect(prismaMock.user.findMany).toHaveBeenCalledWith({
        where: {},
        skip: 0,
        take: 10,
        select: { id: true, email: true, name: true, role: true },
      });
      expect(prismaMock.user.count).toHaveBeenCalledWith({ where: {} });
      expect(result).toEqual({
        data: users,
        meta: {
          total: 2,
          page: 1,
          limit: 10,
          totalPages: 1,
          hasNextPage: false,
          hasPrevPage: false,
        },
      });
    });

    it('should filter by role when provided', async () => {
      prismaMock.user.findMany.mockResolvedValue([]);
      prismaMock.user.count.mockResolvedValue(0);

      await service.findAll(1, 10, 'PROFESSOR');

      expect(prismaMock.user.findMany).toHaveBeenCalledWith({
        where: { role: 'PROFESSOR' },
        skip: 0,
        take: 10,
        select: { id: true, email: true, name: true, role: true },
      });
      expect(prismaMock.user.count).toHaveBeenCalledWith({
        where: { role: 'PROFESSOR' },
      });
    });

    it('should return empty data array when no users exist', async () => {
      prismaMock.user.findMany.mockResolvedValue([]);
      prismaMock.user.count.mockResolvedValue(0);

      const result = await service.findAll();

      expect(result.data).toEqual([]);
    });
  });

  describe('update', () => {
    const existingUser = {
      id: 'user-1',
      email: 'old@email.com',
      name: 'Old Name',
      role: 'ALUNO',
      password: 'hashed',
    };

    it('should throw NotFoundException if user does not exist', async () => {
      prismaMock.user.findUnique.mockResolvedValue(null);

      await expect(
        service.update('missing-id', { name: 'New Name' } as any),
      ).rejects.toThrow(new NotFoundException('Usuário não encontrado'));
    });

    it('should throw ConflictException if new email is already taken', async () => {
      prismaMock.user.findUnique
        .mockResolvedValueOnce(existingUser) // findUnique by id
        .mockResolvedValueOnce({ id: 'other-user' }); // findUnique by email

      await expect(
        service.update('user-1', { email: 'taken@email.com' } as any),
      ).rejects.toThrow(new ConflictException('Email já cadastrado'));
    });

    it('should update user without touching password when not provided', async () => {
      prismaMock.user.findUnique.mockResolvedValueOnce(existingUser);
      const updated = { ...existingUser, name: 'New Name' };
      prismaMock.user.update.mockResolvedValue(updated);

      const result = await service.update('user-1', {
        name: 'New Name',
      } as any);

      expect(bcrypt.hash).not.toHaveBeenCalled();
      expect(prismaMock.user.update).toHaveBeenCalledWith({
        where: { id: 'user-1' },
        data: { name: 'New Name' },
        select: { id: true, email: true, name: true, role: true },
      });
      expect(result).toEqual(updated);
    });

    it('should re-hash password when provided', async () => {
      prismaMock.user.findUnique.mockResolvedValueOnce(existingUser);
      (bcrypt.hash as jest.Mock).mockResolvedValue('new_hashed_password');
      prismaMock.user.update.mockResolvedValue({
        ...existingUser,
        password: undefined,
      });

      await service.update('user-1', { password: 'newpassword' } as any);

      expect(bcrypt.hash).toHaveBeenCalledWith('newpassword', 10);
      expect(prismaMock.user.update).toHaveBeenCalledWith({
        where: { id: 'user-1' },
        data: { password: 'new_hashed_password' },
        select: { id: true, email: true, name: true, role: true },
      });
    });

    it('should allow keeping the same email without conflict check failing', async () => {
      prismaMock.user.findUnique.mockResolvedValueOnce(existingUser);
      prismaMock.user.update.mockResolvedValue(existingUser);

      await service.update('user-1', { email: existingUser.email } as any);

      expect(prismaMock.user.findUnique).toHaveBeenCalledTimes(1);
      expect(prismaMock.user.update).toHaveBeenCalled();
    });
  });

  describe('remove', () => {
    it('should throw NotFoundException if user does not exist', async () => {
      prismaMock.user.findUnique.mockResolvedValue(null);

      await expect(service.remove('missing-id')).rejects.toThrow(
        new NotFoundException('Usuário não encontrado'),
      );
    });

    it('should throw ConflictException if user has linked posts', async () => {
      prismaMock.user.findUnique.mockResolvedValue({ id: 'user-1' });
      prismaMock.post.count.mockResolvedValue(3);

      await expect(service.remove('user-1')).rejects.toThrow(
        new ConflictException('Usuário possui posts vinculados'),
      );
      expect(prismaMock.user.delete).not.toHaveBeenCalled();
    });

    it('should delete user when it has no linked posts', async () => {
      const user = { id: 'user-1' };
      prismaMock.user.findUnique.mockResolvedValue(user);
      prismaMock.post.count.mockResolvedValue(0);
      prismaMock.user.delete.mockResolvedValue(user);

      const result = await service.remove('user-1');

      expect(prismaMock.post.count).toHaveBeenCalledWith({
        where: { authorId: 'user-1' },
      });
      expect(prismaMock.user.delete).toHaveBeenCalledWith({
        where: { id: 'user-1' },
        select: { id: true, email: true, name: true, role: true },
      });
      expect(result).toEqual(user);
    });
  });
});
