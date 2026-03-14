import React, { useState } from 'react';
import styles from './schedulemodal.module.css';
import { fetchWithAuth } from './utils/api';

export const ScheduleInterviewModal = ({ application, onClose, onSuccess }) => {
    const [formData, setFormData] = useState({
        applicationId: application.id,
        round: 1,
        scheduledAt: '',
        mode: 'ONLINE',
        meetingDetails: ''
    });
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState(null);

    const handleChange = (e) => {
        setFormData({ ...formData, [e.target.name]: e.target.value });
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
        setLoading(true);
        setError(null);

        try {
            // Format datetime-local to what backend expects
            let formattedDate = formData.scheduledAt;
            if(formattedDate.length === 16){
              formattedDate += ":00"; // append seconds if missing
            }

            const payload = {
                ...formData,
                scheduledAt: formattedDate
            };

            const response = await fetchWithAuth('https://jobtracker-backend-609f.onrender.com/interviews', {
                method: 'POST',
                body: JSON.stringify(payload)
            });

            if (response.ok) {
                onSuccess();
            } else {
                setError('Failed to schedule interview.');
            }
        } catch (err) {
            setError(err.message || 'Something went wrong.');
        } finally {
            setLoading(false);
        }
    };

    return (
        <div className={styles.modalOverlay}>
            <div className={styles.modalContent}>
                <h2>Schedule Interview</h2>
                <p>For {application.role} at {application.companyName}</p>
                
                {error && <div className={styles.error}>{error}</div>}

                <form onSubmit={handleSubmit} className={styles.form}>
                    <div className={styles.inputGroup}>
                        <label>Round Number</label>
                        <input
                            type="number"
                            name="round"
                            min="1"
                            value={formData.round}
                            onChange={handleChange}
                            required
                        />
                    </div>
                    
                    <div className={styles.inputGroup}>
                        <label>Date and Time</label>
                        <input
                            type="datetime-local"
                            name="scheduledAt"
                            value={formData.scheduledAt}
                            onChange={handleChange}
                            required
                        />
                    </div>
                    
                    <div className={styles.inputGroup}>
                        <label>Mode</label>
                        <select name="mode" value={formData.mode} onChange={handleChange}>
                            <option value="ONLINE">Online</option>
                            <option value="OFFLINE">Offline</option>
                        </select>
                    </div>

                    <div className={styles.inputGroup}>
                        <label>Meeting Link / Location</label>
                        <input
                            type="text"
                            name="meetingDetails"
                            value={formData.meetingDetails}
                            onChange={handleChange}
                            placeholder="e.g. Zoom link or Office address"
                            required
                        />
                    </div>

                    <div className={styles.actions}>
                        <button type="button" onClick={onClose} className={styles.cancelBtn}>Cancel</button>
                        <button type="submit" className={styles.submitBtn} disabled={loading}>
                            {loading ? 'Scheduling...' : 'Confirm'}
                        </button>
                    </div>
                </form>
            </div>
        </div>
    );
};
