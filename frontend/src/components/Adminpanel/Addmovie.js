import React, {  useEffect, useState } from 'react';
import "../../css/Addmovie.css";
import {toast } from 'react-toastify';
import { Link, useNavigate } from "react-router-dom";

export default function Addmovie() {
     const navigate=useNavigate();
    const [body,setBody]=useState("")
    const[image,setImage]=useState("")
    const[url,setUrl]=useState("")

    const notifyA=(msg)=>toast.error(msg);
    const notifyB=(msg)=>toast.success(msg);

useEffect(()=>{
if(url){
// saving post to mongodb
fetch("http://localhost:1222/Createpost", {
  method: "POST",
  headers: { "Content-Type": "application/json" ,
              "Authorization":"Bearer " + localStorage.getItem("jwt"),
  },

  body: JSON.stringify({  body,pic:url})
})
.then((res) => res.json())
.then((data) => {
if(data.error){
  notifyA(data.error)
} else{
  notifyB("data successfully posted");
   navigate("/admin")
}

})
.catch((error) => {
console.error("Error uploading image:", error);
});
}
},[url])


// posting image to cloudainry
const postdetails = () => {
  console.log(body, image);

  const data = new FormData();
  data.append("file", image);
  data.append("upload_preset", "insta-clone");
  data.append("cloud_name", "cantacoder");
  if (!body.trim() && !image.trim()) {
    notifyA("All fields are required");
    return;
  }
  fetch("https://api.cloudinary.com/v1_1/cantacoder/image/upload", {
    method: "POST",
    body: data, // Correct: Passing the actual FormData object
  })
    .then((res) => res.json())
    .then((data) => {
      setUrl(data.url); // Logs the response from Cloudinary
      // if (data.secure_url) {
      //   alert("Image uploaded successfully!");
      // } else {
      //   alert("Image upload failed!");
      // }
    })
    .catch((error) => {
      console.error("Error uploading image:", error);
      alert("An error occurred during the upload.");
    });


};

    const loadfile=(event)=>{
        var output = document.getElementById('output');
        output.src = URL.createObjectURL(event.target.files[0]);
        output.onload = function() {
            URL.revokeObjectURL(output.src) // free memory
    }
}
  return (
    <div className='createpost'>
        {/* header */}
      <div className='post-header'>
        <h4 style={{margin:"3px auto"}}>Add movie </h4>
        <button id="post-btn" onClick={()=>{postdetails()}}>Insert movie</button>
      </div>
      {/* image preview */}
      <div className='main-div'>
      <img id="output" src="https://cdn-icons-png.flaticon.com/512/1160/1160358.png"/>
        <input type='file' accept="image/*" onChange={(event)=>{loadfile(event);setImage(event.target.files[0])}}/>
      </div>
      {/* details */}
      <div className='details'>
        <div className='card-header'>
            {/* <div className='card-pic'>
                <img src="https://images.unsplash.com/photo-1698610654585-45d30dc86add?w=600&auto=format&fit=crop&q=60&ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxzZWFyY2h8OHx8c3F1YXJlJTIwaW1hZ2V8ZW58MHx8MHx8fDA%3D" alt=""/>
            </div> */}
            <h5>Add movie rate</h5>
        </div>
        <textarea type="text" value={body} onChange={(e)=>{setBody(e.target.value)}} placeholder='write a caption'></textarea>

      </div>
    </div>
  )
}
