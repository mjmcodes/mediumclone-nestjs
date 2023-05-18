import {
   Body,
   Controller,
   Get,
   Post,
   UseGuards,
   UsePipes,
   ValidationPipe,
} from '@nestjs/common';
import { UserService } from './user.service';
import { CreateUserDto } from './dto/createUser.dto';
import { IUserResponse } from './types/userResponse.interface';
import { LoginUserDto } from './dto/loginUser.dto';
import { User } from './decorators/user.decorator';
import { UserEntity } from './user.entity';
import { AuthGuard } from './guards/auth.guard';
import { UpdateUserDto } from './dto/updateUser.dto';

@Controller()
export class UserController {
   constructor(private userService: UserService) {}

   @Post('users')
   @UsePipes(new ValidationPipe())
   async createUser(
      @Body('user') createUserDto: CreateUserDto,
   ): Promise<IUserResponse> {
      const user = await this.userService.createUser(createUserDto);
      return this.userService.buildUserResponse(user);
   }

   @Post('users/login')
   @UsePipes(new ValidationPipe())
   async login(
      @Body('user') loginUserDto: LoginUserDto,
   ): Promise<IUserResponse> {
      const user = await this.userService.loginUser(loginUserDto);
      return this.userService.buildUserResponse(user);
   }

   @Get('user')
   @UseGuards(AuthGuard)
   async getCurrentUser(@User() user: UserEntity): Promise<IUserResponse> {
      return this.userService.buildUserResponse(user);
   }

   @Post('user')
   @UseGuards(AuthGuard)
   async updateCurrentUser(
      @User('id') userId: number,
      @Body('user') updateUserDto: UpdateUserDto,
   ): Promise<IUserResponse> {
      const updatedUser = await this.userService.update(userId, updateUserDto);
      return this.userService.buildUserResponse(updatedUser);
   }
}
