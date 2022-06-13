import { BaseRepository, FilterOptions, WithId } from '.';

export class DatabaseError extends Error {
  constructor(message: string) {
    super(message);
  }
}

export class DatabaseValidationError extends DatabaseError {}

export class DatabaseUnknownClientError extends DatabaseError {}

export class DatabaseInternalError extends DatabaseError {}

export abstract class Repository<T> implements BaseRepository<T> {
  public abstract create(data: T): Promise<WithId<T>>;

  public abstract findOne(
    options: FilterOptions
  ): Promise<WithId<T> | undefined>;

  public abstract find(filter: FilterOptions): Promise<WithId<T>[]>;

  public abstract deleteAll(): Promise<void>;
}
