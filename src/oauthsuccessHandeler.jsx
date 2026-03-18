import { useEffect } from "react";
import styles from "./oauthsucceshandeler.module.css"
import { useNavigate } from "react-router-dom"
export const SuccessfullPage = () => {

    const navigate = useNavigate();
    useEffect(() => {
        const param = new URLSearchParams(window.location.search);
        const token = decodeURIComponent(param.get("token"));
        const name = decodeURIComponent(param.get("name"));
        if(token !== null && token !== undefined){
            localStorage.setItem("token", token);
            
        }
        else{
            console.log("no token found")
            navigate("/login");
            return;
        }
            if(name !== null && name !== undefined){localStorage.setItem("name", name);}
            console.log("[OAUTH] Session stored. Redirecting to dashboard...");
            navigate("/dashboard");
    }, [navigate]);
    return <div className={styles.MainBody}>
        <h1>Login SuccessFull....... </h1>
    </div>
}