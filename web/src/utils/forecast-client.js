import { client } from './api-client';

function create(forecastData) {
  return client('beaches', { body: forecastData });
}

function read() {
  return client('forecast');
}

export { create, read };
