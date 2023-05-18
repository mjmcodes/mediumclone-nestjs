import { Controller, Get } from '@nestjs/common';
import { TagService } from './tag.service';

@Controller('tags')
export class TagController {
   constructor(private tagService: TagService) {}

   @Get()
   async getAll(): Promise<{ tags: string[] }> {
      const tags = await this.tagService.findAll();
      return {
         tags: tags.map((item) => item.name),
      };
   }
}
