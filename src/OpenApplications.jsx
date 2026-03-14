import { useEffect, useState } from 'react';
import styles from './openapplications.module.css';
import { ScheduleInterviewModal } from './ScheduleInterviewModal';
import { fetchWithAuth } from './utils/api';

export const OpenApplications = () => {
    const [applications, setApplications] = useState([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);
    const [schedulingApp, setSchedulingApp] = useState(null);

    const fetchApplications = async () => {
        try {
            const response = await fetchWithAuth('https://jobtracker-backend-609f.onrender.com/applications', {
                method: 'GET'
            });

            if (response.ok) {
                const data = await response.json();
                // Filter for open applications
                const openApps = data.filter(app => 
                    ['APPLIED', 'INTERVIEW', 'OFFERED'].includes(app.status)
                );
                setApplications(openApps);
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

    const handleStatusChange = async (appId, newStatus) => {
        try {
            const response = await fetchWithAuth(`https://jobtracker-backend-609f.onrender.com/applications/${appId}/status`, {
                method: 'PATCH',
                body: JSON.stringify({ status: newStatus })
            });

            if (response.ok) {
                fetchApplications(); // Refresh list to reflect changes
            } else {
                alert('Failed to update status.');
            }
        } catch (err) {
            alert('Error updating status: ' + err.message);
        }
    };

    const getAllowedStatuses = (currentStatus) => {
        switch (currentStatus) {
            case 'APPLIED': return ['APPLIED', 'INTERVIEW', 'REJECTED'];
            case 'INTERVIEW': return ['INTERVIEW', 'OFFERED', 'REJECTED'];
            case 'OFFERED': return ['OFFERED', 'ACCEPTED', 'DECLINED'];
            default: return [currentStatus];
        }
    };

    return (
        <div className={styles.container}>
            <header className={styles.header}>
                <h2>Open Applications</h2>
                <p>Manage your active job applications.</p>
            </header>

            {error && <div className={styles.error}>{error}</div>}

            {loading ? (
                <p>Loading applications...</p>
            ) : applications.length === 0 ? (
                <div className={styles.emptyState}>No open applications found. Apply for some jobs!</div>
            ) : (
                <div className={styles.grid}>
                    {applications.map(app => (
                        <div key={app.id} className={styles.card}>
                            <div className={styles.cardHeader}>
                                <h3>{app.role}</h3>
                                <span className={`${styles.badge} ${styles[app.status.toLowerCase()]}`}>
                                    {app.status}
                                </span>
                            </div>
                            <p className={styles.companyName}>{app.companyName}</p>
                            <p className={styles.dateInfo}>Applied: {app.appliedDate}</p>

                                <div className={styles.statusSection}>
                                    <label>Status:</label>
                                    <select 
                                        value={app.status} 
                                        onChange={(e) => handleStatusChange(app.id, e.target.value)}
                                        className={styles.statusDropdown}
                                        disabled={app.hasActiveInterview}
                                        title={app.hasActiveInterview ? "Cannot change status while an interview is active" : ""}
                                    >
                                        {getAllowedStatuses(app.status).map(status => (
                                            <option key={status} value={status}>{status}</option>
                                        ))}
                                    </select>
                                    {app.hasActiveInterview && <span className={styles.statusLockHint}>🔒 Active Interview</span>}
                                </div>
                            <div className={styles.cardFooter}>
                                {app.status === 'INTERVIEW' && !app.hasActiveInterview && (
                                    <button 
                                        className={styles.scheduleBtn}
                                        onClick={() => setSchedulingApp(app)}
                                    >
                                        Schedule Interview
                                    </button>
                                )}
                                {app.hasActiveInterview && (
                                    <p className={styles.interviewPendingInfo}>Complete the active interview to change status.</p>
                                )}
                            </div>
                        </div>
                    ))}
                </div>
            )}

            {schedulingApp && (
                <ScheduleInterviewModal 
                    application={schedulingApp} 
                    onClose={() => setSchedulingApp(null)}
                    onSuccess={() => {
                        setSchedulingApp(null);
                        alert('Interview scheduled successfully!');
                        // Optionally refresh data if need be, but no change in application status here 
                        // It just attaches an interview to it
                    }}
                />
            )}
        </div>
    );
};
