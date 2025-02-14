import React, { useContext } from 'react';
import logo from '../image/logo.jpg';
import '../css/Navbar.css';
import { Link, useNavigate } from "react-router-dom";
import { Logincontext } from '../context/Logincontext';




export default function Navbar(login) {
  const navigate = useNavigate()
  const{setModalopen}=useContext(Logincontext)
  const loginstatus=()=>{
    const token = localStorage.getItem("jwt")
    // console.log(token)
    if(login && token){
      return[
        <>
       
        <Link to="{}">
        <button className="primary-btn" onClick={()=>setModalopen(true)}>Log Out</button></Link>
        </>
      ]
    }else{
    return[
      <>
      <Link to="/SignUp"><li>SignUp</li></Link>
      <Link to="/SignIn"><li>SignIn</li></Link>
      </>
    ]
    }
  }
  
  return (
    <div>
      <div className='navbar'>
        <img src={logo} alt="" onClick={()=>{navigate("/")}} />
       <ul className='nav-menu'>
       {loginstatus()}
       
       </ul>
      </div>
    </div>
  )
}
