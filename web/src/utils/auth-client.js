import { client, localStorageKey } from './api-client';

function handleUserResponse({ token, name, email }) {
  window.localStorage.setItem(localStorageKey, token);
  return { name, email };
}

function getUser() {
  const token = getToken();
  if (!token) {
    return Promise.resolve(null);
  }
  return client('users/me').then((data) => data.user);
}

function login({ email, password }) {
  return client('users/authenticate', { body: { email, password } }).then(
    handleUserResponse
  );
}

function register({ name, email, password }) {
  return client('users', { body: { name, email, password } }).then(() =>
    login({ email, password })
  );
}

function getToken() {
  return window.localStorage.getItem(localStorageKey);
}

function isLoggedIn() {
  return Boolean(getToken());
}

export { login, register, getToken, getUser, isLoggedIn };
export { logout } from './api-client';
