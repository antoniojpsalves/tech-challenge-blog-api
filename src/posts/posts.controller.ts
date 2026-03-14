import { Body, Controller, Get, Param, Post } from '@nestjs/common';
import { ApiOperation, ApiTags } from '@nestjs/swagger';
import { CreatePostDto } from './dto/create-post.dto';
import { PostsService } from './posts.service';

@ApiTags('Posts')
@Controller('posts')
export class PostsController {
  constructor(private readonly postsService: PostsService) {}

  @Post()
  @ApiOperation({ summary: 'Criar um novo post (professores)' })
  create(@Body() CreatePostDto: CreatePostDto) {
    return this.postsService.create(CreatePostDto);
  }

  @Get()
  @ApiOperation({ summary: 'Listar todos os posts (disponível para todos)' })
  findAll() {
    return this.postsService.findAll();
  }
}
