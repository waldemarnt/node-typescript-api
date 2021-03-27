import { DefaultMongoDBRepository } from './defaultMongoDBRepository';
import { Beach, BeachDocument } from '@src/models/beach';
import { BeachRepository } from '.';

export class BeachMongoDBRepository extends DefaultMongoDBRepository<Beach, BeachDocument> implements BeachRepository {
  constructor(private beachModel = Beach) {
    super(beachModel);
  }
}
