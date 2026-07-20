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
      count: jest.fn(),
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
    it('should return posts paginated, ordered by createdAt desc, with default page/limit', async () => {
      const posts = [{ id: '1' }, { id: '2' }];
      (prismaMock.post.findMany as jest.Mock).mockResolvedValue(posts);
      (prismaMock.post.count as jest.Mock).mockResolvedValue(2);

      const result = await service.findAll();

      expect(prismaMock.post.findMany).toHaveBeenCalledWith({
        orderBy: { createdAt: 'desc' },
        skip: 0,
        take: 10,
      });
      expect(prismaMock.post.count).toHaveBeenCalledWith();
      expect(result).toEqual({
        data: posts,
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

    it('should apply skip/take based on page and limit', async () => {
      (prismaMock.post.findMany as jest.Mock).mockResolvedValue([]);
      (prismaMock.post.count as jest.Mock).mockResolvedValue(25);

      const result = await service.findAll(2, 10);

      expect(prismaMock.post.findMany).toHaveBeenCalledWith({
        orderBy: { createdAt: 'desc' },
        skip: 10,
        take: 10,
      });
      expect(result.meta).toEqual({
        total: 25,
        page: 2,
        limit: 10,
        totalPages: 3,
        hasNextPage: true,
        hasPrevPage: true,
      });
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
    it('should search posts by title or content (insensitive), paginated', async () => {
      const query = 'nestjs';
      const posts = [{ id: '1', title: 'NestJS Tips' }];
      (prismaMock.post.findMany as jest.Mock).mockResolvedValue(posts);
      (prismaMock.post.count as jest.Mock).mockResolvedValue(1);

      const expectedWhere = {
        OR: [
          { title: { contains: query, mode: 'insensitive' } },
          { content: { contains: query, mode: 'insensitive' } },
        ],
      };

      const result = await service.search(query);

      expect(prismaMock.post.findMany).toHaveBeenCalledWith({
        where: expectedWhere,
        skip: 0,
        take: 10,
      });
      expect(prismaMock.post.count).toHaveBeenCalledWith({
        where: expectedWhere,
      });
      expect(result.data).toEqual(posts);
      expect(result.meta.total).toBe(1);
    });

    it('should return empty data array when no matches are found', async () => {
      (prismaMock.post.findMany as jest.Mock).mockResolvedValue([]);
      (prismaMock.post.count as jest.Mock).mockResolvedValue(0);

      const result = await service.search('no-match');

      expect(result.data).toEqual([]);
      expect(result.meta.total).toBe(0);
      expect(result.meta.totalPages).toBe(1);
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
