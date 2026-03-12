import MyPieChart from './Drawable';
import { LoginForm}  from './login';
import { LandingPage } from './landingPage';
import { RegisterForm } from './register';
import {Routes, Route} from "react-router-dom"
import { Dashboard } from './dashboard';
import { successfullPage } from './oauthsuccessHandeler';
import './App.css'
function App() {
  return (
    <>
      <div>
        <Routes>
          <Route path = "/" element={<LandingPage/>} />
          <Route path = "/login" element={<LoginForm/>} />
          <Route path = "/register" element={<RegisterForm/>} />
          <Route path='/dashboard' element={<Dashboard />}/>
          <Route path="/oauthsuccess" element={<successfullPage />} />
        </Routes>
      </div>
    </>
  );
}

export default App
