import { Inject, Injectable } from '@nestjs/common';
import { TagEntity } from './tag.entity';
import { Repository } from 'typeorm';
import { InjectRepository } from '@nestjs/typeorm';

@Injectable()
export class TagService {
   constructor(
      @InjectRepository(TagEntity) private tagRepository: Repository<TagEntity>,
   ) {}

   async findAll(): Promise<TagEntity[]> {
      return await this.tagRepository.find();
   }
}
