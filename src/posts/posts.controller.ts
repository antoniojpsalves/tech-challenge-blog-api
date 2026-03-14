import { Body, Controller, Get, Param, Post, Query } from '@nestjs/common';
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

  @Get('search')
  @ApiOperation({
    summary: 'Buscar posts por título ou conteúdo (disponível para todos)',
  })
  search(@Query('q') query: string) {
    return this.postsService.search(query);
  }

  @Get(':id')
  @ApiOperation({
    summary: 'Obter um post específico por ID (disponível para todos)',
  })
  findOne(@Param('id') id: string) {
    return this.postsService.findOne(id);
  }
}
