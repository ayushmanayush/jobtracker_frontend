import styles from "./landingPage.module.css";
import logo from "./assets/icons8-briefcase-128.png";
import { useNavigate } from "react-router-dom";


const Buttons = ({text , func, className}) =>{
    return <button className={className} onClick={func}>{text}</button>
}
function Alert(){
    alert("hello");
}


export const LandingPage = () => {
    const navigate = useNavigate();
    function NavigatetoLogin() {
        navigate("/login")
    }
    function NavigatetoRegister() {
        navigate("/register")
    }
    return (
        <div className={styles.maincontainer}>
            <nav className={styles.navBar}>
                <div className={styles.logo}>
                    <img src={logo} alt="JobTracker Logo" />
                    <span>JobTracker</span>
                </div>
                <div className={styles.btnContainer}>
                    <button onClick={NavigatetoLogin} className={styles.loginbtn}>Login</button>
                    <button onClick={NavigatetoRegister} className={styles.signbtn}>Sign Up</button>
                </div>
            </nav>

            <main className={styles.content}>
                <div className={styles.line}>
                    <h1>Track Applications.<br />Land the Job.</h1>
                    <p>Organize your job search with application tracking, interview reminders, and a powerful analytics dashboard.</p>
                </div>
                
                <button className={styles.getStartedbtn} onClick={NavigatetoRegister}>
                    Get Started Free
                </button>

                <div className={styles.funcContainer}>
                    <div>
                        <h4>Track Applications</h4>
                        <p>Keep your entire job search organized in one beautiful place with real-time status tracking.</p>
                    </div>
                    <div>
                        <h4>Interview Smart</h4>
                        <p>Stay ahead with organized schedules, meeting details, and automated countdowns.</p>
                    </div>
                    <div>
                        <h4>Deep Analytics</h4>
                        <p>Gain insights into your application performance with personalized success trends and metrics.</p>
                    </div>
                </div>
            </main>

            <footer className={styles.footer}>
                <div className={styles.logo}>
                    <img src={logo} alt="JobTracker Logo" />
                    <span>JobTracker</span>
                </div>
                <p className={styles.pp}>The ultimate companion for your professional journey.</p>
                <p>&copy; 2026 JobTracker. All rights reserved.</p>
            </footer>
        </div>
    );
}