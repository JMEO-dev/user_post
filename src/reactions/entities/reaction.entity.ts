// src/reactions/entities/reaction.entity.ts

import {
    Entity,
    PrimaryGeneratedColumn,
    Column,
    Unique,
    CreateDateColumn,
    ManyToOne,
    JoinColumn,
} from 'typeorm';
import { Post } from '../../posts/entities/post.entity';
import { User } from '../../users/entities/user.entity';

@Entity()
@Unique(['post', 'user']) // One reaction per user per post
export class Reaction {
    @PrimaryGeneratedColumn('uuid')
    id: string;

    // Correct: Many reactions belong to one post
    @ManyToOne(() => Post, (post) => post.id, { onDelete: 'CASCADE' })
    @JoinColumn({ name: 'postId' })
    post: Post;


    @Column()
    postId: string;

    // Correct: Many reactions belong to one user
    @ManyToOne(() => User, (user) => user.id, { onDelete: 'CASCADE' })
    @JoinColumn({ name: 'userId' })
    user: User;

    @Column()
    userId: string;

    @CreateDateColumn()
    createdAt: Date;
}