/** @jsx jsx */
/** @jsxFrag React.Fragment */
import {jsx} from '@emotion/core'

import {Routes, Route} from 'react-router-dom'
import ErrorBoundary from 'react-error-boundary'
import {Logo, Logout, ErrorMessage, Header, Footer, FullPageErrorFallback, ContentWrapper} from "./components/misc";
import {useAuth} from './context/auth-context'
import {ForecastScreen} from './screens/forecast'
import {NotFoundScreen} from './screens/not-found'

function ErrorFallback({error}) {
    return (
        <ErrorMessage
            error={error}
        />
    )
}

function AuthenticatedApp() {
    const {user, logout} = useAuth();
    return (
        <ErrorBoundary FallbackComponent={FullPageErrorFallback}>
            <ContentWrapper>
                <Header user={user} logout={logout} />
                <AppRoutes />
            </ContentWrapper>
        </ErrorBoundary>
    )
}

function AppRoutes() {
    return (
        <Routes>
            <Route path="/forecast" element={<ForecastScreen />} />
            <Route path="/" element={<ForecastScreen />} />
            <Route path="*" element={<NotFoundScreen />} />
        </Routes>
    )
}

export default AuthenticatedApp;
