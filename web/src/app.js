import React from 'react';

import {useAuth} from './context/auth-context';
import {Cover, FullPageLoading} from "./components/misc";

const AuthenticatedApp = React.lazy(() => import(/* webpackPrefetch: true */ './authenticated-app'),);
const UnauthenticatedApp = React.lazy(() => import('./unauthenticated-app'),);

function App() {
  const {user} = useAuth();
  return (
    <React.Suspense fallback={<FullPageLoading />}>
    { user ? <AuthenticatedApp /> : <UnauthenticatedApp />}
    </React.Suspense>
  );
}

export {App};
