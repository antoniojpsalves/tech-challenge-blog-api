import {
  Body,
  Controller,
  Delete,
  Get,
  Param,
  Patch,
  Post,
  Query,
} from '@nestjs/common';
import { ApiOperation, ApiTags } from '@nestjs/swagger';
import { CreatePostDto } from './dto/create-post.dto';
import type { UpdatePostDto } from './dto/update-post.dto';
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

  @Patch(':id')
  @ApiOperation({ summary: 'Atualizar um post existente (professores)' })
  update(@Param('id') id: string, @Body() updatePostDto: UpdatePostDto) {
    return this.postsService.update(id, updatePostDto);
  }

  @Delete(':id')
  @ApiOperation({ summary: 'Excluir um post (professores)' })
  remove(@Param('id') id: string) {
    return this.postsService.remove(id);
  }
}
