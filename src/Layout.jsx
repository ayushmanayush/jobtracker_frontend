import React from 'react';
import { NavLink, Outlet, useNavigate } from 'react-router-dom';
import styles from './layout.module.css';
import logo from "./assets/icons8-briefcase-128.png"

export const Layout = () => {
    const navigate = useNavigate();

    React.useEffect(() => {
        const token = localStorage.getItem('token');
        if (!token) {
            console.warn("[AUTH] No token found in Layout. Redirecting to login.");
            navigate('/login');
        }
    }, [navigate]);
    
    const handleLogout = () => {
        localStorage.removeItem('token');
        localStorage.removeItem('name');
        navigate('/login');
    };

    return (
        <div className={styles.layoutContainer}>
            <aside className={styles.sidebar}>
                <div className={styles.sidebarHeader}>
                    <h2><img src={logo}/>Job Tracker</h2>
                </div>
                <nav className={styles.sidebarNav}>
                    <NavLink
                        to="/dashboard"
                        className={({ isActive }) => (isActive ? `${styles.navLink} ${styles.active}` : styles.navLink)}
                    >
                        Dashboard
                    </NavLink>
                    <NavLink
                        to="/apply-jobs"
                        className={({ isActive }) => (isActive ? `${styles.navLink} ${styles.active}` : styles.navLink)}
                    >
                        Apply for Jobs
                    </NavLink>
                    <NavLink
                        to="/open-applications"
                        className={({ isActive }) => (isActive ? `${styles.navLink} ${styles.active}` : styles.navLink)}
                    >
                        Open Applications
                    </NavLink>
                    <NavLink
                        to="/open-interviews"
                        className={({ isActive }) => (isActive ? `${styles.navLink} ${styles.active}` : styles.navLink)}
                    >
                        Open Interviews
                    </NavLink>
                    <NavLink
                        to="/all-applications"
                        className={({ isActive }) => (isActive ? `${styles.navLink} ${styles.active}` : styles.navLink)}
                    >
                        All Applications
                    </NavLink>
                </nav>
                <div className={styles.sidebarFooter}>
                    <button className={styles.logoutBtn} onClick={handleLogout}>Logout</button>
                </div>
            </aside>
            <main className={styles.mainContent}>
                <Outlet />
            </main>
        </div>
    );
};
