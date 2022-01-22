import { DefaultMongoDBRepository } from './defaultMongoDBRepository';
import { Beach } from '@src/models/beach';
import { BeachRepository } from '.';

export class BeachMongoDBRepository
  extends DefaultMongoDBRepository<Beach>
  implements BeachRepository
{
  constructor(beachModel = Beach) {
    super(beachModel);
  }

  async findAllBeachesForUser(userId: string) {
    return await this.find({ userId });
  }
}
