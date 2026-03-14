export const fetchWithAuth = async (url, options = {}) => {
    // 1. Ensure headers exist and add current access token
    const token = localStorage.getItem('token');
    
    const headers = {
        'Content-Type': 'application/json',
        ...options.headers,
    };
    
    if (token) {
        headers['Authorization'] = `Bearer ${token}`;
    }

    // Always include credentials to receive/send the HttpOnly refreshToken cookie
    const config = {
        ...options,
        headers,
        credentials: 'include',
    };

    // 2. Perform the initial request
    let response = await fetch(url, config);

    // 3. Check if the token expired (401 Unauthorized)
    if (response.status === 401) {
        try {
            // Attempt to refresh the token using the HttpOnly cookie
            const refreshResponse = await fetch('https://jobtracker-backend-609f.onrender.com/auth/refresh', {
                method: 'POST',
                credentials: 'include', // Must send the cookie!
            });

            if (refreshResponse.ok) {
                const data = await refreshResponse.json();
                
                // Update local storage with new access token and name
                localStorage.setItem('token', data.accessToken);
                if (data.fullName) {
                    localStorage.setItem('name', data.fullName);
                }

                // 4. Retry original request with the NEW token
                config.headers['Authorization'] = `Bearer ${data.accessToken}`;
                response = await fetch(url, config);
            } else {
                // Refresh failed (e.g., refresh token expired or absent)
                localStorage.removeItem('token');
                localStorage.removeItem('name');
                window.location.href = '/login'; // Force redirect to login
            }
        } catch (error) {
            // Network fallback or other refresh collapse
            localStorage.removeItem('token');
            localStorage.removeItem('name');
            window.location.href = '/login';
        }
    }

    return response;
};
