import { MiddlewareConsumer, Module, RequestMethod } from '@nestjs/common';
import { AppController } from './app.controller';
import { AppService } from './app.service';
import { TagModule } from './tag/tag.module';
import { TypeOrmModule } from '@nestjs/typeorm';
import config from './typeorm.config';
import { UserModel } from './user/user.module';
import { AuthMiddleware } from './user/middlewares/auth.middleware';
import { ArticleModule } from './article/article.module';

@Module({
   imports: [
      TypeOrmModule.forRoot(config.options),
      TagModule,
      UserModel,
      ArticleModule,
   ],
   controllers: [AppController],
   providers: [AppService],
})
export class AppModule {
   configure(consumer: MiddlewareConsumer) {
      consumer.apply(AuthMiddleware).forRoutes({
         path: '*',
         method: RequestMethod.ALL,
      });
   }
}
