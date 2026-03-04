import { Module } from '@nestjs/common';
import { AppController } from './app.controller';
import { AppService } from './app.service';
import { MongooseModule } from '@nestjs/mongoose';
import { AuthModule } from './auth/auth.module';
import { ConfigModule } from '@nestjs/config';

ConfigModule.forRoot({ isGlobal: true });

@Module({
  imports: [
    MongooseModule.forRoot(
      'mongodb://appuser:apppass@localhost:27017/loginsu?authSource=loginsu',
    ),
    AuthModule,
  ],
  controllers: [AppController],
  providers: [AppService],
})
export class AppModule {}
