import {
   Body,
   Controller,
   Delete,
   Get,
   Param,
   Post,
   Put,
   Query,
   UseGuards,
   UsePipes,
   ValidationPipe,
} from '@nestjs/common';
import { ArticleService } from './article.service';
import { CreateArticleDto } from './dto/createArticle.dto';
import { AuthGuard } from 'src/user/guards/auth.guard';
import { User } from 'src/user/decorators/user.decorator';
import { UserEntity } from 'src/user/user.entity';
import { ArticleReponse } from './types/articleResponse.interface';
import { DeleteResult } from 'typeorm';
import { UpdateArticleDto } from './dto/updateArticle.dto';
import { ArticlesResponse } from './types/articlesResponse.interface';

@Controller('articles')
export class ArticleController {
   constructor(private articleService: ArticleService) {}

   @Get()
   async findAll(@Query() query: any): Promise<ArticlesResponse> {
      return await this.articleService.findAll(query);
   }

   @Post()
   @UseGuards(AuthGuard)
   @UsePipes(new ValidationPipe())
   async create(
      @User() user: UserEntity,
      @Body('article') createArticleDto: CreateArticleDto,
   ): Promise<ArticleReponse> {
      const article = await this.articleService.createArticle(
         user,
         createArticleDto,
      );
      return this.articleService.buildArticleResponse(article);
   }

   @Get(':slug')
   @UseGuards(AuthGuard)
   async getArticle(@Param('slug') slug: string): Promise<ArticleReponse> {
      const article = await this.articleService.findArticleBySlug(slug);
      return this.articleService.buildArticleResponse(article);
   }

   @Delete(':slug')
   @UseGuards(AuthGuard)
   async deleteArticle(
      @User('id') userId: number,
      @Param('slug') slug: string,
   ): Promise<DeleteResult> {
      return this.articleService.deleteArticle(userId, slug);
   }

   @Put(':slug')
   @UseGuards(AuthGuard)
   @UsePipes(new ValidationPipe())
   async updateArticle(
      @User('id') userId: number,
      @Param('slug') slug: string,
      @Body('article') articleDto: UpdateArticleDto,
   ): Promise<ArticleReponse> {
      const article = await this.articleService.updateArticle(
         userId,
         slug,
         articleDto,
      );
      return this.articleService.buildArticleResponse(article);
   }
}
