import { useQuery, useMutation, queryCache } from 'react-query';
import * as forecastClient from './forecast-client';

function useBeaches() {
  const { forecast } = useForecast();
  return forecast.length > 0
    ? forecast[0].forecast.map((beach) => ({
        name: beach.name,
        lat: beach.lat,
        lng: beach.lng,
        position: beach.position,
      }))
    : null;
}

function readForecast() {
  return forecastClient.read().then((d) => d);
}

function useForecast({ onSuccess, ...options } = {}) {
  const { data: forecast, status, error } = useQuery({
    queryKey: 'forecast',
    queryFn: readForecast,
    onSuccess: async (forecast) => {
      queryCache.setQueryData('forecast', forecast);
    },
    ...options,
  });

  return {
    forecast: forecast ?? [],
    status,
    error: { message: `Fetching beaches failed: ${error?.message}` },
  };
}

const defaultMutationOptions = {
  onError: (err, variables, recover) =>
    typeof recover === 'function' ? recover() : null,
  onSuccess: () => {
    queryCache.invalidateQueries('forecast');
    queryCache.invalidateQueries('beaches');
  },
};

function useAddBeachToForecast(options) {
  return useMutation(
    ({ name, lat, lng, position }) =>
      forecastClient.create({ name, lat, lng, position }),
    {
      ...defaultMutationOptions,
      ...options,
    }
  );
}

export { readForecast, useBeaches, useForecast, useAddBeachToForecast };
