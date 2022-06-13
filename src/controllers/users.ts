import { Controller, Post, Get, Middleware } from '@overnightjs/core';
import { Response, Request } from 'express';
import AuthService from '@src/services/auth';
import { BaseController } from './index';
import { authMiddleware } from '@src/middlewares/auth';
import { UserRepository } from '@src/repositories';

@Controller('users')
export class UsersController extends BaseController {
  constructor(private userRepository: UserRepository) {
    super();
  }

  @Post('')
  public async create(req: Request, res: Response): Promise<void> {
    try {
      const newUser = await this.userRepository.create(req.body);
      res.status(201).send(newUser);
    } catch (error) {
      this.sendCreateUpdateErrorResponse(res, error);
    }
  }

  @Post('authenticate')
  public async authenticate(req: Request, res: Response): Promise<Response> {
    const user = await this.userRepository.findOneByEmail(req.body.email);
    if (!user) {
      return this.sendErrorResponse(res, {
        code: 401,
        message: 'User not found!',
        description: 'Try verifying your email address.',
      });
    }
    if (
      !(await AuthService.comparePasswords(req.body.password, user.password))
    ) {
      return this.sendErrorResponse(res, {
        code: 401,
        message: 'Password does not match!',
      });
    }
    const token = AuthService.generateToken(user.id);

    return res.send({ ...user, ...{ token } });
  }

  @Get('me')
  @Middleware(authMiddleware)
  public async me(req: Request, res: Response): Promise<Response> {
    const userId = req.context?.userId;
    if (!userId) {
      return this.sendErrorResponse(res, {
        code: 404,
        message: 'user id not provided',
      });
    }
    const user = await this.userRepository.findOneById(userId);
    if (!user) {
      return this.sendErrorResponse(res, {
        code: 404,
        message: 'User not found!',
      });
    }

    return res.send({ user });
  }
}
