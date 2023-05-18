import { IsNotEmpty, isNotEmpty } from 'class-validator';

export class LoginUserDto {
   @IsNotEmpty({ message: 'Please enter a username' })
   readonly identifier: string;

   @IsNotEmpty()
   readonly password: string;
}
