import { client, localStorageKey } from './api-client';

function handleUserResponse({ token, name, email }) {
  console.log('testing')
  console.log(token, name, email)
  window.localStorage.setItem(localStorageKey, token);
  return { name, email };
}

function getUser() {
  const token = getToken();
  if (!token) {
    return Promise.resolve(null);
  }
  //return client('users/me').then((data) => data.user);
  return {
      name: "John Doe",
      email: "john@mail.com",
      password: "12345#@$%",
      id: "5e8131eba7768d9e4f06c884"
  }
}

function login({ email, password }) {
  // return client('users/authenticate', { body: { email, password } }).then(
  //   handleUserResponse
  // );
  return Promise.resolve(handleUserResponse({
      name: "John Doe",
      email: "john@mail.com",
      password: "12345#@$%",
      id: "5e8131eba7768d9e4f06c884",
      token: "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJfaWQiOiI1ZTdmZTQ0YzQzYWQwYjAwMThmOGQ5ZmQiLCJuYW1lIjoiV2FsZGVtYXIgTmV0byIsImVtYWlsIjoid2FsZGVtYXJudEBnbWFpbC5jb20iLCJwYXNzd29yZCI6IiQyYiQxMCRsUlZjWkc5d0dIVWJXcHF2TnJNR0F1SnNoWWJTR1RLSElQL3NycDlmTlkzZENFZDBJQjN6TyIsImlhdCI6MTU4NTQ0MDUxNywiZXhwIjoxNTg1NDYwNTE3fQ.JNtzLgCKGTAU9_-QjYUNxtM7X4nMU_pPIsNXDsEM-vP"
  }))
}

function register({ name, email, password }) {
  // return client('users', { body: { name, email, password } }).then(() =>
  //   login({ email, password })
  // );
  return login({
    email: "john@mail.com",
    password: "12345#@$%",
  })
}

function getToken() {
  return window.localStorage.getItem(localStorageKey);
}

function isLoggedIn() {
  return Boolean(getToken());
}

export { login, register, getToken, getUser, isLoggedIn };
export { logout } from './api-client';
