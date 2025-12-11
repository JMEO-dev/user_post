// src/posts/posts.service.ts
import {
  Injectable,
  NotFoundException,
  ForbiddenException,
} from '@nestjs/common';
import { CreatePostDto } from './dto/create-post.dto';
import { UpdatePostDto } from './dto/update-post.dto';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { Post } from './entities/post.entity';
import { User } from '../users/entities/user.entity';

@Injectable()
export class PostsService {
  constructor(
    @InjectRepository(Post)
    private readonly postsRepository: Repository<Post>,
    @InjectRepository(User)
    private readonly usersRepository: Repository<User>,
  ) { }

  // CREATE POST (with current logged-in user from JWT)
  async create(createPostDto: CreatePostDto, userId: string): Promise<Post> {
    const user = await this.usersRepository.findOne({ where: { id: userId } });

    if (!user) {
      throw new NotFoundException('User not found');
    }

    const post = this.postsRepository.create({
      ...createPostDto,
      user,
      userId, // stored as foreign key
      reactionCount: 0,
      commentCount: 0,
    });

    return this.postsRepository.save(post);
  }

  // GET ALL POSTS (latest first + include user info)
  async findAll(): Promise<Post[]> {
    return this.postsRepository.find({
      relations: ['user'],
      order: { createdAt: 'DESC' },
    });
  }

  // GET POST BY ID
  async findOne(id: string): Promise<Post> {
    const post = await this.postsRepository.findOne({
      where: { id },
      relations: ['user'],
    });

    if (!post) {
      throw new NotFoundException(`Post with ID ${id} not found`);
    }

    return post;
  }

  // UPDATE POST (only owner can update)
  async update(id: string, updatePostDto: UpdatePostDto, userId: string): Promise<Post> {
    const post = await this.findOne(id);

    if (post.userId !== userId) {
      throw new ForbiddenException('You can only update your own posts');
    }

    await this.postsRepository.update(id, updatePostDto);
    return this.findOne(id);
  }

  // DELETE POST (only owner can delete)
  async remove(id: string, userId: string): Promise<void> {
    const post = await this.findOne(id);

    if (post.userId !== userId) {
      throw new ForbiddenException('You can only delete your own posts');
    }

    await this.postsRepository.delete(id);
  }

  // GET ALL POSTS BY A USER
  async findByUserId(userId: string): Promise<Post[]> {
    return this.postsRepository.find({
      where: { userId },
      relations: ['user'],
      order: { createdAt: 'DESC' },
    });
  }
}