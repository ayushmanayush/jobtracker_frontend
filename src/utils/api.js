import { API_BASE_URL } from './constants';

const handleUnauthorized = (reason) => {
    console.error(`[AUTH] Unauthorized session: ${reason}. Clearing local storage and redirecting.`);
    
    // If we're already on the login page, don't keep redirecting
    if (window.location.pathname === '/login') return;

    localStorage.removeItem('token');
    localStorage.removeItem('name');
    
    // Redirect immediately or with a minimal delay to avoid interfering with new login attempts
    window.location.href = '/login';
};

export const extractToken = (data) => {
    if (!data) return null;
    // Check common keys in root or inside a 'data' property
    const keys = ['accessToken'];
    for (const key of keys) {
        if (data[key]) return data[key];
        if (data.data && data.data[key]) return data.data[key];
    }
    return null;
};

export const extractName = (data) => {
    if (!data) return null;
    const keys = ['fullName', 'full_name', 'name', 'username', 'email'];
    for (const key of keys) {
        if (data[key]) return data[key];
        if (data.data && data.data[key]) return data.data[key];
    }
    return null;
};

export const fetchWithAuth = async (endpoint, options = {}) => {
    let token = localStorage.getItem('token');
    
    // Sanitize token: Remove "null", "undefined" or leading "Bearer "
    if (token === 'null' || token === 'undefined' || !token) {
        token = null;
    } else if (token.startsWith('Bearer ')) {
        token = token.substring(7);
    }

    const url = endpoint.startsWith('http') ? endpoint : `${API_BASE_URL}${endpoint}`;
    const headers = {
        'Content-Type': 'application/json',
        ...options.headers,
    };

    if (token) {
        headers['Authorization'] = `Bearer ${token}`;
    }

    const config = {
        ...options,
        headers,
        credentials: 'include',
    };

    console.log(`[API] ${config.method || 'GET'} to ${endpoint} | Token: ${token ? 'PRESENT (starts with ' + token.substring(0, 5) + '...)' : 'MISSING'}`);
    
    let response = await fetch(url, config);

    if (response.status === 401) {
        console.warn(`[AUTH] 401 Unauthorized detected for ${endpoint}. Attempting background refresh...`);
        try {
            const refreshResponse = await fetch(`${API_BASE_URL}/auth/refresh`, {
                method: 'POST',
                credentials: 'include',
            });

            if (refreshResponse.ok) {
                const data = await refreshResponse.json();
                console.log('[AUTH] Refresh response body:', data);
                
                const newToken = extractToken(data);
                const newName = extractName(data);

                if (newToken) {
                    console.info('[AUTH] Refresh successful. Updating token and retrying original request.');
                    localStorage.setItem('token', newToken);
                    if (newName) localStorage.setItem('name', newName);

                    // Retry original
                    config.headers['Authorization'] = `Bearer ${newToken}`;
                    response = await fetch(url, config);
                    
                    if (response.status === 401) {
                        handleUnauthorized('Retry after refresh still returned 401');
                    }
                } else {
                    handleUnauthorized('Refresh succeeded but NO token found in response');
                }
            } else {
                handleUnauthorized(`Refresh endpoint failed with status ${refreshResponse.status}`);
            }
        } catch (error) {
            handleUnauthorized(`Refresh operation crashed: ${error.message}`);
        }
    }

    return response;
};

export const api = {
    get: (endpoint, options) => fetchWithAuth(endpoint, { ...options, method: 'GET' }),
    post: (endpoint, body, options) => fetchWithAuth(endpoint, { ...options, method: 'POST', body: body ? JSON.stringify(body) : undefined }),
    patch: (endpoint, body, options) => fetchWithAuth(endpoint, { ...options, method: 'PATCH', body: body ? JSON.stringify(body) : undefined }),
    delete: (endpoint, options) => fetchWithAuth(endpoint, { ...options, method: 'DELETE' }),
};
