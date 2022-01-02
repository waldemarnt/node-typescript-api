import logger from '@src/logger';
import { CUSTOM_VALIDATION } from '@src/models/user';
import { Error, FilterQuery, Model, Types } from 'mongoose';

export class DatabaseError extends Error {
  constructor(message: string) {
    super(message);
  }
}
export class DatabaseValidationError extends DatabaseError {}

export class DatabaseUnknownClientError extends DatabaseError {}

export class DatabaseInternalError extends DatabaseError {}

type DocumentWithId<T> = T & {
  id: Types.ObjectId;
};

export abstract class DefaultMongoDBRepository<
  D extends object,
  R = DocumentWithId<D>
> {
  constructor(private model: Model<D>) {}

  async create<T>(data: T) {
    try {
      const model = new this.model(data);
      const createdData = await model.save();
      return createdData.toJSON<D>();
    } catch (error) {
      this.handleError(error);
    }
  }

  async findOne(options: FilterQuery<R>) {
    try {
      const data = await this.model.findOne(options);
      return data?.toJSON<R>();
    } catch (error) {
      this.handleError(error);
    }
  }

  async find(filter: FilterQuery<R>) {
    try {
      const data = await this.model.find(filter);
      return data.map((d) => d.toJSON<R>());
    } catch (error) {
      this.handleError(error);
    }
  }

  async deleteAll(): Promise<void> {
    await this.model.deleteMany({});
  }

  protected handleError(error: unknown): never {
    if (error instanceof Error.ValidationError) {
      const duplicatedKindErrors = Object.values(error.errors).filter(
        (err) =>
          err.name === 'ValidatorError' &&
          err.kind === CUSTOM_VALIDATION.DUPLICATED
      );
      if (duplicatedKindErrors.length) {
        throw new DatabaseValidationError(error.message);
      }
      throw new DatabaseUnknownClientError(error.message);
    }
    logger.warn('Database error', error);
    throw new DatabaseInternalError(
      'Something unexpected happened to the database'
    );
  }
}
