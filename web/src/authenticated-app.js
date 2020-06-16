/** @jsx jsx */
/** @jsxFrag React.Fragment */
import {jsx} from '@emotion/core'

import {Routes, Route} from 'react-router-dom'
import ErrorBoundary from 'react-error-boundary'
import {Logo, Logout, ErrorMessage, Footer, FullPageErrorFallback} from "./components/misc";

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
            <div css={{
                display: 'grid',
                maxWidth: '1200px',
                margin: '0 auto',
                minHeight:'100vh',
                gridTemplateColumns: 'repeat(6, 1fr)',
            }}>
                <header css={{
                    alignSelf: 'center'
                }}>
                    <Logo styles={{
                        width: '5em',
                        height: '5em',
                        margin: '1em 0',
                    }}/>
                     {/* hey {user.name} */}
                </header>
    
            <ErrorBoundary FallbackComponent={ErrorFallback}>
                <div css={{gridColumn: '1/-1', backgroundColor: '#fff'}}><AppRoutes /></div>
            </ErrorBoundary>
            <Footer><Logout onClick={logout} /></Footer>
            </div>
        </ErrorBoundary>
    )
}

function AppRoutes() {
    return (
        <Routes>
            <Route path="/forecast" element={<ForecastScreen />} />
            <Route path="*" element={<NotFoundScreen />} />
        </Routes>
    )
}

export default AuthenticatedApp;
