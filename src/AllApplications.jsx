import { useEffect, useState } from 'react';
import styles from './openapplications.module.css';
import { fetchWithAuth } from './utils/api';

export const AllApplications = () => {
    const [applications, setApplications] = useState([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);

    const fetchApplications = async () => {
        try {
            const response = await fetchWithAuth('https://jobtracker-backend-609f.onrender.com/applications', {
                method: 'GET'
            });

            if (response.ok) {
                const data = await response.json();
                setApplications(data);
            } else {
                setError('Failed to load applications.');
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
