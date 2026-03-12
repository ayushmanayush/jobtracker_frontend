import styles from "./landingPage.module.css";
import logo from "./assets/icons8-briefcase-128.png";
import { useNavigate } from "react-router-dom";


const Buttons = ({text , func, className}) =>{
    return <button className={className} onClick={func}>{text}</button>
}
function Alert(){
    alert("hello");
}


export const LandingPage = () =>{
    const navigate = useNavigate();
    function NavigatetoLogin(){
    navigate("/login")
}
function NavigatetoRegister(){
navigate("/register")
}
    return (
        <div className={styles.maincontainer}>
            <div className={styles.navBar}>
                <h3 className={styles.logo}><img src={logo} />JobTracker</h3>
                <div className={styles.btnContainer}>
                <Buttons text="login" func = {NavigatetoLogin} className={styles.loginbtn}/>
                <Buttons text="Sign Up" func = {NavigatetoRegister} className={styles.signbtn}/>
                </div>
            </div>
            <div className={styles.content}>
                <div className={styles.line}>
                <h1>Track Applications. Schedule Interviews.<br/> Land the Job.</h1>
                <p>JobTracker helps you organize your job search with application tracking,<br/> interview reminders, and a powerful dashboard.</p>
                </div>
                <div className={styles.getstartedbtnContainer}>
                    <Buttons className={styles.getStartedbtn} text="Get Started" func={NavigatetoRegister} />
                </div>
                <div className={styles.funcContainer}>
                    <div>
                        <h4>Track Applications</h4>
                        <p>Keep all your job<br /> applications <br/>organized in<br /> one place with custom <br/>status tracking.</p>
                    </div>
                    <div>
                        <h4>Interview Reminders</h4>
                        <p>Never miss an interview <br/>with organized schedules<br/> and timely reminders.<br />with smart notifications</p>
                    </div>
                    <div>
                        <h4>Analytics</h4>
                        <p>Overview of your job applications,<br /> interviews, offers, and rejection trends.</p>
                    </div>
                </div>
            </div>
            <hr/>
            <div className={styles.footer}>
                <h6 className={styles.logo}><img src={logo} />JobTracker</h6>
                <p className={styles.pp}>Your all-in-one job application tracking platform</p>
                <p>&copy; 2026 JobTracker. All rights reserved.</p>
            </div>
            <hr />
        </div>
    );
}