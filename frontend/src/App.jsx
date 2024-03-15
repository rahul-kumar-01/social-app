import React from 'react';
import "./index.css";
import { BrowserRouter , Routes, Route} from "react-router-dom";

import Dashboard from './pages/Dashboard';
import SignIn from './pages/SignIn'
import SignUp from "./pages/SignUp";
import NotFound from "./pages/NotFound";
import NavBar from "./components/NavBar";
import Notification from "./pages/Notification";
import CreatePost from "./pages/CreatePost";
import Search from './pages/Search';
import Profile from './pages/Profile';
import Friends from './pages/Friends';


import { useSelector } from "react-redux";

export default function App() {
  const currentUser = useSelector((state) => state.user.currentUser);
  const isLoggedIn = Object.keys(currentUser).length > 0;


  return (
    <>
      <BrowserRouter>
        <Routes>

          <Route path="/" element={<SignIn/>} />
          <Route path="/sign-up" element={<SignUp/>}/>
    
          
          {isLoggedIn && 
            <Route path="/dashboard" element={<NavBar/>} >
              <Route path="/dashboard/home" element={<Dashboard/>}/>
              <Route path="/dashboard/create-post" element={<CreatePost/>}/>
              <Route path="/dashboard/search" element={<Search/>}/>
              <Route path="/dashboard/friends" element={<Friends/>}/>
              <Route path="/dashboard/notification" element={<Notification/>}/>
              <Route path="/dashboard/profile" element={<Profile/>}/>
              <Route path="*" element={<NotFound />} />
            </Route> 
          } 
          <Route path="*" element={<NotFound />} />   
        </Routes>
      </BrowserRouter>
    </>
  );
}
  






