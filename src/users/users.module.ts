// users.module.ts
import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { UserService } from './users.service';
import { UsersController } from './users.controller';
import { User } from './entities/user.entity';
import { DatabaseService } from 'src/services/database.service';

@Module({
  imports: [TypeOrmModule.forFeature([User])],
  providers: [UserService, DatabaseService],
  controllers: [UsersController],
})
export class UsersModule {}
