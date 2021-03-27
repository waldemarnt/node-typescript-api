import { Beach } from "@src/models/beach";
import { User } from "@src/models/user";

export interface BeachRepository {
    create(data: Omit<Beach, 'id'>): Promise<Beach>;
    findAllBeachesForUser(userId: string): Promise<Beach[]>;
}

export interface UserRepository {
    create(data: Omit<User, 'id'>): Promise<User>;
    findOneById(id: string): Promise<User | undefined>;
    findOneByEmail(email: string): Promise<User | undefined>;
}