import { DataSource } from 'typeorm';

const config = new DataSource({
   type: 'postgres',
   host: 'localhost',
   port: 5432,
   username: 'mediumclone',
   password: 'root',
   database: 'mediumclone',
   entities: [__dirname + '/**/*.entity{.ts,.js}'],
   synchronize: false,
   migrations: [__dirname + '/migrations/**/*{.ts,.js}'],
});

export default config;
