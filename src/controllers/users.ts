import { Controller, Post } from '@overnightjs/core';
import { Response, Request } from 'express';
import { User } from '@src/models/user';

@Controller('users')
export class UsersController {
  @Post('')
  public async create(req: Request, res: Response): Promise<void> {
    const user = new User(req.body);
    const newUser = await user.save();
    res.status(201).send(newUser);
  }
}
