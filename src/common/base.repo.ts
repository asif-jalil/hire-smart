import NotFoundException from 'src/exceptions/not-found.exception';
import {
  DeepPartial,
  DeleteResult,
  EntityManager,
  FindManyOptions,
  FindOneOptions,
  FindOptionsWhere,
  ObjectId,
  ObjectLiteral,
  Repository,
  SaveOptions,
  UpdateResult,
} from 'typeorm';
import { QueryDeepPartialEntity } from 'typeorm/query-builder/QueryPartialEntity';

export type SelectFields<T, Options> = Options extends { select: infer Select }
  ? {
      [Key in keyof Select & keyof T]: Select[Key] extends true
        ? T[Key]
        : Select[Key] extends Record<string, any>
          ? T[Key] extends Array<infer U>
            ? Array<SelectFields<U, { select: Select[Key] }>>
            : SelectFields<T[Key], { select: Select[Key] }>
          : never;
    } & Pick<T, MethodsOnly<T>>
  : T;

// Helper type to extract only the methods from the class type
export type MethodsOnly<T> = {
  [K in keyof T]: T[K] extends (...args: any[]) => any ? K : never;
}[keyof T];

export abstract class BaseRepository<T extends ObjectLiteral> {
  constructor(protected readonly repo: Repository<T>) {}

  async create(data: DeepPartial<T>, manager?: EntityManager): Promise<T> {
    const repository = manager?.getRepository(this.repo.target) ?? this.repo;
    const entity = repository.create(data);
    return await repository.save(entity);
  }

  async createMany(data: DeepPartial<T>[], manager?: EntityManager): Promise<T[]> {
    const repository = manager?.getRepository(this.repo.target) ?? this.repo;
    const entities = repository.create(data);
    return await repository.save(entities);
  }

  async findMany<Options extends FindManyOptions<T>>(
    findManyArgs: Options,
    manager?: EntityManager,
  ): Promise<Array<SelectFields<T, Options>>> {
    const repository = manager?.getRepository(this.repo.target) ?? this.repo;
    return repository.find(findManyArgs) as Promise<Array<SelectFields<T, Options>>>;
  }

  async findOne<Options extends FindOneOptions<T>>(
    findOneArgs: Options,
    manager?: EntityManager,
  ): Promise<SelectFields<T, Options> | null> {
    const repository = manager?.getRepository(this.repo.target) ?? this.repo;
    return repository.findOne(findOneArgs) as Promise<SelectFields<T, Options> | null>;
  }

  async findOneOrThrow<Options extends FindOneOptions<T>>(
    findOneArgs: Options,
    notFoundMessage = 'Resource not found',
    manager?: EntityManager,
  ): Promise<SelectFields<T, Options>> {
    const result = await this.findOne(findOneArgs, manager);
    if (!result) throw new NotFoundException({ message: notFoundMessage });
    return result;
  }

  async update<
    Options extends string | string[] | number | number[] | Date | Date[] | ObjectId | ObjectId[] | FindOptionsWhere<T>,
  >(criteria: Options, data: QueryDeepPartialEntity<T>, manager?: EntityManager): Promise<UpdateResult> {
    const repository = manager?.getRepository(this.repo.target) ?? this.repo;
    return repository.update(criteria, data);
  }

  async save(entity: T, options?: SaveOptions, manager?: EntityManager): Promise<T> {
    const repository = manager?.getRepository(this.repo.target) ?? this.repo;
    return repository.save(entity, options);
  }

  async findOneAndUpdate<Options extends FindOneOptions<T>>(
    findOneArgs: Options,
    data: QueryDeepPartialEntity<T>,
    notFoundMessage?: string,
    manager?: EntityManager,
  ) {
    await this.findOneOrThrow(findOneArgs, notFoundMessage, manager);
    const where = findOneArgs.where as FindOptionsWhere<T>;
    const updateResult = await this.update(where, data, manager);
    const updatedData = await this.findOne(findOneArgs, manager);
    return { data: updatedData, updateResult };
  }

  async delete<Options extends FindOptionsWhere<T> | string | number | ObjectId>(
    criteria: Options,
    manager?: EntityManager,
  ): Promise<DeleteResult> {
    const repository = manager?.getRepository(this.repo.target) ?? this.repo;
    return repository.delete(criteria);
  }
}
