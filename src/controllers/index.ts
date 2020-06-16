import Mongoose from 'mongoose';
import { Response } from 'express';

export abstract class BaseController {
  protected sendCreateUpdateErrorReponse(
    res: Response,
    error: Mongoose.Error.ValidationError | Error
  ): Response {
    //TODO use error code from the error object
    if (error instanceof Mongoose.Error.ValidationError) {
      return res.status(400).send({ code: 400, error: error.message });
    } else {
      console.error(error);
      return res
        .status(500)
        .send({ code: 500, error: 'Something went wrong!' });
    }
  }
}
