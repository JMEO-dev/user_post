import { Module } from '@nestjs/common';
import { ReactionsService } from './reactions.service';
import { ReactionsController } from './reactions.controller';
import { TypeOrmModule } from '@nestjs/typeorm';
import { Reaction } from './entities/reaction.entity';
import { Post } from '../posts/entities/post.entity';
import { User } from '../users/entities/user.entity';
@Module({
  imports: [
    TypeOrmModule.forFeature([Post, User, Reaction]),
  ],
  controllers: [ReactionsController],
  providers: [ReactionsService],
})
export class ReactionsModule { }
