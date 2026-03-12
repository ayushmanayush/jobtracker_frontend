import { useEffect } from "react";
import styles from "./oauthsucceshandeler.module.css"
import { useNavigate } from "react-router-dom"
export const SuccessfullPage = ()=>
{   
    const navigate   = useNavigate();
    useEffect(()=>{
        const param = new URLSearchParams(window.location.search);
        const token = param.get("token");
        const name = param.get("name");
        if(token != null){
            localStorage.setItem("token",token);
            localStorage.setItem("name",name);
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