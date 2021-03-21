import { DefaultRepository } from "./defaultRepository";
import { User, UserDocument } from '../models/user';

export class UserRepository extends DefaultRepository<User, UserDocument> {
    constructor(private userModel = User) {
        super(userModel);
    }

}