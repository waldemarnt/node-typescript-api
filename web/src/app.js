import React from 'react';

import {useAuth} from './context/auth-context';
import {Cover} from "./components/misc";

const AuthenticatedApp = React.lazy(() => import(/* webpackPrefetch: true */ './authenticated-app'),);
const UnauthenticatedApp = React.lazy(() => import('./unauthenticated-app'),);

function App() {
  const {user} = useAuth();
  return (
    <React.Suspense fallback={<div>Loading...</div>}>
      <Cover>
        { user ? <AuthenticatedApp /> : <UnauthenticatedApp />}
      </Cover>
    </React.Suspense>
  );
}

export {App};
