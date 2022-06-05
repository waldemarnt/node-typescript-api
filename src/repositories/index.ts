import { Beach } from '@src/models/beach';
import { User } from '@src/models/user';

export type FilterOptions = Record<string, unknown>;

export type WithId<T> = { id: string } & T;

export interface BaseRepository<T> {
  create(data: T): Promise<WithId<T>>;
  findOne(options: FilterOptions): Promise<WithId<T> | undefined>;
  find(options: FilterOptions): Promise<WithId<T>[]>;
  deleteAll(): Promise<void>;
}

export interface BeachRepository extends BaseRepository<Beach> {
  findAllBeachesForUser(userId: string): Promise<WithId<Beach>[]>;
}

export interface UserRepository extends BaseRepository<User> {
  findOneById(id: string): Promise<WithId<User> | undefined>;
  findOneByEmail(email: string): Promise<WithId<User> | undefined>;
}
