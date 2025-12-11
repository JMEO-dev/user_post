// src/posts/entities/post.entity.ts
import {
    Entity,
    PrimaryGeneratedColumn,
    Column,
    CreateDateColumn,
    UpdateDateColumn,
    ManyToOne,
    JoinColumn,
} from 'typeorm';
import { User } from '../../users/entities/user.entity';

@Entity({ name: 'posts' })
export class Post {
    @PrimaryGeneratedColumn('uuid')
    id: string;

    @Column()
    title: string;

    @Column('text')
    content: string;

    @ManyToOne(() => User, { onDelete: 'CASCADE', nullable: false })
    @JoinColumn({ name: 'userId' })
    user: User;

    @Column('uuid')
    userId: string;

    @Column({ type: 'int', default: 0 })
    reactionCount: number;

    @Column({ type: 'int', default: 0 })
    commentCount: number;

    @CreateDateColumn()
    createdAt: Date;

    @UpdateDateColumn()
    updatedAt: Date;
}