import { HttpException, HttpStatus, Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { sign } from 'jsonwebtoken';
import { compare } from 'bcrypt';
import { CreateUserDto } from './dto/createUser.dto';
import { UserEntity } from './user.entity';
import { JWT_SECRET } from 'src/config';
import { IUserResponse } from './types/userResponse.interface';
import { LoginUserDto } from './dto/loginUser.dto';
import { UpdateUserDto } from './dto/updateUser.dto';

@Injectable()
export class UserService {
   constructor(
      @InjectRepository(UserEntity)
      private userRepository: Repository<UserEntity>,
   ) {}

   async createUser(createDto: CreateUserDto): Promise<UserEntity> {
      try {
         const newUser = new UserEntity();
         Object.assign(newUser, createDto);
         return await this.userRepository.save(newUser);
      } catch (error) {
         throw new HttpException(
            'Email or username are taken',
            HttpStatus.UNPROCESSABLE_ENTITY,
         );
      }
   }

   async update(id: number, updateUserDto: UpdateUserDto): Promise<UserEntity> {
      const user = await this.findById(id);
      Object.assign(user, updateUserDto);
      return await this.userRepository.save(user);
   }

   async loginUser(loginUserDto: LoginUserDto): Promise<UserEntity> {
      const user = await this.userRepository.findOne({
         where: [
            { username: loginUserDto.identifier },
            { email: loginUserDto.identifier },
         ],
         select: ['id', 'bio', 'email', 'image', 'username', 'password'],
      });

      if (!user) {
         throw new HttpException('user not found', HttpStatus.NOT_FOUND);
      }

      const isPasswordMatch = await compare(
         loginUserDto.password,
         user.password,
      );
      if (!isPasswordMatch) {
         throw new HttpException(
            'Password do not match. Try again',
            HttpStatus.NOT_FOUND,
         );
      }
      delete user.password;
      return user;
   }

   async findById(id: number): Promise<UserEntity> {
      return this.userRepository.findOneBy({ id });
   }

   buildUserResponse(user: UserEntity): IUserResponse {
      return {
         user: { ...user, token: this.generateJwt(user) },
      };
   }

   generateJwt(user: UserEntity): string {
      return sign(
         { id: user.id, username: user.username, email: user.email },
         JWT_SECRET,
      );
   }
}
