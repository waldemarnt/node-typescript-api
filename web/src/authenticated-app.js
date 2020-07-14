/** @jsx jsx */
/** @jsxFrag React.Fragment */
import { jsx } from '@emotion/core';

import { Routes, Route } from 'react-router-dom';
import ErrorBoundary from 'react-error-boundary';
import {
  Header,
  FullPageErrorFallback,
  ContentWrapper,
  Footer,
} from './components/misc';
import { useAuth } from './context/auth-context';
import { ForecastScreen } from './screens/forecast';
import { NotFoundScreen } from './screens/not-found';

function AuthenticatedApp() {
  const { user, logout } = useAuth();
  return (
    <ErrorBoundary FallbackComponent={FullPageErrorFallback}>
      <ContentWrapper>
        <Header user={user} logout={logout} />
        <AppRoutes />
        <Footer>
          <div>Made with <span role="img" aria-label="emoji man surfer">🏄🏽‍♂️</span> + <span role="img" aria-label="emoji blue heart">💙</span> by <a href="https://walde.co/" target="_blank" rel="noopener noreferrer">walde.co</a></div>
          <a href="https://www.youtube.com/user/waldemaneto" target="_blank" rel="noopener noreferrer">Youtube</a>
        </Footer>
      </ContentWrapper>
    </ErrorBoundary>
  );
}

function AppRoutes() {
  return (
    <Routes>
      <Route path="/forecast" element={<ForecastScreen />} />
      <Route path="/" element={<ForecastScreen />} />
      <Route path="*" element={<NotFoundScreen />} />
    </Routes>
  );
}

export default AuthenticatedApp;
