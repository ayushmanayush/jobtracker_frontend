import { useEffect, useState } from 'react';
import styles from './openapplications.module.css'; // Reusing styles for consistency
import { fetchWithAuth } from './utils/api';

export const OpenInterviews = () => {
    const [interviews, setInterviews] = useState([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);

    const fetchInterviews = async () => {
        try {
            const response = await fetchWithAuth('https://jobtracker-backend-609f.onrender.com/interviews/open');
            if (response.ok) {
                const data = await response.json();
                setInterviews(data);
            } else {
                setError('Failed to fetch open interviews');
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
        try {
            const response = await fetchWithAuth(`https://jobtracker-backend-609f.onrender.com/interviews/${interviewId}`, {
                method: 'PATCH'
            });
            if (response.ok) {
                fetchInterviews(); // Refresh list
            } else {
                alert('Failed to mark interview as complete');
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
