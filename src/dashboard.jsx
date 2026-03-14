import { useEffect, useState } from "react";
import styles from "./dashboard.module.css";
import { useNavigate } from "react-router-dom";
import { fetchWithAuth } from "./utils/api";

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
            const token = localStorage.getItem("token");
            if (!token) {
                navigate("/login");
                return;
            }

            try {
                const response = await fetchWithAuth("https://jobtracker-backend-609f.onrender.com/dashboard", {
                    method: "GET"
                });

                if (response.ok) {
                    const data = await response.json();
                    setStats(data);
                    console.log(data);
                } else {
                    setError("Failed to fetch dashboard data.");
                }
            } catch (err) {
                setError(err.message || "Something went wrong.");
            } finally {
                setLoading(false);
            }
        };

        fetchDashboardData();
    }, [navigate]);

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