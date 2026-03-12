import styles from "./login.module.css"
import logo from "./assets/icons8-briefcase-128.png"
import googlelogo from "./assets/icons8-google-logo-94.png"
import { useState } from "react"
import { useNavigate } from "react-router-dom"
export const LoginForm = () =>{
    function checkdata(){
        if(email === ""){
            alert("username Cannot be empty !!!!");
        }
        else if(pasword === ""){
            alert("Password cannot be empty !!!!");
        }
        else{
            const obj = {
                username : email,
                password : pasword
            }
            FetchData(obj);
        }
    }
    async function FetchData(obj){
        try{
        const data = await fetch("https://jobtracker-backend-609f.onrender.com/auth/login",{
            method : "POST",
            headers : {
                "Content-Type" : "application/json"
            },
            body : JSON.stringify(obj)
        });
        const response =await data.json();
        if(data.ok){
            alert("login Successfull");
            localStorage.setItem("token",response.accessToken);
            localStorage.setItem("name",response.fullName);
            navigate("/Dashboard");
        }
        }
    catch(exception){
        console.log(exception.message);
        alert("something went wrong");
    }
    }
    const navigate = useNavigate();
    const [email, setMail] = useState(``);
    const [pasword , setPassword] = useState(``);
    return <div className={styles.mainContainer}>
        <div className={styles.backbtnContainer}>
            <button className={styles.backbtn} onClick={()=>{
                navigate("/");
            }}>&larr;  Back to Home</button>
        </div>
        <div className={styles.loginbox}>
            <img src={logo}/>
            <h3>Welcome back</h3>
            <p className={styles.loginline}>Sign in to your account to Continue</p>
            <p className={styles.orelseline}>---------------------------------</p>
            <p>Username :</p>
            <input value={email} onChange={(e)=>{setMail(e.target.value)}} type="text" placeholder="Enter your Email"/>
            <p>Password : </p>
            <input value={pasword} onChange={(e)=>{setPassword(e.target.value)}} type="password" placeholder="Enter your Password"  />
            <button className={styles.loginbtn} onClick={checkdata}>Sign In</button>
            <p>-----------------------------------------------------------</p>
            <button onClick={()=>{
                window.location.href="https://jobtracker-backend-609f.onrender.com/oauth2/authorization/google"
            }} className={styles.googlebtn}><img src={googlelogo}/>Continue with Google</button>
            <p className={styles.newaccountline}>Don't have an Account? <a onClick={()=>{
                navigate("/register")
            }}>SignUp</a></p>

        </div>
        </div>
}