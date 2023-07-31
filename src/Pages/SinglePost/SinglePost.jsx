// src/SinglePost.js
import React, { useState } from 'react';
import { useParams } from 'react-router-dom';
import { FiSend } from 'react-icons/fi';
import NavBar from '../../Components/NavBar/NavBar';
import {useNavigate} from 'react-router-dom'
import { IoHeartOutline, IoHeart, IoBookmarkOutline,IoBookmark, IoPaperPlaneOutline } from 'react-icons/io5';

const SinglePost = () => {
  const { postId } = useParams();
  const navigate = useNavigate();

  const [liked, setLiked] = useState(false);
  const [bookmark, setBookmark] = useState(false);

  // Sample post object (Replace this with actual API call or state management)
  const post = {
    id: postId,
    imageUrl: 'https://via.placeholder.com/400',
    caption: 'Beautiful scenery',
    author: {
      username: 'john_doe',
      profilePicture: 'https://via.placeholder.com/50',
    },
    likes: 10,
    comments: [
      { username: 'user1', text: 'Comment 1' },
      { username: 'user2', text: 'Comment 2' },
      { username: 'user3', text: 'Comment 3' },
      // ... (existing comments)
    ],
  };

  // State to keep track of the number of comments to display
  const [visibleComments, setVisibleComments] = useState(20);

  // State to store the new comment input
  const [newComment, setNewComment] = useState('');

  // Function to handle the new comment input change
  const handleNewCommentChange = (e) => {
    setNewComment(e.target.value);
  };

  const loadMoreComments = () => {
    // Calculate the new number of visible comments
    const newVisibleComments = Math.min(visibleComments + 5, post.comments.length);
    setVisibleComments(newVisibleComments);
  };

  const handleLike = (e) => {
    e.preventDefault()
    setLiked((prevLiked) => !prevLiked);
  };

  const handleProfile = (e) => {
    e.preventDefault()
    navigate(`/profile/${post.author.username}`)
  }

  const handleBookmark = (e) => {
    // Implement bookmark logic here
    e.preventDefault()
    setBookmark((prevBookmark) => !prevBookmark)
    console.log('Bookmark post:', post);
  };

  const handleShare = () => {
    // Implement share logic here
    console.log('Share post:', post);
  };

  // Function to add a new comment
  const addNewComment = () => {
    if (newComment.trim() !== '') {
      // Create a new comment object with the current username and the new comment text
      const newCommentObj = { username: 'Current User', text: newComment };

      // Update the list of comments
      post.comments.push(newCommentObj);

      // Clear the new comment input
      setNewComment('');

      // Optional: You can save the new comment to the server using an API call or state management
    }
  };

  return (
    <>
    <NavBar/>
    <div className="container mx-auto px-4 w-full md:w-1/2">
      <div className="border rounded-lg p-4 my-4 shadow-xl">
        <div className="flex items-center">
          <img
            src={post.author.profilePicture}
            alt={post.author.username}
            className="w-10 h-10 rounded-full mr-4"
          />
          <p className="font-bold on-cursor" onClick={handleProfile}>{post.author.username}</p>
        </div>
        <p className="w-full my-4">{post.caption}</p>
        {post.imageUrl && <img src={post.imageUrl} alt={post.caption} className="w-full my-4" />}
        <div className="flex justify-between">
            <div className="flex justify-between">
                <div className="flex">
                {/* Like Button */}
                <button onClick={handleLike} className="mr-4">
                    {liked ? (
                    <IoHeart className="text-xl text-red-500" />
                    ) : (
                    <IoHeartOutline className="text-xl" />
                    )}
                </button>
                {/* Bookmark Button */}
                <button onClick={handleBookmark} className="mr-4">
                    {
                        bookmark ? (
                            <IoBookmark className="text-xl text-gray-800" />
                        ) : (
                            <IoBookmarkOutline className="text-xl" />
                        )
                    }
                </button>
                {/* Share Button */}
                <button onClick={handleShare}>
                    <IoPaperPlaneOutline className="text-xl" />
                </button>
                </div>
            </div>
        </div>
            <div className="mt-2">
                {/* Display the number of likes */}
                <p className="font-bold">{post.likes} likes</p>
            </div>
        <div className="mt-4 flex items-center">
          <input
            type="text"
            value={newComment}
            onChange={handleNewCommentChange}
            placeholder="Add a new comment..."
            className="w-full p-2 border rounded-md"
          />
          <button onClick={addNewComment} className="ml-2 px-4 py-2 bg-green-400 text-white rounded">
            <FiSend size={20} />
          </button>
        </div>
        {/* Display a limited number of comments */}
        {post.comments.slice(0, visibleComments).map((comment, index) => (
          <p key={index} className="mt-2">
            <span className="font-bold">{comment.username}: </span>
            {comment.text}
          </p>
        ))}
        {/* Show "Load More" button if there are more comments to display */}
        {visibleComments < post.comments.length && (
          <button onClick={loadMoreComments} className="text-green-200 mt-2">
            Load More
          </button>
        )}
      </div>
    </div>
    </>
  );
};

export default SinglePost;
