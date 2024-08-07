import { Injectable } from '@nestjs/common';
import { InjectEntityManager } from '@nestjs/typeorm';
import {
  EntityManager,
  EntityTarget,
  Repository,
  FindOptionsWhere,
  DeepPartial,
} from 'typeorm';
import { QueryDeepPartialEntity } from 'typeorm/query-builder/QueryPartialEntity';

@Injectable()
export class DatabaseService {
  constructor(
    @InjectEntityManager()
    private readonly entityManager: EntityManager,
  ) {}

  private getRepository<T>(entity: EntityTarget<T>): Repository<T> {
    return this.entityManager.getRepository(entity);
  }

  async queryWithBuilder<T>(
    entity: EntityTarget<T>,
    options: {
      select?: string[];
      relations?: string[];
      where?: FindOptionsWhere<T> | FindOptionsWhere<T>[];
      order?: { [key: string]: 'ASC' | 'DESC' };
      search?: { [key: string]: string };
      limit?: number;
      offset?: number;
    },
  ): Promise<T[]> {
    const repository = this.getRepository(entity);
    const queryBuilder = repository.createQueryBuilder('entity');

    // Select specific fields
    if (options.select) {
      queryBuilder.select(options.select.map((field) => `entity.${field}`));
    }

    // Add relations
    if (options.relations) {
      options.relations.forEach((relation) => {
        queryBuilder.leftJoinAndSelect(`entity.${relation}`, relation);
      });
    }

    // Add conditions
    if (options.where) {
      queryBuilder.where(options.where);
    }

    // Add search conditions
    if (options.search) {
      Object.keys(options.search).forEach((key) => {
        queryBuilder.andWhere(`entity.${key} LIKE :${key}`, {
          [`${key}`]: `%${options.search[key]}%`,
        });
      });
    }

    // Add sorting
    if (options.order) {
      Object.keys(options.order).forEach((field) => {
        queryBuilder.addOrderBy(`entity.${field}`, options.order[field]);
      });
    }

    // Add pagination
    if (options.limit) {
      queryBuilder.take(options.limit);
    }
    if (options.offset) {
      queryBuilder.skip(options.offset);
    }

    return queryBuilder.getMany();
  }

  async findByField<T>(
    entity: EntityTarget<T>,
    field: string,
    value: any,
  ): Promise<T[]> {
    const repository = this.getRepository(entity);
    return await repository.findBy({ [field]: value } as any);
  }

  async create<T>(entity: EntityTarget<T>, data: DeepPartial<T>): Promise<T> {
    const repository = this.getRepository(entity);
    const newEntity = repository.create(data);
    return await repository.save(newEntity);
  }

  async update<T>(
    entity: EntityTarget<T>,
    id: number,
    data: QueryDeepPartialEntity<T>,
  ): Promise<T> {
    const repository = this.getRepository(entity);
    await repository.update(id, data);
    return await repository.findOneBy({ id } as any); // Adjust as necessary for your entity
  }

  async delete<T>(entity: EntityTarget<T>, id: number): Promise<void> {
    const repository = this.getRepository(entity);
    await repository.delete(id);
  }

  async findOne<T>(
    entity: EntityTarget<T>,
    conditions: FindOptionsWhere<T>,
  ): Promise<T | null> {
    const repository = this.getRepository(entity);
    return await repository.findOneBy(conditions);
  }

  async findMany<T>(
    entity: EntityTarget<T>,
    options: {
      select?: string[];
      relations?: string[];
      where?: FindOptionsWhere<T> | FindOptionsWhere<T>[];
      order?: { [key: string]: 'ASC' | 'DESC' };
      search?: { [key: string]: string }; // e.g., { name: 'John', email: 'example@example.com' }
      limit?: number;
      offset?: number;
    },
  ): Promise<T[]> {
    const repository = this.getRepository(entity);
    const queryBuilder = repository.createQueryBuilder('entity');

    // Select specific fields
    if (options.select) {
      queryBuilder.select(options.select.map((field) => `entity.${field}`));
    }

    // Add relations
    if (options.relations) {
      options.relations.forEach((relation) => {
        queryBuilder.leftJoinAndSelect(`entity.${relation}`, relation);
      });
    }

    // Add conditions
    if (options.where) {
      queryBuilder.where(options.where);
    }

    // Add search conditions
    if (options.search) {
      Object.keys(options.search).forEach((key) => {
        queryBuilder.andWhere(`entity.${key} LIKE :${key}`, {
          [`${key}`]: `%${options.search[key]}%`,
        });
      });
    }

    // Add sorting
    if (options.order) {
      Object.keys(options.order).forEach((field) => {
        queryBuilder.addOrderBy(`entity.${field}`, options.order[field]);
      });
    }

    // Add pagination
    if (options.limit) {
      queryBuilder.take(options.limit);
    }
    if (options.offset) {
      queryBuilder.skip(options.offset);
    }

    return queryBuilder.getMany();
  }
}
