import { Controller, Get, Post, Body, UseGuards, Param, Request } from '@nestjs/common';
import { ReactionsService } from './reactions.service';
import { JwtAuthGuard } from '../auth/jwt-auth.guard';

@Controller('reactions')
@UseGuards(JwtAuthGuard)
export class ReactionsController {
  constructor(private readonly reactionsService: ReactionsService) { }

  @Post(':postId')
  create(@Param() param, @Request() req) {
    const userId = req.user.userId;
    return this.reactionsService.toggleReaction(
      param.postId,
      userId,
    );
  }

}
