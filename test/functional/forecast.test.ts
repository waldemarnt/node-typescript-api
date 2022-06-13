import { Beach, GeoPosition } from '@src/models/beach';
import nock from 'nock';
import stormGlassWeather3HoursFixture from '../fixtures/stormglass_weather_3_hours.json';
import apiForecastResponse1BeachFixture from '../fixtures/api_forecast_response_1_beach.json';
import AuthService from '@src/services/auth';
import CacheUtil from '@src/util/cache';
import { UserMongoDBRepository } from '@src/repositories/userMongoDBRepository';

describe('Beach forecast functional tests', () => {
  const defaultUser = {
    name: 'John Doe',
    email: 'john3@mail.com',
    password: '1234',
  };
  let token: string;
  beforeEach(async () => {
    const userRepository = new UserMongoDBRepository();
    await Beach.deleteMany({});
    await userRepository.deleteAll();
    const user = await userRepository.create(defaultUser);
    const defaultBeach = {
      lat: -33.792726,
      lng: 151.289824,
      name: 'Manly',
      position: GeoPosition.E,
      userId: user.id,
    };
    await new Beach(defaultBeach).save();
    token = AuthService.generateToken(user.id);
    CacheUtil.clearAllCache();
  });

  it('should return a forecast with just a few times', async () => {
    nock('https://api.stormglass.io:443', {
      encodedQueryParams: true,
      reqheaders: {
        Authorization: (): boolean => true,
      },
    })
      .defaultReplyHeaders({ 'access-control-allow-origin': '*' })
      .get('/v2/weather/point')
      .query({
        lat: '-33.792726',
        lng: '151.289824',
        params: /(.*)/,
        source: 'noaa',
        end: /(.*)/,
      })
      .reply(200, stormGlassWeather3HoursFixture);

    const { body, status } = await global.testRequest
      .get('/forecast')
      .set({ 'x-access-token': token });
    expect(status).toBe(200);
    // Make sure we use toEqual to check value not the object and array itself
    expect(body).toEqual(apiForecastResponse1BeachFixture);
  });

  it('should return 500 if something goes wrong during the processing', async () => {
    nock('https://api.stormglass.io:443', {
      encodedQueryParams: true,
      reqheaders: {
        Authorization: (): boolean => true,
      },
    })
      .defaultReplyHeaders({ 'access-control-allow-origin': '*' })
      .get('/v1/weather/point')
      .query({ lat: '-33.792726', lng: '151.289824' })
      .replyWithError('Something went wrong');

    const { status } = await global.testRequest
      .get(`/forecast`)
      .set({ 'x-access-token': token });

    expect(status).toBe(500);
  });
});
