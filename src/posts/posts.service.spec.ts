import { PrismaService } from '../prisma/prisma.service';
import { PostsService } from './posts.service';

describe('PostsService', () => {
  let service: PostsService;

  const prismaMock = {
    post: {
      create: jest.fn(),
      findMany: jest.fn(),
      findUnique: jest.fn(),
      update: jest.fn(),
      delete: jest.fn(),
    },
  } as unknown as PrismaService;

  beforeEach(() => {
    jest.clearAllMocks();
    service = new PostsService(prismaMock);
  });

  describe('create', () => {
    it('should create a post with authorId', async () => {
      const dto = { title: 'Post 1', content: 'Content 1' };
      const authorId = 'user-1';
      const created = { id: 'post-1', ...dto, authorId };

      (prismaMock.post.create as jest.Mock).mockResolvedValue(created);

      const result = await service.create(dto as any, authorId);

      expect(prismaMock.post.create).toHaveBeenCalledWith({
        data: { ...dto, authorId },
      });
      expect(result).toEqual(created);
    });

    it('should propagate prisma error on create', async () => {
      const error = new Error('create failed');
      (prismaMock.post.create as jest.Mock).mockRejectedValue(error);

      await expect(
        service.create({ title: 'x', content: 'y' } as any, 'user-1'),
      ).rejects.toThrow('create failed');
    });
  });

  describe('findAll', () => {
    it('should return posts ordered by createdAt desc', async () => {
      const posts = [{ id: '1' }, { id: '2' }];
      (prismaMock.post.findMany as jest.Mock).mockResolvedValue(posts);

      const result = await service.findAll();

      expect(prismaMock.post.findMany).toHaveBeenCalledWith({
        orderBy: { createdAt: 'desc' },
      });
      expect(result).toEqual(posts);
    });
  });

  describe('findOne', () => {
    it('should return one post by id', async () => {
      const post = { id: 'post-1', title: 'Post 1' };
      (prismaMock.post.findUnique as jest.Mock).mockResolvedValue(post);

      const result = await service.findOne('post-1');

      expect(prismaMock.post.findUnique).toHaveBeenCalledWith({
        where: { id: 'post-1' },
      });
      expect(result).toEqual(post);
    });

    it('should return null when post does not exist', async () => {
      (prismaMock.post.findUnique as jest.Mock).mockResolvedValue(null);

      const result = await service.findOne('missing-id');

      expect(result).toBeNull();
    });
  });

  describe('search', () => {
    it('should search posts by title or content (insensitive)', async () => {
      const query = 'nestjs';
      const posts = [{ id: '1', title: 'NestJS Tips' }];
      (prismaMock.post.findMany as jest.Mock).mockResolvedValue(posts);

      const result = await service.search(query);

      expect(prismaMock.post.findMany).toHaveBeenCalledWith({
        where: {
          OR: [
            { title: { contains: query, mode: 'insensitive' } },
            { content: { contains: query, mode: 'insensitive' } },
          ],
        },
      });
      expect(result).toEqual(posts);
    });

    it('should return empty array when no matches are found', async () => {
      (prismaMock.post.findMany as jest.Mock).mockResolvedValue([]);

      const result = await service.search('no-match');

      expect(result).toEqual([]);
    });
  });

  describe('update', () => {
    it('should update a post by id', async () => {
      const id = 'post-1';
      const dto = { title: 'Updated title' };
      const updated = { id, title: 'Updated title', content: 'old' };
      (prismaMock.post.update as jest.Mock).mockResolvedValue(updated);

      const result = await service.update(id, dto as any);

      expect(prismaMock.post.update).toHaveBeenCalledWith({
        where: { id },
        data: dto,
      });
      expect(result).toEqual(updated);
    });

    it('should propagate prisma error on update', async () => {
      const error = new Error('update failed');
      (prismaMock.post.update as jest.Mock).mockRejectedValue(error);

      await expect(
        service.update('post-1', { title: 'x' } as any),
      ).rejects.toThrow('update failed');
    });
  });

  describe('remove', () => {
    it('should delete a post by id', async () => {
      const deleted = { id: 'post-1', title: 'Deleted' };
      (prismaMock.post.delete as jest.Mock).mockResolvedValue(deleted);

      const result = await service.remove('post-1');

      expect(prismaMock.post.delete).toHaveBeenCalledWith({
        where: { id: 'post-1' },
      });
      expect(result).toEqual(deleted);
    });

    it('should propagate prisma error on delete', async () => {
      const error = new Error('delete failed');
      (prismaMock.post.delete as jest.Mock).mockRejectedValue(error);

      await expect(service.remove('post-1')).rejects.toThrow('delete failed');
    });
  });
});
