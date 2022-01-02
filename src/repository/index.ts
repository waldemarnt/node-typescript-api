import { Beach } from '@src/models/beach';
import { User } from '@src/models/user';

export interface BeachRepository {
  create<T>(data: T): Promise<Beach>;
  findAllBeachesForUser(userId: string): Promise<Beach[]>;
}

export interface UserRepository {
  create<T>(data: T): Promise<User>;
  findOneById(id: string): Promise<User | undefined>;
  findOneByEmail(email: string): Promise<User | undefined>;
}
