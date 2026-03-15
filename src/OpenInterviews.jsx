import { useEffect, useState } from 'react';
import styles from './openapplications.module.css'; // Reusing styles for consistency
import { API_BASE_URL } from './utils/constants';
import { handleTokenRefresh } from './utils/api';

export const OpenInterviews = () => {
    const [interviews, setInterviews] = useState([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);

    const fetchInterviews = async () => {
        let token = localStorage.getItem('token');
        try {
            let response = await fetch(`${API_BASE_URL}/interviews/open`, {
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
                    response = await fetch(`${API_BASE_URL}/interviews/open`, {
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
                setInterviews(data);
            } else {
                if (response.status !== 401) {
                    setError('Failed to fetch open interviews');
                }
            }
        } catch (err) {
            setError('An error occurred while fetching interviews');
        } finally {
            setLoading(false);
        }
    };

    useEffect(() => {
        fetchInterviews();
    }, []);

    const handleComplete = async (interviewId) => {
        let token = localStorage.getItem('token');
        try {
            let response = await fetch(`${API_BASE_URL}/interviews/${interviewId}`, {
                method: 'PATCH',
                headers: {
                    'Content-Type': 'application/json',
                    'Authorization': `Bearer ${token}`
                },
                credentials: 'include',
                body: JSON.stringify({})
            });

            if (response.status === 401) {
                const newToken = await handleTokenRefresh();
                if (newToken) {
                    response = await fetch(`${API_BASE_URL}/interviews/${interviewId}`, {
                        method: 'PATCH',
                        headers: {
                            'Content-Type': 'application/json',
                            'Authorization': `Bearer ${newToken}`
                        },
                        credentials: 'include',
                        body: JSON.stringify({})
                    });
                }
            }

            if (response.ok) {
                fetchInterviews(); // Refresh list
            } else {
                if (response.status !== 401) {
                    alert('Failed to mark interview as complete');
                }
            }
        } catch (err) {
            alert('An error occurred');
        }
    };

    if (loading) return <div className={styles.loading}>Loading open interviews...</div>;
    if (error) return <div className={styles.error}>{error}</div>;

    return (
        <div className={styles.container}>
            <header className={styles.header}>
                <h1 className={styles.title}>Open Interviews</h1>
                <p className={styles.subtitle}>Track your upcoming and scheduled interviews</p>
            </header>

            {interviews.length === 0 ? (
                <div className={styles.emptyState}>No open interviews scheduled at the moment.</div>
            ) : (
                <div className={styles.grid}>
                    {interviews.map(interview => (
                        <div key={interview.id} className={styles.card}>
                            <div className={styles.cardHeader}>
                                <h3 className={styles.companyName}>{interview.companyName}</h3>
                                <span className={styles.badge}>Round {interview.round}</span>
                            </div>
                            <div className={styles.cardBody}>
                                <p><strong>Scheduled:</strong> {new Date(interview.scheduledAt).toLocaleString()}</p>
                                <p><strong>Mode:</strong> {interview.mode}</p>
                                <p><strong>Details:</strong> {interview.meetingDetails}</p>
                            </div>
                            <div className={styles.cardFooter}>
                                <button 
                                    className={styles.scheduleBtn}
                                    onClick={() => handleComplete(interview.id)}
                                >
                                    Mark as Completed
                                </button>
                            </div>
                        </div>
                    ))}
                </div>
            )}
        </div>
    );
};
