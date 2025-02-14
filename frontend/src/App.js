import React, { useState } from "react";
import Navbar from "./components/Navbar";
import { BrowserRouter } from "react-router-dom";
import { Routes, Route } from "react-router-dom";
import Signin from "./components/Signin";
import Signup from "./components/Signup";
import { ToastContainer} from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';
import { Logincontext } from './context/Logincontext';
import Modal from './components/Modal';
import Home from "./components/Home";
import Admin from "./components/Adminpanel/Admin";
import Addmovie from "./components/Adminpanel/Addmovie";
function App() {
  const [isLoggedIn, setIsLoggedIn] = useState(false);
  const [modalopen, setModalopen] = useState(false);
  return (
    <BrowserRouter>
      {/* Navbar should be inside BrowserRouter */}
      <Logincontext.Provider value={{ isLoggedIn, setIsLoggedIn ,setModalopen}}>
      <Navbar />
      <Routes>
         <Route path="/" element={<Home />} /> 
        <Route path="Signin" element={<Signin />} />
        <Route path="Signup" element={<Signup />} />
         <Route path="admin" element={<Admin />} /> 
         <Route path="Add-movie" element={<Addmovie />} /> 
        
      </Routes>
      <ToastContainer theme="dark" />
       {modalopen && <Modal setModalopen={setModalopen}></Modal>}
       </Logincontext.Provider>
    </BrowserRouter>
  );
}

export default App;
