import { useEffect, useState } from "react";
import styles from "./dashboard.module.css";
import { useNavigate } from "react-router-dom";
import { API_BASE_URL } from "./utils/constants";
import { handleTokenRefresh, handleUnauthorized } from "./utils/api";

export const Dashboard = () => {
    const [stats, setStats] = useState({
        totalApplications: 0,
        totalOffered: 0,
        totalRejected: 0,
        offerRate: 0,
        rejectionRate: 0
    });
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);
    const navigate = useNavigate();

    useEffect(() => {
    const fetchDashboardData = async () => {

        let token = localStorage.getItem("token");

        if (!token) {
            handleUnauthorized("No token found");
            return;
        }

        try {
            let response = await fetch(`${API_BASE_URL}/dashboard`, {
                method: "GET",
                headers: {
                    "Authorization": `Bearer ${token}`
                },
                credentials: 'include'
            });

            if (response.status === 401) {
                const newToken = await handleTokenRefresh();

                if (newToken) {
                    response = await fetch(`${API_BASE_URL}/dashboard`, {
                        method: "GET",
                        headers: {
                            "Authorization": `Bearer ${newToken}`
                        },
                        credentials: 'include'
                    });
                } else {
                    return;
                }
            }

            if (response.ok) {
                const data = await response.json();
                setStats(data);
            } else if (response.status !== 401) {
                setError("Failed to fetch dashboard data.");
            }

        } catch (err) {
            setError(err.message || "Something went wrong.");
        } finally {
            setLoading(false);
        }
    };

    fetchDashboardData();
}, []);

    return (
        <div className={styles.dashboardContainer}>
            <header className={styles.header}>
                <h1>Welcome, {localStorage.getItem("name") || "User"}</h1>
                <p>Here is your job application overview.</p>
            </header>

            {loading ? (
                <p>Loading analytics...</p>
            ) : error ? (
                <p className={styles.error}>{error}</p>
            ) : (
                <div className={styles.cardsGrid}>
                    <div className={styles.card}>
                        <h3>Total Applications</h3>
                        <p className={styles.cardNumber}>{stats.totalApplications}</p>
                    </div>
                    <div className={styles.card}>
                        <h3>Total Offered</h3>
                        <p className={styles.cardNumber}>{stats.totalOffered}</p>
                    </div>
                    <div className={styles.card}>
                        <h3>Total Rejected</h3>
                        <p className={styles.cardNumber}>{stats.totalRejected}</p>
                    </div>
                    <div className={styles.card}>
                        <h3>Offer Rate</h3>
                        <p className={styles.cardNumber}>{(stats.offerRate).toFixed(1)}%</p>
                    </div>
                    <div className={styles.card}>
                        <h3>Rejection Rate</h3>
                        <p className={styles.cardNumber}>{(stats.rejectionRate).toFixed(1)}%</p>
                    </div>
                </div>
            )}
        </div>
    );
};
