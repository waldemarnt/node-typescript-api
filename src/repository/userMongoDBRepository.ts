import { DefaultMongoDBRepository } from './defaultMongoDBRepository';
import { User, UserDocument } from '../models/user';

export class UserMongoDBRepository extends DefaultMongoDBRepository<User, UserDocument> {
  constructor(private userModel = User) {
    super(userModel);
  }
}
