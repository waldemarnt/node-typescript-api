import { DefaultMongoDBRepository } from './defaultMongoDBRepository';
import { Beach, BeachDocument } from '@src/models/beach';
import { BeachRepository } from '.';
import { injectable } from 'inversify';

@injectable()
export class BeachMongoDBRepository extends DefaultMongoDBRepository<Beach, BeachDocument> implements BeachRepository {
  constructor(beachModel = Beach) {
    super(beachModel);
  }

  async findAllBeachesForUser(userId: string): Promise<Beach[]> {
    return await this.find({ userId });
  }
}
