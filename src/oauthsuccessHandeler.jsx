import { useEffect } from "react";
import styles from "./oauthsuccessHandeler"
import { useNavigate } from "react-router-dom"
export const successfullPage = ()=>
{   
    const navigate   = useNavigate();
    useEffect(()=>{
        const param = new URLSearchParams(window.location.search);
        const token = param.get("token");
        if(token != null){
            localStorage.setItem("token",token);
            setTimeout(()=>{
                navigate("/dashboard")
            },1500);
        }
        else{
            navigate("/login")
        }
    },[navigate]);
    return <div className={styles.MainBody}>
        <h1>Login SuccessFull </h1>
    </div>
}