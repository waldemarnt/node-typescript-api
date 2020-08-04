import * as auth from './auth-client';
async function bootstrapAppData() {
  let appData = { user: null };

  if (auth.isLoggedIn()) {
    appData = {
      user: await auth.getUser(),
    };
  }

  return appData;
}

export { bootstrapAppData };
