import { HttpException, HttpStatus, Injectable } from '@nestjs/common';
import slugify from 'slugify';

import { CreateArticleDto } from './dto/createArticle.dto';
import { ArticleEntity } from './article.entity';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { UserEntity } from 'src/user/user.entity';
import { ArticleReponse } from './types/articleResponse.interface';
import { UpdateArticleDto } from './dto/updateArticle.dto';
import { ArticlesResponse } from './types/articlesResponse.interface';

@Injectable()
export class ArticleService {
   constructor(
      @InjectRepository(ArticleEntity)
      private articleEntity: Repository<ArticleEntity>,
      @InjectRepository(UserEntity)
      private userEntity: Repository<UserEntity>,
   ) {}

   async findAll(query: any): Promise<ArticlesResponse> {
      const queryBuilder = this.articleEntity
         .createQueryBuilder('articles')
         .leftJoinAndSelect('articles.author', 'author');

      if (query.tag) {
         queryBuilder.andWhere('articles.tagList LIKE :tag', {
            tag: `%${query.tag}`,
         });
      }

      if (query.author) {
         try {
            const author = await this.userEntity.findOne({
               where: { username: query.author },
            });
            queryBuilder.andWhere('articles.authorId = :id', {
               id: author.id,
            });
         } catch (error) {
            throw new HttpException('Author not found', HttpStatus.NOT_FOUND);
         }
      }

      queryBuilder.orderBy('articles.createdAt', 'DESC');

      const articlesCount = await queryBuilder.getCount();

      if (query.limit) {
         queryBuilder.limit(query.limit);
      }

      if (query.offset) {
         queryBuilder.offset(query.offset);
      }

      const articles = await queryBuilder.getMany();

      return { articles, articlesCount };
   }

   async createArticle(
      user: UserEntity,
      articleDto: CreateArticleDto,
   ): Promise<ArticleEntity> {
      const article = new ArticleEntity();
      Object.assign(article, articleDto);
      if (!article.tagList) {
         article.tagList = [];
      }
      article.slug = this.getSlug(article.title);
      article.author = user;
      return this.articleEntity.save(article);
   }

   async findArticleBySlug(slug: string) {
      return this.articleEntity.findOne({ where: { slug } });
   }

   async deleteArticle(userId: number, articleSlug: string) {
      const article = await this.articleEntity.findOne({
         where: { slug: articleSlug },
      });

      if (!article) {
         throw new HttpException(
            'Article does not exits',
            HttpStatus.NOT_FOUND,
         );
      }
      if (article.author.id !== userId) {
         throw new HttpException(
            'You are not the author',
            HttpStatus.FORBIDDEN,
         );
      }
      return await this.articleEntity.delete({ slug: articleSlug });
   }

   async updateArticle(
      userId: number,
      articleSlug: string,
      updateArticleDto: UpdateArticleDto,
   ) {
      const article = await this.articleEntity.findOne({
         where: { slug: articleSlug },
      });

      if (!article) {
         throw new HttpException(
            'Article does not exits',
            HttpStatus.NOT_FOUND,
         );
      }
      if (article.author.id !== userId) {
         throw new HttpException(
            'You are not the author',
            HttpStatus.FORBIDDEN,
         );
      }
      Object.assign(article, updateArticleDto);
      return await this.articleEntity.save(article);
   }

   buildArticleResponse(article: ArticleEntity): ArticleReponse {
      return { article };
   }

   private getSlug(title: string): string {
      return (
         slugify(title, { lower: true }) +
         '-' +
         ((Math.random() * Math.pow(36, 6)) | 0).toString(36)
      );
   }
}
