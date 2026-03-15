import {
  Body,
  Controller,
  Delete,
  Get,
  Param,
  Patch,
  Post,
  Query,
  Req,
  UseGuards,
} from '@nestjs/common';
import { ApiBearerAuth, ApiBody, ApiOperation, ApiTags } from '@nestjs/swagger';
import { JwtAuthGuard } from 'src/auth/jwt-auth.guard';
import { Roles } from 'src/auth/roles.decorator';
import { RolesGuard } from 'src/auth/roles.guard';
import { CreatePostDto } from './dto/create-post.dto';
import { UpdatePostDto } from './dto/update-post.dto';
import { PostsService } from './posts.service';

@ApiTags('Posts')
@Controller('posts')
export class PostsController {
  constructor(private readonly postsService: PostsService) {}

  // Rotas protegidas por autenticação e autorização (apenas professores podem criar, atualizar e excluir posts)

  @Post()
  @ApiBearerAuth()
  @UseGuards(JwtAuthGuard, RolesGuard)
  @Roles('PROFESSOR')
  @ApiOperation({ summary: 'Criar um novo post (professores)' })
  create(@Body() CreatePostDto: CreatePostDto, @Req() req: any) {
    const userId = req.user.userId;
    return this.postsService.create(CreatePostDto, userId);
  }

  @Patch(':id')
  @ApiBearerAuth()
  @UseGuards(JwtAuthGuard, RolesGuard)
  @Roles('PROFESSOR')
  @ApiOperation({ summary: 'Atualizar um post existente (professores)' })
  update(@Param('id') id: string, @Body() updatePostDto: UpdatePostDto) {
    return this.postsService.update(id, updatePostDto);
  }

  @Delete(':id')
  @ApiBearerAuth()
  @UseGuards(JwtAuthGuard, RolesGuard)
  @Roles('PROFESSOR')
  @ApiOperation({ summary: 'Excluir um post (professores)' })
  remove(@Param('id') id: string) {
    return this.postsService.remove(id);
  }

  // Rotas públicas (disponíveis para todos os usuários)

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
