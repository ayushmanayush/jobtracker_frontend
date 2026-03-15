import { useEffect, useState } from 'react';
import styles from './openapplications.module.css';
import { API_BASE_URL } from './utils/constants';
import { handleTokenRefresh } from './utils/api';

export const AllApplications = () => {
    const [applications, setApplications] = useState([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);

    const fetchApplications = async () => {
        let token = localStorage.getItem('token');
        try {
            let response = await fetch(`${API_BASE_URL}/applications`, {
                method: 'GET',
                headers: {
                    'Content-Type': 'application/json',
                    'Authorization': `Bearer ${token}`
                },
                credentials: 'include'
            });

            if (response.status === 401) {
                const newToken = await handleTokenRefresh();
                if (newToken) {
                    response = await fetch(`${API_BASE_URL}/applications`, {
                        method: 'GET',
                        headers: {
                            'Content-Type': 'application/json',
                            'Authorization': `Bearer ${newToken}`
                        },
                        credentials: 'include'
                    });
                }
            }

            if (response.ok) {
                const data = await response.json();
                setApplications(data);
            } else {
                if (response.status !== 401) {
                    setError('Failed to load applications.');
                }
            }
        } catch (err) {
            setError(err.message || 'Something went wrong.');
        } finally {
            setLoading(false);
        }
    };

    useEffect(() => {
        fetchApplications();
    }, []);

    return (
        <div className={styles.container}>
            <header className={styles.header}>
                <h2>All Applications</h2>
                <p>A complete history of your job applications.</p>
            </header>

            {error && <div className={styles.error}>{error}</div>}

            {loading ? (
                <p>Loading applications...</p>
            ) : applications.length === 0 ? (
                <div className={styles.emptyState}>No applications found.</div>
            ) : (
                <div className={styles.grid}>
                    {applications.map(app => (
                        <div key={app.id} className={styles.card}>
                            <div className={styles.cardHeader}>
                                <h3>{app.role}</h3>
                                <span className={`${styles.badge} ${styles[app.status.toLowerCase()] || ''}`}>
                                    {app.status}
                                </span>
                            </div>
                            <p className={styles.companyName}>{app.companyName}</p>
                            <p className={styles.dateInfo}>Applied: {app.appliedDate}</p>
                        </div>
                    ))}
                </div>
            )}
        </div>
    );
};
