import React, { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import "../../css/Admin.css";

export default function Admin() {
  const [movies, setMovies] = useState([]); // Movie data
  const [show, setShow] = useState(false); // Show/hide comments
  const [item, setItem] = useState(null); // Selected movie for comments
  const [comment, setComment] = useState({}); // Store comments
  const [showUpdate, setShowUpdate] = useState(false); // Show update modal
  const [updatedPhoto, setUpdatedPhoto] = useState(""); // Store updated photo
  const [updatedComment, setUpdatedComment] = useState(""); // Store updated comment
  const [selectedMovieId, setSelectedMovieId] = useState(null); // Movie ID to update
  const [showUpdateRating, setShowUpdateRating] = useState(false); // Show rating modal
const [updatedRating, setUpdatedRating] = useState(""); // Store updated rating

  useEffect(() => {
    fetchMovies();
  }, []);

  const fetchMovies = () => {
    fetch("http://localhost:1222/allposts", {
      headers: { Authorization: "Bearer " + localStorage.getItem("jwt") },
    })
      .then((res) => res.json())
      .then((result) => {
        if (Array.isArray(result)) {
          setMovies(result);
        } else if (result.posts) {
          setMovies(result.posts);
        } else {
          console.error("Unexpected API response format", result);
        }
      })
      .catch((err) => console.error("Fetch Error:", err));
  };

  // Toggle comment section
  const toggleComment = (movie = null) => {
    setShow(!show);
    setItem(movie);
  };

  // DELETE MOVIE
  const deleteMovie = (movieId) => {
    fetch(`http://localhost:1222/deletepost/${movieId}`, {
      method: "DELETE",
      headers: { Authorization: "Bearer " + localStorage.getItem("jwt") },
    })
      .then((res) => res.json())
      .then((result) => {
        console.log("Movie deleted:", result);
        fetchMovies(); // Refresh movies
      })
      .catch((err) => console.error("Delete Error:", err));
  };

  

  const updateMovieRating = () => {
    if (!updatedRating || isNaN(updatedRating) || updatedRating < 0 || updatedRating > 10) {
      alert("Please enter a valid rating between 0 and 10.");
      return;
    }
  
    fetch(`http://localhost:1222/update-movie-rating/${selectedMovieId}`, {
      method: "PUT",
      headers: {
        "Content-Type": "application/json",
        Authorization: "Bearer " + localStorage.getItem("jwt"),
      },
      body: JSON.stringify({ rating: updatedRating }),
    })
      .then((res) => res.json())
      .then((result) => {
        console.log("Rating updated:", result);
        setShowUpdateRating(false);
        fetchMovies(); // Refresh movies
      })
      .catch((err) => console.error("Update Rating Error:", err));
  };
  
  const makeComment = (text, postId) => {
    fetch("http://localhost:1222/comment", {
      method: "PUT",
      headers: {
        "Content-Type": "application/json",
        Authorization: "Bearer " + localStorage.getItem("jwt"),
      },
      body: JSON.stringify({
        postId,
        text,
      }),
    })
      .then((res) => res.json())
      .then((result) => {
        console.log("Comment added:", result);
        fetchMovies(); // Refresh movies to include the new comment
        setComment({ ...comment, [postId]: "" }); // Clear input after comment
      })
      .catch((err) => console.error("Comment Error:", err));
  };
  

  return (
    <div>
      {/* Admin Panel Header */}
      <div className="home-container">
        <center><h1>Welcome to Admin Panel</h1></center>
        <Link to="/Add-movie">
          <center><li><h1>Add Movie</h1></li></center>
        </Link>
      </div>

      {/* Movie Table */}
      <div className="admin-container">
        <table className="movie-table">
          <thead>
            <tr>
              <th>Image</th>
              <th>Movie-rating</th>
              <th>Reviews</th>
              <th>Actions</th>
            </tr>
          </thead>
          <tbody>
            {movies.length > 0 ? (
              movies.map((movie) => (
                <tr key={movie._id}>
                  <td>
                    <img src={movie.photo} alt="Movie" width="100" />
                  </td>
                  <td>{movie.body}</td>
                  <td>
                    <button onClick={() => toggleComment(movie)}>
                      View {movie.comments.length} Reviews
                    </button>
                  </td>
                  <td>
                  <button onClick={() => { setShowUpdateRating(true); setSelectedMovieId(movie._id); setUpdatedRating(movie.rating); }}>
    Update Rating
  </button>
  <button onClick={() => deleteMovie(movie._id)}>Delete</button>
                  </td>
                </tr>
              ))
            ) : (
              <tr>
                <td colSpan="5">No movies found</td>
              </tr>
            )}
          </tbody>
        </table>
      </div>
{/* Update Rating Modal */}
{showUpdateRating && (
  <div className="updateModal">
    <div className="modalContent">
      <h2>Update Movie Rating</h2>
      <label>New Rating (0-10):</label>
      <input
        type="number"
        value={updatedRating}
        onChange={(e) => setUpdatedRating(e.target.value)}
      />
      <button onClick={updateMovieRating}>Update</button>
      <button onClick={() => setShowUpdateRating(false)}>Cancel</button>
    </div>
  </div>
)}

      {/* Show Comments Modal */}
      {show && item && (
        <div className="showComment">
          <div className="container">
            
            <div className="details">
              {/* Comments Section */}
              <div className="comment-section" >
                {item.comments.map((comment) => (
                  <p className="comm" key={comment._id}>
                    <span className="commenter" style={{ fontWeight: "bolder" }}>
                      {comment.postedby.name}
                    </span>
                    <span className="commentText"> {comment.comment}</span>
                  </p>
                ))}
              </div>

              {/* Add Comment Section */}
              
            </div>
          </div>

          {/* Close Comments */}
          <div className="close-comment">
            <span className="material-symbols-outlined" onClick={() => toggleComment()}>
              Close
            </span>
          </div>
        </div>
      )}

      {/* Update Movie Modal */}
      {showUpdate && (
        <div className="updateModal">
          <div className="modalContent">
            
            <input
              type="text"
              value={updatedComment}
              onChange={(e) => setUpdatedComment(e.target.value)}
            />
            {/* <button onClick={updateMovie}>Update</button> */}
            <button onClick={() => setShowUpdate(false)}>Cancel</button>
          </div>
        </div>
      )}
    </div>
  );
}
