import { Controller, Post, ClassMiddleware } from '@overnightjs/core';
import { Request, Response } from 'express';
import { Beach } from '@src/models/beach';
import { authMiddleware } from '@src/middlewares/auth';
import { BaseController } from '.';
import { BeachRepository } from '@src/repository/beachRepository';

@Controller('beaches')
@ClassMiddleware(authMiddleware)
export class BeachesController extends BaseController {
  @Post('')
  public async create(req: Request, res: Response): Promise<void> {
    try {
      const result = await new BeachRepository().create({
        ...req.body,
        ...{ userId: req.context?.userId },
      });
      res.status(201).send(result);
    } catch (error) {
      this.sendCreateUpdateErrorResponse(res, error);
    }
  }
}
