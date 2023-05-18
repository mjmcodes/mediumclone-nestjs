import { Entity, PrimaryGeneratedColumn } from 'typeorm';

@Entity({ name: 'articles' })
export class ArticleEntity {
   @PrimaryGeneratedColumn()
   id: number;
}
