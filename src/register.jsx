import styles from "./register.module.css"
import logo from "./assets/icons8-briefcase-128.png"
import googlelogo from "./assets/icons8-google-logo-94.png"
import { useState } from "react"
import { useNavigate } from "react-router-dom"
export const RegisterForm = () => {
    const [name, setName] = useState(``);
    const [email, setMail] = useState(``);
    const [pasword, setPassword] = useState(``); // Renaming internally to match logic below
    const [cnfPassword , setCnfPassword] = useState(``);
    const navigate = useNavigate();
    function checkregister(){
        if(pasword !== cnfPassword){
            alert("password is Not Matching !!!");
        }
        else if(name.trim() ===""){
            alert("name is empty");
        }
        else if(email === ""){
            alert("e-mail is empty");
        }
        else if(pasword ===""){
            alert("password is empty");
        }
        else{
        const obj = {
            fullName : name,
            email : email,
            password : pasword
        }
        fetchdata(obj);
        }
    }
    async function fetchdata(obj){
        try{
            const data = await fetch("https://jobtracker-backend-609f.onrender.com/auth/register",{
            method : "POST",
            headers : {
                "Content-Type" : "application/json"
            },
            body : JSON.stringify(obj)

        });
        const response = await data.json();
        if(data.ok){
            alert("registered Successfully");
            navigate("/login")
        }
        else{
            alert(response.message);
        }
        }
        catch(exception){
            alert("somethig went wrong");
            console.log(exception.message);
        }
    }
    return<div className={styles.mainContainer}>
                <div className={styles.backbtnContainer}>
                    <button className={styles.backbtn} onClick={()=>{
                        navigate("/");
                    }}>&larr;  Back to Home</button>
                </div>
         <div className={styles.registerbox}>
                <img src={logo}/>
                <h3>Create your account</h3>
                <p className={styles.advline}>Start tracking your job applications today<br/> and never miss an Interview</p>
                <p>Full Name</p>
                <input value = {name} onChange={(e)=>setName(e.target.value)}type="text" placeholder="full Name" />
                <p>Email</p>
                <input value={email} onChange={(e)=>setMail(e.target.value)} type="text" placeholder="UserName" />
                <p>Password</p>
                <input value={pasword} onChange={(e)=>setPassword(e.target.value)} type="text" placeholder="Password" />
                <p>Confirm Password</p>
                <input value={cnfPassword} onChange={(e)=>setCnfPassword(e.target.value)} type="password" placeholder="Confirm Password" />
                <button className={styles.signbtn} 
                onClick={checkregister}>Sign Up</button>
                <p className={styles.socialline}>---------------Social Sign up--------------</p>
                <button onClick={()=>{
                    window.location.href="https://jobtracker-backend-609f.onrender.com/register/oauth2/authorization/google";
                    // window.location.href = "http://localhost:8080/login/oauth2/code/google";
                }} className={styles.googlebtn}><img src={googlelogo}/>Continue with Google
                </button>

                <p className={styles.alreadyLine}>already have an account? <a onClick={()=>{
                    navigate("/login");
                }}>signin</a></p>
         </div>
    </div>
}