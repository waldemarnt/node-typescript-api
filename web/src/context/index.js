import React from 'react';
import {BrowserRouter as Router} from 'react-router-dom';
import {ReactQueryConfigProvider} from 'react-query';
import {AuthProvider} from './auth-context';

const queryConfig = {
    useErrorBoundary: false,
    refetchAllOnWindowFocus: false,
    staleTime: 1000 * 60 * 60,
    cacheTime: 1000 * 60 * 60,
    refetchOnMount: false,
    retry: false,
};

function AppProviders({children}) {
    return (
        <ReactQueryConfigProvider config={queryConfig}>
            <Router>
                <AuthProvider>{children}</AuthProvider>
            </Router>
        </ReactQueryConfigProvider>
    )
};

export {AppProviders};

