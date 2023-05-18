import { Injectable, NestMiddleware } from '@nestjs/common';
import { NextFunction } from 'express';
import { ExpressRequest } from 'src/types';
import { verify } from 'jsonwebtoken';
import { JWT_SECRET } from 'src/config';
import { UserService } from '../user.service';

@Injectable()
export class AuthMiddleware implements NestMiddleware {
   constructor(private userService: UserService) {}

   async use(req: ExpressRequest, res: Response, next: NextFunction) {
      if (!req.headers['authorization']) {
         req.user = null;
         next();
         return;
      }

      const token = req.headers['authorization'].split(' ')[1];

      try {
         const decode = verify(token, JWT_SECRET);
         const user = await this.userService.findById(decode['id']);
         req.user = user;
      } catch (error) {
         req.user = null;
      } finally {
         next();
      }
   }
}
