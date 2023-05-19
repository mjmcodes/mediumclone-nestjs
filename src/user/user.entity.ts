import {
   BeforeInsert,
   Column,
   Entity,
   OneToMany,
   PrimaryGeneratedColumn,
} from 'typeorm';
import { hash } from 'bcrypt';
import { ArticleEntity } from '../article/article.entity';

@Entity({ name: 'users' })
export class UserEntity {
   @PrimaryGeneratedColumn()
   id: number;

   @Column({ unique: true })
   username: string;

   @Column({ unique: true })
   email: string;

   @Column({ select: false })
   password: string;

   @Column({ default: '' })
   bio: string;

   @Column({ default: '' })
   image: string;

   @BeforeInsert()
   async hashPassword() {
      this.password = await hash(this.password, 10);
   }

   @OneToMany(() => ArticleEntity, (article) => article.author)
   articles: ArticleEntity[];
}
