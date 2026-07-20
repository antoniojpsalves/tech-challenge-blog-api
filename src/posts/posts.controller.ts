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
import {
  ApiBearerAuth,
  ApiOperation,
  ApiQuery,
  ApiTags,
} from '@nestjs/swagger';
import { JwtAuthGuard } from 'src/auth/jwt-auth.guard';
import { Roles } from 'src/auth/roles.decorator';
import { RolesGuard } from 'src/auth/roles.guard';
import { PaginationQueryDto } from 'src/common/dto/pagination-query.dto';
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
  @ApiOperation({
    summary: 'Listar todos os posts, paginado (disponível para todos)',
  })
  @ApiQuery({ name: 'page', required: false, type: Number })
  @ApiQuery({ name: 'limit', required: false, type: Number })
  findAll(@Query() query: PaginationQueryDto) {
    return this.postsService.findAll(query.page, query.limit);
  }

  @Get('search')
  @ApiOperation({
    summary:
      'Buscar posts por título ou conteúdo, paginado (disponível para todos)',
  })
  @ApiQuery({ name: 'q', required: true, type: String })
  @ApiQuery({ name: 'page', required: false, type: Number })
  @ApiQuery({ name: 'limit', required: false, type: Number })
  search(@Query('q') q: string, @Query() query: PaginationQueryDto) {
    return this.postsService.search(q, query.page, query.limit);
  }

  @Get(':id')
  @ApiOperation({
    summary: 'Obter um post específico por ID (disponível para todos)',
  })
  findOne(@Param('id') id: string) {
    return this.postsService.findOne(id);
  }
}
