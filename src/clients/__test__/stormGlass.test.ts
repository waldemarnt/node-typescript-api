import { StormGlass } from '@src/clients/stormGlass';
import stormglassNormalizedResponseFixture from '@test/fixtures/stormglass_normalized_response_3_hours.json';
import * as stormglassWeatherPointFixture from '@test/fixtures/stormglass_weather_3_hours.json';
import * as HTTPUtil from '@src/util/request';
import CacheUtil from '@src/util/cache';

jest.mock('@src/util/request');
jest.mock('@src/util/cache');

describe('StormGlass client', () => {
  /**
   * Used for static method's mocks
   */
  const MockedRequestClass = HTTPUtil.Request as jest.Mocked<
    typeof HTTPUtil.Request
  >;
  const MockedCacheUtil = CacheUtil as jest.Mocked<typeof CacheUtil>;
  /**
   * Used for instance method's mocks
   */
  const mockedRequest = new HTTPUtil.Request() as jest.Mocked<HTTPUtil.Request>;
  it('should return the normalized forecast from the StormGlass service', async () => {
    const lat = -33.792726;
    const lng = 151.289824;

    mockedRequest.get.mockResolvedValue({
      data: stormglassWeatherPointFixture,
    } as HTTPUtil.Response);

    MockedCacheUtil.get.mockReturnValue(undefined);

    const stormGlass = new StormGlass(mockedRequest, MockedCacheUtil);
    const response = await stormGlass.fetchPoints(lat, lng);
    expect(response).toEqual(stormglassNormalizedResponseFixture);
  });

  it('should exclude incomplete data points', async () => {
    const lat = -33.792726;
    const lng = 151.289824;
    const incompleteResponse = {
      hours: [
        {
          windDirection: {
            noaa: 300,
          },
          time: '2020-04-26T00:00:00+00:00',
        },
      ],
    };
    mockedRequest.get.mockResolvedValue({
      data: incompleteResponse,
    } as HTTPUtil.Response);

    MockedCacheUtil.get.mockReturnValue(undefined);

    const stormGlass = new StormGlass(mockedRequest, MockedCacheUtil);
    const response = await stormGlass.fetchPoints(lat, lng);

    expect(response).toEqual([]);
  });

  it('should get the normalized forecast points from cache and use it to return data points', async () => {
    const lat = -33.792726;
    const lng = 151.289824;

    mockedRequest.get.mockResolvedValue({
      data: null,
    } as HTTPUtil.Response);

    MockedCacheUtil.get.mockReturnValue(stormglassNormalizedResponseFixture);

    const stormGlass = new StormGlass(mockedRequest, MockedCacheUtil);
    const response = await stormGlass.fetchPoints(lat, lng);
    expect(response).toEqual(stormglassNormalizedResponseFixture);
  });

  it('should get a generic error from StormGlass service when the request fail before reaching the service', async () => {
    const lat = -33.792726;
    const lng = 151.289824;

    mockedRequest.get.mockRejectedValue('Network Error');

    MockedCacheUtil.get.mockReturnValue(undefined);

    const stormGlass = new StormGlass(mockedRequest, MockedCacheUtil);

    await expect(stormGlass.fetchPoints(lat, lng)).rejects.toThrow(
      'Unexpected error when trying to communicate to StormGlass: "Network Error"'
    );
  });

  it('should get an StormGlassResponseError when the StormGlass service responds with error', async () => {
    const lat = -33.792726;
    const lng = 151.289824;

    class FakeAxiosError extends Error {
      constructor(public response: object) {
        super();
      }
    }

    mockedRequest.get.mockRejectedValue(
      new FakeAxiosError({
        status: 429,
        data: { errors: ['Rate Limit reached'] },
      })
    );
    /**
     * Mock static function return
     */
    MockedRequestClass.isRequestError.mockReturnValue(true);
    MockedRequestClass.extractErrorData.mockReturnValue({
      status: 429,
      data: { errors: ['Rate Limit reached'] },
    });

    MockedCacheUtil.get.mockReturnValue(undefined);

    const stormGlass = new StormGlass(mockedRequest, MockedCacheUtil);

    await expect(stormGlass.fetchPoints(lat, lng)).rejects.toThrow(
      'Unexpected error returned by the StormGlass service: Error: {"errors":["Rate Limit reached"]} Code: 429'
    );
  });
});
