import { Beach } from "@src/models/beach";

export interface BeachRepository {
    create(data: Omit<Beach, 'id'>): Promise<Beach>;
}