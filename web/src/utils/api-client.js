import { queryCache } from 'react-query';
import { API_URL } from '../config';
const localStorageKey = '__surf_app_token__';

async function client(endpoint, { body, ...customConfig } = {}) {
  const token = window.localStorage.getItem(localStorageKey);
  const headers = { 'Content-Type': 'application/json' };
  if (token) {
    headers['x-access-token'] = token;
  }
  const config = {
    method: body ? 'POST' : 'GET',
    ...customConfig,
    headers: {
      ...headers,
      ...customConfig.headers,
    },
  };
  if (body) {
    config.body = JSON.stringify(body);
  }
  if (!API_URL) {
    throw new Error('API URL NOT FOUND!');
  }
  return window.fetch(`${API_URL}/${endpoint}`, config).then(async (r) => {
    const data = await r.json();
    if (
      (r.status === 401 && !r.url.includes('users/authenticate')) ||
      (r.status === 404 && r.url.includes('users/me'))
    ) {
      logout();
      window.location.assign(window.location); // refresh page
      return Promise.reject({ message: 'Please re-authenticate.' });
    }

    if (r.ok) {
      return data;
    } else {
      return Promise.reject(data);
    }
  });
}

function logout() {
  queryCache.clear();
  window.localStorage.removeItem(localStorageKey);
}

export { client, localStorageKey, logout };
