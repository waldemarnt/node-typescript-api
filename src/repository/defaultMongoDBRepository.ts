import logger from '@src/logger';
import { CUSTOM_VALIDATION } from '@src/models/user';
import { Document, Error, FilterQuery, Model } from 'mongoose';

export class DatabaseError extends Error {
  constructor(message: string) {
    super(message);
  }
}
export class DatabaseValidationError extends DatabaseError { }

export class DatabaseUnknownClientError extends DatabaseError { }

export class DatabaseInternalError extends DatabaseError { }

export abstract class DefaultMongoDBRepository<D, T extends Document> {
  constructor(private model: Model<T>) { }

  async create(data: Omit<D, 'id'>): Promise<D> {
    try {
      const model = new this.model(data);
      const createdData = await model.save();
      return createdData.toJSON<D>();
    } catch (error) {
      this.handleError(error);
    }
  }

  async findOne(
    options: FilterQuery<T>
  ): Promise<D | undefined> {
    try {
      const data = await this.model.findOne(options);
      return data?.toJSON<D>();
    } catch (error) {
      this.handleError(error);
    }
  }

  async find(filter: FilterQuery<T>): Promise<D[]> {
    try {
      const data = await this.model.find(filter);
      return data.map((d) => d.toJSON<D>());
    } catch (error) {
      this.handleError(error);
    }
  }

  async deleteAll(): Promise<void> {
    await this.model.deleteMany({});
  }

  protected handleError(error: Error.ValidationError): never {
    if (error instanceof Error.ValidationError) {
      const duplicatedKindErrors = Object.values(error.errors).filter(
        (err) => err.kind === CUSTOM_VALIDATION.DUPLICATED
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
