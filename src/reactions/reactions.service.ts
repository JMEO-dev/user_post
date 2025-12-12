// src/reactions/reactions.service.ts

import { Injectable, NotFoundException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository, DataSource } from 'typeorm';
import { Reaction } from './entities/reaction.entity';
import { Post } from '../posts/entities/post.entity';

@Injectable()
export class ReactionsService {
  constructor(
    @InjectRepository(Reaction)
    private reactionRepo: Repository<Reaction>,
    @InjectRepository(Post)
    private postRepo: Repository<Post>,
    private dataSource: DataSource,
  ) { }

  async toggleReaction(postId: string, userId: string) {
    return this.dataSource.transaction(async (manager) => {
      const post = await manager.findOne(Post, {
        where: { id: postId },
      });

      if (!post) {
        throw new NotFoundException('Post not found');
      }

      // Check if user already reacted
      const existing = await manager.findOne(Reaction, {
        where: {
          postId,
          userId,
        },
      });

      if (existing) {
        // Already reacted → DELETE
        await manager.remove(existing);
        post.reactionCount -= 1;
      } else {
        // Not reacted → CREATE
        const reaction = manager.create(Reaction, { postId, userId });
        await manager.save(reaction);
        post.reactionCount += 1;
      }

      await manager.save(post);

      return {
        reacted: !existing,
        reactionsCount: post.reactionCount,
      };
    });
  }
}