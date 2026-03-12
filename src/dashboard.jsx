import styles from "./dashboard.module.css"
export const Dashboard = () =>{
    return <div className={styles.mainContainer}>
    <h1>Welcome,{localStorage.getItem("name")}</h1>
    <h2>WE are Working</h2>
    </div>
}