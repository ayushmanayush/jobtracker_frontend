import styles from "./login.module.css"
import logo from "./assets/icons8-briefcase-128.png"
import googlelogo from "./assets/icons8-google-logo-94.png"
import { useState, useEffect } from "react"
import { useNavigate } from "react-router-dom"
import { API_BASE_URL } from "./utils/constants"
import { extractToken, extractName } from "./utils/api"

export const LoginForm = () => {
    const navigate = useNavigate();

    useEffect(() => {
        const token = localStorage.getItem('token');
        if (token) {
            navigate('/dashboard');
        }
    }, [navigate]);

    function checkdata() {
        if (email === "") {
            alert("username Cannot be empty !!!!");
        }
        else if (pasword === "") {
            alert("Password cannot be empty !!!!");
        }
        else {
            const obj = {
                username: email,
                password: pasword
            }
            FetchData(obj);
        }
    }
    async function FetchData(obj) {
        try {
            const data = await fetch(`${API_BASE_URL}/auth/login`, {
                method: "POST",
                headers: {
                    "Content-Type": "application/json"
                },
                credentials: 'include',
                body: JSON.stringify(obj)
            });
            const response = await data.json();
            // console.log("[LOGIN] Response from backend:", response);

            if (data.ok) {
                const token = extractToken(response);
                const name = extractName(response);
                
                // console.log(`[LOGIN] Extracted: Token=${token ? 'YES' : 'NO'}, Name=${name || 'NONE'}`);

                if (token) {
                    localStorage.setItem("token", token);
                    if (name) localStorage.setItem("name", name);
                    alert("Login Successful");
                    navigate("/dashboard");
                } else {
                    console.error("[LOGIN] Success status but no token found in response!");
                    alert("Authentication succeeded but session token was missing.");
                }
            } else {
                alert(response.message || "Login failed");
            }
        }
        catch (exception) {
            console.error("[LOGIN] Crash:", exception.message);
            alert("something went wrong");
        }
    }
    const [email, setMail] = useState(``);
    const [pasword, setPassword] = useState(``);
    return (
        <div className={styles.mainContainer}>
            <div className={styles.backbtnContainer}>
                <button className={styles.backbtn} onClick={() => {
                    navigate("/");
                }}><span>&larr;</span> Back to Home</button>
            </div>
            
            <div className={styles.loginbox}>
                <div className={styles.headerSection}>
                    <img className={styles.brandLogo} src={logo} alt="JobTracker Logo" />
                    <h3>Welcome back</h3>
                    <p className={styles.loginline}>Sign in to your account to continue</p>
                </div>

                <div className={styles.inputGroup}>
                    <span className={styles.inputLabel}>Username</span>
                    <input 
                        value={email} 
                        onChange={(e) => { setMail(e.target.value) }} 
                        type="text" 
                        placeholder="Enter your email" 
                    />
                </div>

                <div className={styles.inputGroup}>
                    <span className={styles.inputLabel}>Password</span>
                    <input 
                        value={pasword} 
                        onChange={(e) => { setPassword(e.target.value) }} 
                        type="password" 
                        placeholder="Enter your password" 
                    />
                </div>

                <button className={styles.loginbtn} onClick={checkdata}>Sign In</button>

                <div className={styles.separator}>or continue with</div>

                <button onClick={() => {
                    // window.location.href = `${API_BASE_URL}/oauth2/authorization/google?state=LOCAL`
                    alert("Will be available shortly!!");
                }} className={styles.googlebtn}>
                    <img src={googlelogo} alt="Google" />
                    Google
                </button>

                <p className={styles.newaccountline}>
                    Don't have an account? 
                    <a onClick={() => navigate("/register")}>Sign up</a>
                </p>
            </div>
        </div>
    );
}