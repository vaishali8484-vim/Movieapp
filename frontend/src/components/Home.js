import React, { useEffect, useState } from 'react';
import "../css/Home.css";
import { Link, useNavigate } from "react-router-dom";

export default function Home() {
  var piclink="https://cdn-icons-png.flaticon.com/128/149/149071.png"
  const navigate = useNavigate();
  const[data,setData]=useState([]);
  const[comment,setComment]=useState("");
  const[show,setShow]=useState(false);
  const[item,setItem]=useState([])
  
  useEffect(()=>{
    
    const token = localStorage.getItem("jwt")
    if(!token){
        navigate("/SignUp")
    }

    // Fetching All Post
    fetch("http://localhost:1222/allposts", {
      
      headers: { "Authorization": "Bearer " + localStorage.getItem("jwt") },
      
    }).then(res=>res.json())
    // .then(result=>console.log(result))
    .then(result=>setData(result))
    .catch(err=>console.log(err))
    },[]);

    // To show and hide comments
    const toggleComment=(posts)=>{
      if(show){
        setShow(false);
      }
      else{
        setShow(true);
        setItem(posts);
        console.log(item);
      }
    }

    
   
   
    const likepost=(id)=>{
      fetch("http://localhost:1222/like",{
        method:"put",
        headers:{
          "Content-Type":"application/json",
          "Authorization": "Bearer " + localStorage.getItem("jwt")},
          body:JSON.stringify({
            postId:id
          })
      })
      .then(res=>res.json())
     .then((result)=>{
      const newData=data.map((posts)=>{
        if(posts._id==result._id){
          return(result)
        }else{
          return(posts)
        }
      })
      setData(newData)
      console.log(result)});
    // .then(result=>setData(result))
    // .catch(err=>console.log(err))
     };
     const Unlikepost=(id)=>{
      fetch("http://localhost:1222/Unlike",{
        method:"put",
        headers:{
          "Content-Type":"application/json",
          "Authorization": "Bearer " + localStorage.getItem("jwt")},
          body:JSON.stringify({
            postId:id
          })
      })
      .then(res=>res.json())
     .then((result)=>{
      const newData=data.map((posts)=>{
        if(posts._id==result._id){
          return(result)
        }else{
          return(posts)
        }
      })
      setData(newData)
      console.log(result)})
    }

    // function to make comment
    
    const makeComment=(text,id)=>{
       // Check if the comment is empty or just spaces
  if (!text || text.trim() === "") {
    console.log("Cannot add an empty comment");
    return; // Stop execution if the comment is empty
  }

      // console.log(comment)
      fetch("http://localhost:1222/Comment",{
        method:"put",
        headers:{
          "Content-Type":"application/json",
          "Authorization": "Bearer " + localStorage.getItem("jwt")},
          body:JSON.stringify({
            text:text,
            postId:id,
          })
      })
      .then(res=>res.json())
     .then((result)=>{
      const newData=data.map((posts)=>{
        if(posts._id==result._id){
          return(result);
        }else{
          return(posts);
        }
      })
      setData(newData); // Update posts in the main view
      setItem(result); // Update the `item` in the modal
       setComment({ ...comment, [id]: "" }); // Clear the comment input for this post
       console.log(result)
    })
    .catch((err) => console.log(err));
    }
    
  
    

  return (
    <div className='home'>
      {/* card */}
      {data.map((posts)=>{
        // console.log(posts)
        return(
<div className='card'>
        {/* card header */}
        <div className='card-header'>
          
        </div>
        {/* card image */}
        <div className='card-image'> 
          <img src={posts.photo} alt=""/>
        </div>
        {/* card content */}
        <div className='card-content'>
          {posts.likes.includes(JSON.parse(localStorage.getItem("user"))._id)
          ?(<span className="material-symbols-outlined material-symbols-outlined-red" onClick={()=>{Unlikepost(posts._id)}}>favorite</span>):
          (<span className="material-symbols-outlined" onClick={()=>{likepost(posts._id)}}>favorite</span>)
        }
        
        
        <p>{posts.likes.length} Likes</p>
        <p>{posts.body}</p>
        <p style={{fontWeight:"bold",cursor:"pointer"}} onClick={()=>{toggleComment(posts)}}>View all {posts.comments.length} review</p>
        </div>
        {/* comment */}
        <div className='add-comment'>
        <span className="material-symbols-outlined">mood</span>
        <input type="text" placeholder='add a review' value={comment[posts._id] || ""} onChange={(e) => setComment({ ...comment, [posts._id]: e.target.value })} />
        <button className='comment' onClick={()=>{makeComment(comment[posts._id],posts._id)}}>post</button>
        </div>


      </div>
        )
      })}
     
     
      {/* show comments */}
      { show && (
        <div className="showComment">
        <div className="container">
          <div className="postPic">
          <img src={item.photo} alt="" />
          </div>
          <div className="details">
            {/* card-header */}
            <div className="card-header" style={{borderBottom:"1px solid #00000029"}}>
            {/* <div className='card-pic'>
            <img src="https://images.unsplash.com/photo-1698610654585-45d30dc86add?w=600&auto=format&fit=crop&q=60&ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxzZWFyY2h8OHx8c3F1YXJlJTIwaW1hZ2V8ZW58MHx8MHx8fDA%3D" alt=""/>
          </div>
          <h5>{item.postedby.name}</h5> */}
            </div>
          
          {/* comment-section */}
          <div className="comment-section" style={{borderBottom:"1px solid #00000029"}}>

          {item.comments.map((comment)=>{
            return (
           <p className="comm">
            <span className="commenter" style={{fontWeight:"bolder"}}>{comment.postedby.name}</span>
            <span className="commentText">  {comment.comment}</span>
          </p>
            )
          })}
          
         
          </div>
          {/* card content */}
        <div className='card-content'>
          <p>{item.likes.length} Likes</p>
        <p>{item.body}</p>
        </div>
          {/* comment */}
        <div className='add-comment'>
        <span className="material-symbols-outlined">mood</span>
        <input type="text" placeholder='add a comment' value={comment[item._id] || ""}
            onChange={(e) => setComment({ ...comment, [item._id]: e.target.value })}/>
        <button className='comment' onClick={() => makeComment(comment[item._id], item._id)} >post</button>
        </div>
        
        </div>
      </div>
      <div className="close-comment">
      <span className="material-symbols-outlined material-symbols-outlined-comment" onClick={()=>{toggleComment()}}>close</span>
      </div>
      </div>)
      }

      
  </div>
  )
}

