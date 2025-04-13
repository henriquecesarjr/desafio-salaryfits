import { Module } from '@nestjs/common';
import { ReviewService } from './review.service';
import { PrismaModule } from 'src/prisma/prisma.module';

@Module({
  imports: [PrismaModule],
  providers: [ReviewService],
})
export class ReviewModule {}
