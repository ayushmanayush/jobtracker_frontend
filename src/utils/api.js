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

export const handleTokenRefresh = async () => {
    console.warn("[AUTH] Attempting background refresh...");
    setTimeout(() =>{
            console.log("Trying /refresh endpoint");
    },10000)
    try {
        const refreshResponse = await fetch(`${API_BASE_URL}/auth/refresh`, {
            method: 'POST',
            credentials: 'include',
        });

        if (refreshResponse.ok) {
            const data = await refreshResponse.json();
            const newToken = refreshResponse.accessToken;
            const newName = refreshResponse.fullName;
            setTimeout(()=>{
                console.log(data);
            },10000);

            if (newToken) {
                localStorage.setItem('token', newToken);
                if (newName) localStorage.setItem('name', newName);
                return newToken;
            }
        }
    } catch (error) {
        console.error("[AUTH] Refresh failed:", error.message);
    }
    handleUnauthorized("Session expired or refresh failed");
    return null;
};
