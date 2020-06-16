import { InternalError } from '@src/util/errors/internal-error';
import config, { IConfig } from 'config';
// Another way to have similar behaviour to TS namespaces
import * as HTTPUtil from '@src/util/request';

export interface StormGlassPointSource {
  [key: string]: number;
}

export interface StormGlassPoint {
  time: string;
  readonly waveHeight: StormGlassPointSource;
  readonly waveDirection: StormGlassPointSource;
  readonly swellDirection: StormGlassPointSource;
  readonly swellHeight: StormGlassPointSource;
  readonly swellPeriod: StormGlassPointSource;
  readonly windDirection: StormGlassPointSource;
  readonly windSpeed: StormGlassPointSource;
}

export interface StormGlassForecastResponse {
  hours: StormGlassPoint[];
}

export interface ForecastPoint {
  time: string;
  waveHeight: number;
  waveDirection: number;
  swellDirection: number;
  swellHeight: number;
  swellPeriod: number;
  windDirection: number;
  windSpeed: number;
}

/**
 * This error type is used when a request reaches out to the StormGlass API but returns an error
 */
export class StormGlassUnexpectedResponseError extends InternalError {
  constructor(message: string) {
    super(message);
  }
}

/**
 * This error type is used when something breaks before the request reaches out to the StormGlass API
 * eg: Network error, or request validation error
 */
export class ClientRequestError extends InternalError {
  constructor(message: string) {
    const internalMessage =
      'Unexpected error when trying to communicate to StormGlass';
    super(`${internalMessage}: ${message}`);
  }
}

export class StormGlassResponseError extends InternalError {
  constructor(message: string) {
    const internalMessage =
      'Unexpected error returned by the StormGlass service';
    super(`${internalMessage}: ${message}`);
  }
}

/**
 * We could have proper type for the configuration
 */
const stormglassResourceConfig: IConfig = config.get(
  'App.resources.StormGlass'
);

export class StormGlass {
  readonly stormGlassAPIParams =
    'swellDirection,swellHeight,swellPeriod,waveDirection,waveHeight,windDirection,windSpeed';
  readonly stormGlassAPISource = 'noaa';

  constructor(protected request = new HTTPUtil.Request()) {}

  public async fetchPoints(lat: number, lng: number): Promise<ForecastPoint[]> {
    try {
      const response = await this.request.get<StormGlassForecastResponse>(
        `${stormglassResourceConfig.get(
          'apiUrl'
        )}/weather/point?lat=${lat}&lng=${lng}&params=${
          this.stormGlassAPIParams
        }&source=${this.stormGlassAPISource}`,
        {
          headers: {
            Authorization: stormglassResourceConfig.get('apiToken'),
          },
        }
      );
      return this.normalizeResponse(response.data);
    } catch (err) {
      /**
       * This is handling the Axios errors specifically
       */
      if (HTTPUtil.Request.isRequestError(err)) {
        throw new StormGlassResponseError(
          `Error: ${JSON.stringify(err.response.data)} Code: ${
            err.response.status
          }`
        );
      }
      throw new ClientRequestError(err.message);
    }
  }
  private normalizeResponse(
    points: StormGlassForecastResponse
  ): ForecastPoint[] {
    return points.hours.filter(this.isValidPoint.bind(this)).map((point) => ({
      swellDirection: point.swellDirection[this.stormGlassAPISource],
      swellHeight: point.swellHeight[this.stormGlassAPISource],
      swellPeriod: point.swellPeriod[this.stormGlassAPISource],
      time: point.time,
      waveDirection: point.waveDirection[this.stormGlassAPISource],
      waveHeight: point.waveHeight[this.stormGlassAPISource],
      windDirection: point.windDirection[this.stormGlassAPISource],
      windSpeed: point.windSpeed[this.stormGlassAPISource],
    }));
  }

  private isValidPoint(point: Partial<StormGlassPoint>): boolean {
    return !!(
      point.time &&
      point.swellDirection?.[this.stormGlassAPISource] &&
      point.swellHeight?.[this.stormGlassAPISource] &&
      point.swellPeriod?.[this.stormGlassAPISource] &&
      point.waveDirection?.[this.stormGlassAPISource] &&
      point.waveHeight?.[this.stormGlassAPISource] &&
      point.windDirection?.[this.stormGlassAPISource] &&
      point.windSpeed?.[this.stormGlassAPISource]
    );
  }
}
