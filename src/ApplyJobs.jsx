import { useState } from 'react';
import styles from './applyjobs.module.css';

import { API_BASE_URL } from './utils/constants';
import { handleTokenRefresh } from './utils/api';

export const ApplyJobs = () => {
    const [formData, setFormData] = useState({
        companyName: '',
        role: '',
        appliedDate: new Date().toISOString().split('T')[0] // today's date
    });
    const [loading, setLoading] = useState(false);
    const [message, setMessage] = useState({ type: '', text: '' });

    const handleChange = (e) => {
        setFormData({ ...formData, [e.target.name]: e.target.value });
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
        setLoading(true);
        setMessage({ type: '', text: '' });

        let token = localStorage.getItem('token');
        try {
            let response = await fetch(`${API_BASE_URL}/applications`, {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                    'Authorization': `Bearer ${token}`
                },
                credentials: 'include',
                body: JSON.stringify(formData)
            });

            if (response.status === 401) {
                const newToken = await handleTokenRefresh();
                if (newToken) {
                    response = await fetch(`${API_BASE_URL}/applications`, {
                        method: 'POST',
                        headers: {
                            'Content-Type': 'application/json',
                            'Authorization': `Bearer ${newToken}`
                        },
                        credentials: 'include',
                        body: JSON.stringify(formData)
                    });
                }
            }

            if (response.ok) {
                setMessage({ type: 'success', text: 'Application submitted successfully!' });
                setFormData({ companyName: '', role: '', appliedDate: new Date().toISOString().split('T')[0] });
            } else {
                if (response.status !== 401) {
                    setMessage({ type: 'error', text: 'Failed to submit application. Please try again.' });
                }
            }
        } catch (error) {
            setMessage({ type: 'error', text: error.message || 'Something went wrong.' });
        } finally {
            setLoading(false);
        }
    };

    return (
        <div className={styles.containerA}>
            <div className={styles.formCard}>
                <h2>Log New Application</h2>
                <p>Track a job you recently applied to.</p>

                {message.text && (
                    <div className={`${styles.message} ${styles[message.type]}`}>
                        {message.text}
                    </div>
                )}

                <form onSubmit={handleSubmit} className={styles.form}>
                    <div className={styles.inputGroup}>
                        <label htmlFor="companyName">Company Name</label>
                        <input
                            type="text"
                            id="companyName"
                            name="companyName"
                            value={formData.companyName}
                            onChange={handleChange}
                            required
                            placeholder="e.g. Google"
                        />
                    </div>

                    <div className={styles.inputGroup}>
                        <label htmlFor="role">Role / Position</label>
                        <input
                            type="text"
                            id="role"
                            name="role"
                            value={formData.role}
                            onChange={handleChange}
                            required
                            placeholder="e.g. Software Engineer"
                        />
                    </div>

                    <div className={styles.inputGroup}>
                        <label htmlFor="appliedDate">Applied Date</label>
                        <input
                            type="date"
                            id="appliedDate"
                            name="appliedDate"
                            value={formData.appliedDate}
                            onChange={handleChange}
                            required
                        />
                    </div>

                    <button type="submit" className={styles.submitBtn} disabled={loading}>
                        {loading ? 'Submitting...' : 'Apply Application'}
                    </button>
                </form>
            </div>
        </div>
    );
};
