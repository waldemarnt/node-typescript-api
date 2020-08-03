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
} from './components/lib';

import { useAuth } from './context/auth-context';
import { ForecastScreen } from './screens/forecast';

function AuthenticatedApp() {
  const { user, logout } = useAuth();
  return (
    <ErrorBoundary FallbackComponent={FullPageErrorFallback}>
      <ContentWrapper>
        <Header user={user} logout={logout} />
        <AppRoutes />
        <Footer>
          Made with{' '}
          <span role="img" aria-label="emoji man surfer">
            {' '}
            🏄🏽‍♂️{' '}
          </span>{' '}
          +{' '}
          <span role="img" aria-label="emoji blue heart">
            {' '}
            💙{' '}
          </span>
          by{' '}
          <a href="https://walde.co/" target="_blank" rel="noopener noreferrer">
            walde.co
          </a>
          <a
            href="https://www.youtube.com/user/waldemaneto"
            target="_blank"
            rel="noopener noreferrer"
          >
            Youtube
          </a>
        </Footer>
      </ContentWrapper>
    </ErrorBoundary>
  );
}

function AppRoutes() {
  return (
    <Routes>
      <Route path="*" element={<ForecastScreen />} />
    </Routes>
  );
}

export default AuthenticatedApp;
