import { BaseRepository, FilterOptions, WithId } from '.';

export class DatabaseError extends Error {
  constructor(message: string) {
    super(message);
  }
}

export class DatabaseInternalError extends DatabaseError {}

export class DatabaseUnknownClientError extends DatabaseError {}

export class DatabaseValidationError extends DatabaseError {}

export abstract class Repository<T> implements BaseRepository<T> {
  public abstract create(data: T): Promise<WithId<T>>;
  public abstract find(filter: FilterOptions): Promise<WithId<T>[]>;
}
