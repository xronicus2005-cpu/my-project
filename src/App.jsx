import Home from './pages/Home'
import IT from './pages/IT'
import HandWork from './pages/HandWork'
import Teach from './pages/Teach'
import Elektr from './pages/Electr'
import Cars from './pages/Cars'

import Profile from './pages/Profile'
import Settings from './pages/Settings'
import CreateWork from './pages/CreateWork'

import GetInfoFromUser from './components/GetInfoFromUser'
import ProfileSettings from './components/ProfileSettings'

import UpdateJobs from './components/UpdateJobs'
import JobDetails from './components/WindowForJobCards'

import Chat from "../src/components/Chat"
import UserChat from './pages/UserChat'

import './App.css'
import { Routes, Route } from 'react-router-dom'
import "react-toastify/dist/ReactToastify.css";
import "slick-carousel/slick/slick.css"; 
import "slick-carousel/slick/slick-theme.css";

import { ToastContainer } from "react-toastify";

import { LoaderProvider } from './context/LoaderContext'
import { useInitLoader } from './hooksForBackend/useIntiLoader'
import Loader from "../src/components/Loader"

const AppContent = () => {

  useInitLoader()

  return(
    <>
      <Loader/>

      <Routes>
      
      <Route path="/" element={<Home/>}/>
      <Route path='/IT' element={<IT/>}/>
      <Route path='/HandWork' element={<HandWork/>}/>
      <Route path='/Teach' element={<Teach/>}/>
      <Route path='/Elektr' element={<Elektr/>}/>
      <Route path='/Cars' element={<Cars/>}/>

      <Route path='/Profile' element={<Profile/>}/>
      <Route path='/Settings' element={<Settings/>}/>
      <Route path='/Settings/ProfileSettings' element={<ProfileSettings/>}/>
      
      <Route path='/Profile/CreateWork' element={<CreateWork/>}/>
      
      
      <Route path='/registration' element={<GetInfoFromUser/>}/>
      <Route path='/updateJobs/:id' element={<UpdateJobs/>}/>
      <Route path='/job/:id' element={<JobDetails/>}/>
      
      <Route path='/chat/:id' element={<Chat/>}/>
      
      <Route path='/chat/' element={<UserChat/>}/>
      


      

    </Routes>

    <ToastContainer position="top-right" />

    </>
  )
}

function App() {

  return (
    <>
      <LoaderProvider>
        <AppContent/>
      </LoaderProvider>
    </>

  )
}

export default App
