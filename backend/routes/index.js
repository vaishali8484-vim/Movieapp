var express = require('express');
var router = express.Router();
const signin =require('../models/user')
const post =require("../models/post")
const Joi = require('joi');
const validator = require('express-joi-validation').createValidator({});
const bcrypt = require('bcrypt');
var jwt = require('jsonwebtoken');


const requireLogin = async (req, res, next) => {
  try {
    
    const authHeader = req.headers.authorization;
    if (!authHeader || !authHeader.startsWith("Bearer ")) {
      throw new Error("Authorization header missing or incorrect");
    }

    const token = authHeader.split(" ")[1]; // Extract token
    const decoded = jwt.verify(token, process.env.JWT_SECRET || "your_secret_key"); // Verify token

    // Fetch the user details from the database using the ID
    const user = await signin.findById(decoded.id).select("-password"); // Exclude the password
    if (!user) {
      throw new Error("User not found");
    }

    req.user = user; // Attach the user to the request
    next();
  } catch (err) {
    res.status(401).json({
      status: "error",
      message: err.message,
    });
  }
};

const querySchema = Joi.object({
  name: Joi.string().required(),
  email: Joi.string().required(),
  username: Joi.string().required(),
  password: Joi.string().required(),
})
/* GET home page. */
router.get('/', function(req, res, next) {
  res.render('index', { title: 'Express' });
});

router.post('/add',validator.body(querySchema), async function(req, res, next) {
  try{
    const hashedPassword = await bcrypt.hash(req.body.password, 10);
    const userData = {
      name: req.body.name,
      email: req.body.email,
      username: req.body.username,
      password: hashedPassword, // Store the hashed password
    };
    const data=await signin.create(userData)
    res.status(201).json({
      status:"success",
      data
    })
    
  }
  catch(err){
    res.status(401).json({
      status:"error",
      err
    })
  }
});

router.post('/SignIn', function(req, res, next) {
  const  {email,password}=req.body;
  
  if(!email|| !password){
    return res.status(422).json({message:"please add email and password"});
  }
  signin.findOne({email:email}).then((savedUser)=>{
    if(!savedUser){
      return res.status(422).json({error:"Invalid email"})
    }
     console.log(savedUser)
    bcrypt.compare(password,savedUser.password).
    then((match)=>{
      if(match){
        const token = jwt.sign(
          { id: savedUser._id, email: savedUser.email }, // Payload
          process.env.JWT_SECRET || "your_secret_key", // Secret key
          )
          const{_id,name,email,username}=savedUser
          // console.log('Token:', token);

           console.log({token,user:{_id,name,email,username}});

           return res.status(200).json({message:"Sign in successfully" , token:token,user: { _id, name, email, username }})
      }else{
        return res.status(422).json({error:"Invalid password"})
      }

    })
    .catch(err=>console.log(err))
  })
});

router.post('/Createpost',requireLogin,async(req, res, next) =>{
  try{
 const {body,pic}=req.body;
 if(!body || !pic){
  return res.status(422).json({error:"please add all the fields"});
 }
 console.log("Logged-in user:", req.user);
//  req.user
//   res.json("ok")

   // Create a new post
   const newpost = new post({
    body,        // Title of the post
    photo:pic,      // Body of the post
    postedby: req.user._id  // Link the post to the logged-in user
  });

  // Save the post to the database
  const savedPost = await newpost.save();

  // Respond with the saved post data
  res.status(201).json({
    status: "success",
    post: savedPost  // Return the saved post as a response
  });
}
 catch (error) {
  console.error("Error saving post:", error);
  // res.status(500).json({ error: "Failed to save post" });
  if (!res.headersSent) {
    res.status(500).json({ error: "Failed to save post" });
  }
}


});
router.get('/allposts', requireLogin,(req, res, next) =>{
  post.find()
  .populate("postedby","_id name Photo")
  .populate("comments.postedby", "_id name")
  .sort("-createdAt")
  .then(posts=>res.json(posts))
  .catch(error=>console.log(error))
});
router.get('/myposts', requireLogin,(req, res, next) =>{
  // console.log(req.user)
  post.find({postedby:req.user._id})
  .populate("postedby", "_id name")
  .populate("comments.postedby", "_id name")
  .sort("-createdAt")
  .then((myposts)=>{res.json(myposts)})
  .catch((error) => console.log(error));
  // .catch(error=>console.log(error))
});
router.put('/like', requireLogin, async (req, res) => {
  try {
      const result = await post.findByIdAndUpdate(
          req.body.postId,
          {
              $push: { likes: req.user._id }
          },
          { new: true }
      ).populate('postedby', '_id name Photo') // Optionally populate postedby
      if (!result) {
          return res.status(404).json({ error: 'Post not found' });
      }
      return res.status(200).json(result);
  } catch (err) {
      return res.status(422).json({ error: err.message });
  }
});
router.put('/unlike', requireLogin, async (req, res) => {
  try {
    // Validate input
    if (!req.body.postId) {
      return res.status(400).json({ error: 'Post ID is required' });
    }

    // Perform the update
    const result = await post.findByIdAndUpdate(
      req.body.postId,
      {
        $pull: { likes: req.user._id } // Remove the user's ID from the likes array
      },
      { new: true } // Return the updated document
    ).populate('postedby', '_id name Photo') // Optionally populate postedby

    // Handle case where the post is not found
    if (!result) {
      return res.status(404).json({ error: 'Post not found' });
    }

    // Send the updated post as the response
    return res.status(200).json(result);
  } catch (err) {
    console.error(err.message); // Log the error for debugging
    return res.status(500).json({ error: 'An error occurred while unliking the post' });
  }
});
router.put('/Comment', requireLogin, async (req, res) => {
  try {
    const comment = {
      comment: req.body.text,
      postedby: req.user._id,
    };

    // Update the post with the new comment
    const result = await post.findByIdAndUpdate(
      req.body.postId,
      {
        $push: { comments: comment },
      },
      {
        new: true,
      }
    ).populate('comments.postedby', '_id name')
    .populate('postedby', '_id name') // Optionally populate postedby

    if (!result) {
      return res.status(404).json({ error: 'Post not found' });
    }

    // Send the updated post as the response
    return res.status(200).json(result);
  } catch (err) {
    console.error(err.message); // Log the error for debugging
    return res.status(500).json({ error: 'An error occurred while adding the comment' });
  }
});

// Delete a Movie
router.delete("/deletepost/:id", requireLogin, async (req, res) => {
  try {
    const { id } = req.params;

    const deletedMovie = await post.findByIdAndDelete(id);
    if (!deletedMovie) {
      return res.status(404).json({ error: "Movie not found" });
    }

    res.json({ message: "Movie deleted successfully", deletedMovie });
  } catch (err) {
    console.error("Delete Error:", err);
    res.status(500).json({ error: "Failed to delete movie" });
  }
});
router.put("/update-movie-rating/:id", requireLogin, async (req, res) => {
  try {
    const { id } = req.params;
    const { rating } = req.body; // Fix: Use req.body instead of req.comment

    if (!rating || isNaN(rating) || rating < 0 || rating > 10) {
      return res.status(400).json({ error: "Invalid rating (must be between 0 and 10)" });
    }

    const updatedMovie = await post.findByIdAndUpdate(
      id,
      { $set: { rating } }, // Fix: Ensure the update operation is correct
      { new: true }
    );

    if (!updatedMovie) {
      return res.status(404).json({ error: "Movie not found" });
    }

    res.json(updatedMovie);
  } catch (err) {
    console.error("Update Rating Error:", err);
    res.status(500).json({ error: "Failed to update movie rating" });
  }
});


module.exports = router;
