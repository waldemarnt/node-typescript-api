import {
  Controller,
  Get,
  ClassMiddleware,
  Middleware,
} from '@overnightjs/core';
import { Request, Response } from 'express';
import { Beach } from '@src/models/beach';
import { BeachForecast, Forecast } from '@src/services/forecast';
import { authMiddleware } from '@src/middlewares/auth';
import { BaseController } from '.';
import logger from '@src/logger';
import rateLimit from 'express-rate-limit';
import ApiError from '@src/util/errors/api-error';

const forecast = new Forecast();

const rateLimiter = rateLimit({
  windowMs: 1 * 60 * 1000, // 1 minute in milliseconds
  max: 10,
  keyGenerator(req: Request): string {
    return req.ip;
  },
  handler(_, res: Response): void {
    res.status(429).send(
      ApiError.format({
        code: 429,
        message: "Too many requests to the '/forecast endpoint'",
      })
    );
  },
});

@Controller('forecast')
@ClassMiddleware(authMiddleware)
export class ForecastController extends BaseController {
  @Get('')
  @Middleware(rateLimiter)
  public async getForecastForgeLoggedUser(
    req: Request,
    res: Response
  ): Promise<void> {
    try {
      const {
        orderBy,
        orderField,
      }: {
        orderBy?: 'asc' | 'desc';
        orderField?: keyof BeachForecast;
      } = req.query;
      const beaches = await Beach.find({ userId: req.decoded?.id });
      const forecastData = await forecast.processForecastForBeaches(
        beaches,
        orderBy,
        orderField
      );
      res.status(200).send(forecastData);
    } catch (error) {
      logger.error(error);
      this.sendErrorResponse(res, {
        code: 500,
        message: 'Something went wrong',
      });
    }
  }
}
