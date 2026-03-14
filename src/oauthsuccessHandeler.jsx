import { useEffect } from "react";
import styles from "./oauthsucceshandeler.module.css"
import { useNavigate } from "react-router-dom"
export const SuccessfullPage = () => {
    const navigate = useNavigate();
    useEffect(() => {
        const param = new URLSearchParams(window.location.search);
        const token = param.get("token") || param.get("accessToken");
        const name = param.get("name") || param.get("fullName");
        if (token != null) {
            localStorage.setItem("token", token);
            if (name) localStorage.setItem("name", name);
            setTimeout(() => {
                navigate("/dashboard")
            }, 1500);
        }
        else {
            navigate("/login")
        }
    }, [navigate]);
    return <div className={styles.MainBody}>
        <h1>Login SuccessFull </h1>
    </div>
}