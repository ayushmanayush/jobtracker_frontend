import MyPieChart from './Drawable';
import { LoginForm } from './login';
import { LandingPage } from './landingPage';
import { RegisterForm } from './register';
import { Routes, Route, Outlet } from "react-router-dom"
import { Dashboard } from './dashboard';
import { SuccessfullPage } from './oauthsuccessHandeler';
import { Layout } from './Layout';
import { ApplyJobs } from './ApplyJobs';
import { OpenApplications } from './OpenApplications';
import { AllApplications } from './AllApplications';
import { OpenInterviews } from './OpenInterviews';
import './App.css'

function App() {
  return (
    <>
      <Routes>
        <Route element={<div className="public-wrapper"><Outlet /></div>}>
          <Route path="/" element={<LandingPage />} />
          <Route path="/login" element={<LoginForm />} />
          <Route path="/register" element={<RegisterForm />} />
          <Route path="/oauthsuccess" element={<SuccessfullPage />} />
        </Route>
        <Route element={<Layout />}>
          <Route path='/dashboard' element={<Dashboard />} />
          <Route path='/apply-jobs' element={<ApplyJobs />} />
          <Route path='/open-applications' element={<OpenApplications />} />
          <Route path='/open-interviews' element={<OpenInterviews />} />
          <Route path='/all-applications' element={<AllApplications />} />
        </Route>
      </Routes>
    </>
  );
}

export default App
