import { User } from './user.type';

export interface IUserResponse {
   user: User & {
      token: string;
   };
}
