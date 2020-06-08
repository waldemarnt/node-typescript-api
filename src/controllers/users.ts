import { Controller, Post } from '@overnightjs/core';
import { Response, Request } from 'express';

@Controller('users')
export class UsersController {
  @Post('')
  public async create(req: Request, res: Response): Promise<void> {
    res.status(201).send(req.body);
  }
}
