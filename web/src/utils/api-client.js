import {queryCache} from 'react-query';
const localStorageKey = '__surf_app_token__';

async function client(endpoint, {body, ...customConfig} = {}) {
    const token = window.localStorage.getItem(localStorageKey);
    const headers = {'Content-Type': 'application/json'}
    if (token) {
        headers['x-access-token'] = token;
    }
    const config = {
        method: body ? 'POST' : 'GET',
        ...customConfig,
        headers: {
            ...headers,
            ...customConfig.headers,
        },
    };
    if (body) {
        config.body = JSON.stringify(body);
    }
    return window
        .fetch(`http://waldemarnt-com.umbler.net/${endpoint}`, config) // TODO -> ${process.env.SURF_APP_API_URL}
        .then(async r => {
            if (r.status === 401) {
                logout();
                // window.location.assign(window.location); // refresh page
                return ;
            }
            const data = await r.json();
            if (r.ok) {
                return data;
            } else {
                return Promise.reject(data);
            }
        })
}

function logout() {
    queryCache.clear();
    window.localStorage.removeItem(localStorageKey);
}

export {client, localStorageKey, logout}