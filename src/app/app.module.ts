import { MiddlewareConsumer, Module, NestModule, RequestMethod } from '@nestjs/common';
import { ConfigModule } from '@nestjs/config';
import { APP_GUARD } from '@nestjs/core';
import { AuthModule } from 'src/auth/auth.module';
import { BookModule } from 'src/book/book.module';
import { AuthAdminGuard } from 'src/common/guards/admin.guard';
import { LoggerMiddleware } from 'src/common/middlewares/logger.middlware';
import { ReviewModule } from 'src/review/review.module';
import { UsersModule } from 'src/users/users.module';

@Module({
  imports: [
    ConfigModule.forRoot(),
    BookModule,
    UsersModule,
    ReviewModule,
    AuthModule
  ],
  controllers: [],
  providers: [],
})
export class AppModule implements NestModule {
  configure(consumer: MiddlewareConsumer) {
      consumer.apply(LoggerMiddleware)
      .forRoutes({
        path: "*",
        method: RequestMethod.ALL
      })
  }
}
