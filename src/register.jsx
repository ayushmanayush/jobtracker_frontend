import styles from "./register.module.css"
import logo from "./assets/icons8-briefcase-128.png"
import googlelogo from "./assets/icons8-google-logo-94.png"
import { useState, useEffect } from "react"
import { useNavigate } from "react-router-dom"
import { API_BASE_URL } from "./utils/constants"
export const RegisterForm = () => {
    const [name, setName] = useState(``);
    const [email, setMail] = useState(``);
    const [pasword, setPassword] = useState(``);
    const [cnfPassword, setCnfPassword] = useState(``);
    const navigate = useNavigate();

    useEffect(() => {
        const token = localStorage.getItem('token');
        if (token) {
            navigate('/dashboard');
        }
    }, [navigate]);

    function checkregister() {
        if (pasword !== cnfPassword) {
            alert("password is Not Matching !!!");
        }
        else if (name.trim() === "") {
            alert("name is empty");
        }
        else if (email === "") {
            alert("e-mail is empty");
        }
        else if (pasword === "") {
            alert("password is empty");
        }
        else {
            const obj = {
                fullName: name,
                email: email,
                password: pasword
            }
            fetchdata(obj);
        }
    }

    async function fetchdata(obj) {
        try {
            const data = await fetch(`${API_BASE_URL}/auth/register`, {
                method: "POST",
                headers: {
                    "Content-Type": "application/json"
                },
                credentials: 'include',
                body: JSON.stringify(obj)

            });
            const response = await data.json();
            if (data.ok) {
                alert("registered Successfully");
                navigate("/login")
            }
            else {
                alert(response.message);
            }
        }
        catch (exception) {
            alert("somethig went wrong");
            console.log(exception.message);
        }
    }

    return (
        <div className={styles.mainContainer}>
            <div className={styles.backbtnContainer}>
                <button className={styles.backbtn} onClick={() => {
                    navigate("/");
                }}><span>&larr;</span> Back to Home</button>
            </div>

            <div className={styles.registerbox}>
                <div className={styles.headerSection}>
                    <img className={styles.brandLogo} src={logo} alt="JobTracker Logo" />
                    <h3>Create your account</h3>
                    <p className={styles.advline}>Start tracking your job search today</p>
                </div>

                <div className={styles.inputGroup}>
                    <span className={styles.inputLabel}>Full Name</span>
                    <input value={name} onChange={(e) => setName(e.target.value)} type="text" placeholder="Enter Your Name" />
                </div>

                <div className={styles.inputGroup}>
                    <span className={styles.inputLabel}>Email Address</span>
                    <input value={email} onChange={(e) => setMail(e.target.value)} type="text" placeholder="Enter Your Email" />
                </div>

                <div className={styles.inputGroup}>
                    <span className={styles.inputLabel}>Password</span>
                    <input value={pasword} onChange={(e) => setPassword(e.target.value)} type="text" placeholder="Create a password" />
                </div>

                <div className={styles.inputGroup}>
                    <span className={styles.inputLabel}>Confirm Password</span>
                    <input value={cnfPassword} onChange={(e) => setCnfPassword(e.target.value)} type="password" placeholder="Repeat your password" />
                </div>

                <button className={styles.signbtn} onClick={checkregister}>Sign Up</button>

                <div className={styles.separator}>or register with</div>

                <button onClick={() => {
                    // window.location.href = `${API_BASE_URL}/oauth2/authorization/google`;
                    alert("Will be available shortly!!");
                }} className={styles.googlebtn}>
                    <img src={googlelogo} alt="Google" />
                    Google
                </button>

                <p className={styles.alreadyLine}>
                    Already have an account? 
                    <a onClick={() => navigate("/login")}>Sign in</a>
                </p>
            </div>
        </div>
    );
}