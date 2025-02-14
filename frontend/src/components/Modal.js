import React from 'react';
import {RiCloseLine} from "react-icons/ri";
import "../css/Modal.css";
import { Link, useNavigate } from "react-router-dom";

export default function Modal({setModalopen}) {
    const navigate=useNavigate()
  return (
    <div className="darkbg" onClick={()=>setModalopen(false)}>
    <div className="centered">
        <div className='modal'>
        {/* modal header */}
      <div className="modalHeader">
        <h3 className="heading"> Confirm</h3>
      </div>
      <button className='closebtn' onClick={()=>setModalopen(false)}>
        <RiCloseLine> </RiCloseLine>
      </button>
      {/* modal content */}
      <div className="modalContent">
        Are you really want to Logout?
      </div>
        {/*modalAction */}
        <div className="modalActions">
            <div className="actionsContainer">
                <button className="logoutbtn" onClick={()=>{setModalopen(false); localStorage.clear();
                    navigate("/SignIn")}}>Log out</button>
                <button className="Cancelbtn" onClick={()=>setModalopen(false)}>Cancel</button>
            </div>
        </div>
    </div>
    </div></div>
    )
}
