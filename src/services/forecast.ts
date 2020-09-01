import { StormGlass, ForecastPoint } from '@src/clients/stormGlass';
import { InternalError } from '@src/util/errors/internal-error';
import { Beach } from '@src/models/beach';
import logger from '@src/logger';
import { Rating } from './rating';
import orderByCustomProp, { Ordination } from '@src/util/orderByCustomProp';

export interface BeachForecast extends Omit<Beach, 'user'>, ForecastPoint {
  rating: number;
}

export interface TimeForecast {
  time: string;
  forecast: BeachForecast[];
}

export class ForecastProcessingInternalError extends InternalError {
  constructor(message: string) {
    super(`Unexpected error during the forecast processing: ${message}`);
  }
}

export class Forecast {
  constructor(
    protected stormGlass = new StormGlass(),
    protected RatingService: typeof Rating = Rating
  ) {}

  public async processForecastForBeaches(
    beaches: Beach[],
    {
      customProp,
      ordination,
    }: {
      customProp: keyof Omit<BeachForecast, '_id'>;
      ordination: Ordination;
    } = {
      customProp: 'rating',
      ordination: Ordination.DESC,
    }
  ): Promise<TimeForecast[]> {
    try {
      const beachForecast = await this.calculateRating(beaches);
      const timeForecast = this.mapForecastByTime(beachForecast);
      return timeForecast.map((t) => ({
        time: t.time,
        forecast: t.forecast.sort((curr, next) =>
          orderByCustomProp<Omit<BeachForecast, '_id'>>(curr, next, {
            customProp,
            ordination,
          })
        ),
      }));
    } catch (error) {
      throw new ForecastProcessingInternalError(error.message);
    }
  }

  private async calculateRating(beaches: Beach[]): Promise<BeachForecast[]> {
    const pointsWithCorrectSources: BeachForecast[] = [];
    logger.info(`Preparing the forecast for ${beaches.length} beaches`);
    const points: ForecastPoint[][] = await Promise.all(
      beaches.map((beach) => this.stormGlass.fetchPoints(beach.lat, beach.lng))
    );

    points.forEach((point: ForecastPoint[], index: number) => {
      const ratingService = new this.RatingService(beaches[index]);
      pointsWithCorrectSources.push(
        ...this.enrichBeachData(point, beaches[index], ratingService)
      );
    });

    return pointsWithCorrectSources;
  }

  private mapForecastByTime(forecast: BeachForecast[]): TimeForecast[] {
    const forecastByTime: TimeForecast[] = [];
    for (const point of forecast) {
      const timePoint = forecastByTime.find((f) => f.time === point.time);
      if (timePoint) {
        timePoint.forecast.push(point);
      } else {
        forecastByTime.push({
          time: point.time,
          forecast: [point],
        });
      }
    }
    return forecastByTime;
  }

  private enrichBeachData(
    points: ForecastPoint[],
    beach: Beach,
    rating: Rating
  ): BeachForecast[] {
    return points.map((point) => ({
      ...{},
      ...{
        lat: beach.lat,
        lng: beach.lng,
        name: beach.name,
        position: beach.position,
        rating: rating.getRateForPoint(point),
      },
      ...point,
    }));
  }
}
