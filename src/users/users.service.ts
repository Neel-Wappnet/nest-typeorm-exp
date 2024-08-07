import { Injectable } from '@nestjs/common';
import { DatabaseService } from './../services/database.service';
import { User } from './entities/user.entity';
import { DeepPartial, FindOptionsWhere } from 'typeorm';

@Injectable()
export class UserService {
  constructor(private readonly databaseService: DatabaseService) {}

  async createUser(data: DeepPartial<User>): Promise<User> {
    return this.databaseService.create(User, data);
  }

  async updateUser(id: number, data: Partial<User>): Promise<User> {
    return this.databaseService.update(User, id, data);
  }

  async deleteUser(id: number): Promise<void> {
    return this.databaseService.delete(User, id);
  }

  async findOneUser(conditions: FindOptionsWhere<User>): Promise<User | null> {
    return this.databaseService.findOne(User, conditions);
  }

  async findManyUsers(options: {
    select?: string[];
    relations?: string[];
    where?: FindOptionsWhere<User> | FindOptionsWhere<User>[];
    order?: { [key: string]: 'ASC' | 'DESC' };
    search?: { [key: string]: string };
    limit?: number;
    offset?: number;
  }): Promise<User[]> {
    return this.databaseService.findMany(User, options);
  }

  async findUsersByField(field: string, value: any): Promise<User[]> {
    return this.databaseService.findByField(User, field, value);
  }
}
