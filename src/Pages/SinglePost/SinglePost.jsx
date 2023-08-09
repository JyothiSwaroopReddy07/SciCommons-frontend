// src/SinglePost.js
import React, { useState, useEffect } from "react";
import { useParams } from "react-router-dom";
import NavBar from "../../Components/NavBar/NavBar";
import { useNavigate } from "react-router-dom";
import {
  IoHeartOutline,
  IoHeart,
  IoBookmarkOutline,
  IoBookmark,
  IoPaperPlaneOutline,
} from "react-icons/io5";
import {
  AiOutlineSend,
  AiFillLike,
  AiOutlineLike,
  AiOutlineClose,
} from "react-icons/ai";
import axios from "axios";
import Loader from "../../Components/Loader/Loader";
import ToastMaker from "toastmaker";
import "toastmaker/dist/toastmaker.css";
import { CSpinner } from "@coreui/react";
import { BsSortNumericDown } from "react-icons/bs";

const ReplyModal = ({ comment, setShowReply }) => {
  const [user, setUser] = useState(JSON.parse(localStorage.getItem("user")));
  const [loading, setLoading] = useState(false);
  const { postId } = useParams();

  const handleComment = async (e) => {
    e.preventDefault();
    setLoading(true);
    const body = document.getElementsByName("reply")[0].value;
    console.log(body);
    const config = {
      headers: {
        "Content-Type": "application/json",
        Authorization: `Bearer ${localStorage.getItem("token")}`,
      },
    };
    try {
      const res = await axios.post(
        `https://scicommons-backend.onrender.com/api/feedcomment/`,
        { post: postId, comment: body, parent_comment: comment.id },
        config
      );
      console.log(res.data.success);
      ToastMaker("Replied!!!", 3000, {
        valign: "top",
        styles: {
          backgroundColor: "green",
          fontSize: "20px",
        },
      });
      setShowReply(false);
    } catch (err) {
      console.log(err);
    }
    setLoading(false);
  };

  const handleClose = () => {
    setShowReply(false);
  };

  return (
    <>
      <div className="flex flex-row items-center justify-between mb-2 mt-2">
        <img
          src={user.profile_pic_url}
          alt={user.username}
          className="w-8 h-8 rounded-full mr-4"
        />
        <input
          type="text"
          placeholder="Add a comment..."
          className="w-full border rounded-lg p-2 mr-2 rounded-xl"
          name="reply"
        />
        <button
          onClick={handleComment}
          className="bg-green-400 rounded-lg p-2 mr-2"
        >
          {loading ? (
            <span>loading...</span>
          ) : (
            <AiOutlineSend className="text-xl" />
          )}
        </button>
        <button onClick={handleClose} className="bg-red-400 rounded-lg p-2">
          <AiOutlineClose className="text-xl" />
        </button>
      </div>
    </>
  );
};

const Comment = ({ comment }) => {
  const navigate = useNavigate();
  const [user, setUser] = useState(JSON.parse(localStorage.getItem("user")));
  const [liked, setLiked] = useState(comment.commentliked);
  const [likes, setLikes] = useState(comment.commentlikes);
  const [loading, setLoading] = useState(false);
  const [showReply, setShowReply] = useState(false);
  const [replyData, setReplyData] = useState([]);
  const { postId } = useParams();

  const handleProfile = (e) => {
    e.preventDefault();
    navigate(`/profile/${comment.username}`);
  };

  const loadData = async (res) => {
    const newReply = [...replyData, ...res];
    setReplyData(newReply);
  };

  const handleLike = async (e) => {
    e.preventDefault();
    const config = {
      headers: {
        "Content-Type": "application/json",
        Authorization: `Bearer ${localStorage.getItem("token")}`,
      },
    };
    if (liked) {
      try {
        const res = await axios.post(
          `https://scicommons-backend.onrender.com/api/feedcomment/unlike/`,
          { comment: comment.id },
          config
        );
        setLiked((prevLiked) => !prevLiked);
        setLikes((prevLikes) => prevLikes - 1);
      } catch (err) {
        console.log(err);
      }
    } else {
      try {
        const res = await axios.post(
          `https://scicommons-backend.onrender.com/api/feedcomment/like/`,
          { comment: comment.id },
          config
        );
        setLiked((prevLiked) => !prevLiked);
        setLikes((prevLikes) => prevLikes + 1);
      } catch (err) {
        console.log(err);
      }
    }
  };

  const handleReply = async (e) => {
    e.preventDefault();
    setLoading(true);
    const config = {
      headers: {
        "Content-Type": "application/json",
        Authorization: `Bearer ${localStorage.getItem("token")}`,
      },
      params: {
        comment: comment.id,
        post: comment.post,
      },
    };
    try {
      const res = await axios.get(
        `https://scicommons-backend.onrender.com/api/feedcomment/?limit=20&offset=${replyData.length}`,
        config
      );
      await loadData(res.data.success.results);
    } catch (err) {
      console.log(err);
    }
    setLoading(false);
  };

  const findTime = (date) => {
    const time = new Date(date);
    const now = new Date();
    const diff = now - time;
    const seconds = Math.floor(diff / 1000);
    const minutes = Math.floor(seconds / 60);
    const hours = Math.floor(minutes / 60);
    const days = Math.floor(hours / 24);
    const months = Math.floor(days / 30);
    const years = Math.floor(months / 12);
    if (years > 0) {
      return `${years} years ago`;
    } else if (months > 0) {
      return `${months} months ago`;
    } else if (days > 0) {
      return `${days} days ago`;
    } else if (hours > 0) {
      return `${hours} hours ago`;
    } else if (minutes > 0) {
      return `${minutes} minutes ago`;
    } else if (seconds > 0) {
      return `${seconds} seconds ago`;
    } else {
      return `Just now`;
    }
  };

  const fillLoad = () => {
    if(replyData.length===0){
      return `Load replies`
    }
    else if(comment.replies>replyData.length){
      return `Load ${comment.replies-replyData.length} more replies`
    }
    else{
      return ""
    }
  }

  return (
    <>
      <div
        key={comment.id}
        className="rounded-lg pl-2 my-2 mt-2 bg-white border-l-2"
      >
        <div className="flex mb-2">
          <div className="flex flex-row items-center">
            <img
              src={comment.commentavatar}
              alt={comment.username}
              className="w-6 h-6 rounded-full mr-2"
            />
            <div className="flex flex-col">
              <p
                className="font-medium text-sm text-green-600"
                onClick={handleProfile}
              >
                {comment.username}
              </p>
              <span className="text-xs">{findTime(comment.created_at)}</span>
            </div>
          </div>
        </div>
        <p className="w-full text-sm mb-2 pl-8 text-slate-600">{comment.comment}</p>
        <div className="w-full ml-10 flex flex-row items-center">
          <div className="flex flex-row items-center mr-3">
            <button onClick={handleLike} className="flex">
              {liked ? (
                <AiFillLike className="text-md" />
              ) : (
                <AiOutlineLike className="text-md" />
              )}
            </button>
            <span className="text-sm">{likes}</span>
          </div>
          <span
            className="text-xs underline"
            onClick={() => {
              setShowReply(true);
              setReplyData(comment);
            }}
          >
            Reply
          </span>
        </div>
        {showReply && (
          <ReplyModal comment={comment} setShowReply={setShowReply} />
        )}
        <div className="ml-10">
          {replyData.length > 0 &&
            replyData.map((reply) => <Comment comment={reply} />)}
        </div>
        {comment.replies > 0 && (
          <button onClick={handleReply} className="ml-10 text-xs mt-2">
            {loading ? (
              <span className="text-green-600">Loading...</span>
            ) : (
              <span className="text-green-600 font-bold">{fillLoad()}</span>
            )}
          </button>
        )}
      </div>
    </>
  );
};

const SinglePost = () => {
  const [liked, setLiked] = useState(false);
  const [bookmark, setBookmark] = useState(false);
  const [likes, setLikes] = useState(false);
  const [bookmarks, setBookmarks] = useState(false);
  const [post, setPost] = useState(null);
  const [loading, setLoading] = useState(true);
  const [user, setUser] = useState(JSON.parse(localStorage.getItem("user")));
  const [comments, setComments] = useState([]);
  const [loadSubmit, setLoadSubmit] = useState(false);
  const [loadComments, setLoadComments] = useState(false);
  const navigate = useNavigate();

  const { postId } = useParams();
  const loadData = async (res) => {
    setLiked(res.liked);
    setBookmark(res.isbookmarked);
    setLikes(res.likes);
    setBookmarks(res.bookmarks);
    setPost(res);
    setComments(res.comments);
  };

  const loadCommentsData = async (res) => {
    setComments(res);
  }

  const loadMore = async () => {
    setLoadComments(true);
    const config = {
      headers: {
        "Content-Type": "application/json",
        Authorization: `Bearer ${localStorage.getItem("token")}`,
      },
      params: {
        post: postId,
      },
    };
    try {
      const res = await axios.get(
        `https://scicommons-backend.onrender.com/api/feedcomment/?limit=20&offset=${comments.length}`,
        config
      );
      console.log(res.data.success);
      await loadCommentsData([...comments, ...res.data.success.results]);
    } catch (err) {
      console.log(err);
    }
    setLoadComments(false);
  };

  const fetchPost = async () => {
    const config = {
      headers: {
        "Content-Type": "application/json",
        Authorization: `Bearer ${localStorage.getItem("token")}`,
      },
    };
    try {
      const res = await axios.get(
        `https://scicommons-backend.onrender.com/api/feed/${postId}/`,
        config
      );
      console.log(res.data.success);
      await loadData(res.data.success);
    } catch (err) {
      console.log(err);
    }
  };

  useEffect(() => {
    setLoading(true);
    fetchPost();
    setLoading(false);
  }, []);

  const handleLike = async (e) => {
    e.preventDefault();
    const config = {
      headers: {
        "Content-Type": "application/json",
        Authorization: `Bearer ${localStorage.getItem("token")}`,
      },
    };
    if (liked) {
      try {
        const res = await axios.post(
          `https://scicommons-backend.onrender.com/api/feed/unlike/`,
          { post: postId },
          config
        );
        setLiked((prevLiked) => !prevLiked);
        setLikes((prevLikes) => prevLikes - 1);
      } catch (err) {
        console.log(err);
      }
    } else {
      try {
        const res = await axios.post(
          `https://scicommons-backend.onrender.com/api/feed/like/`,
          { post: postId },
          config
        );
        setLiked((prevLiked) => !prevLiked);
        setLikes((prevLikes) => prevLikes + 1);
      } catch (err) {
        console.log(err);
      }
    }
  };

  const handleComment = async (e) => {
    e.preventDefault();
    setLoadSubmit(true);
    const comment = document.getElementsByName("comment")[0].value;
    const config = {
      headers: {
        "Content-Type": "application/json",
        Authorization: `Bearer ${localStorage.getItem("token")}`,
      },
    };
    try {
      const res = await axios.post(
        `https://scicommons-backend.onrender.com/api/feedcomment/`,
        { post: postId, comment: comment },
        config
      );
      console.log(res.data.success);
      await fetchPost();
      document.getElementsByName("comment")[0].value = "";
      ToastMaker("Comment added successfully!!!!", 3000, {
        valign: "top",
        styles: {
          backgroundColor: "green",
          fontSize: "20px",
        },
      });
      setLoadSubmit(false);
    } catch (err) {
      console.log(err);
    }
    setLoadSubmit(false);
  };

  const handleBookmark = async (e) => {
    // Implement bookmark logic here
    e.preventDefault();
    const config = {
      headers: {
        "Content-Type": "application/json",
        Authorization: `Bearer ${localStorage.getItem("token")}`,
      },
    };
    if (bookmark) {
      try {
        const res = await axios.post(
          `https://scicommons-backend.onrender.com/api/feed/unbookmark/`,
          { post: postId },
          config
        );
        setBookmark((prevBookmark) => !prevBookmark);
        setBookmarks((prevBookmarks) => prevBookmarks - 1);
      } catch (err) {
        console.log(err);
      }
    } else {
      try {
        const res = await axios.post(
          `https://scicommons-backend.onrender.com/api/feed/bookmark/`,
          { post: postId },
          config
        );
        setBookmark((prevBookmark) => !prevBookmark);
        setBookmarks((prevBookmarks) => prevBookmarks + 1);
      } catch (err) {
        console.log(err);
      }
    }
  };

  const handleProfile = (e) => {
    e.preventDefault();
    navigate(`/profile/${post.username}`);
  };

  const handleShare = () => {
    // Implement share logic here
    console.log("Share post:", post);
  };

  const findTime = (date) => {
    const time = new Date(date);
    const now = new Date();
    const diff = now - time;
    const seconds = Math.floor(diff / 1000);
    const minutes = Math.floor(seconds / 60);
    const hours = Math.floor(minutes / 60);
    const days = Math.floor(hours / 24);
    const months = Math.floor(days / 30);
    const years = Math.floor(months / 12);
    if (years > 0) {
      return `${years} years ago`;
    } else if (months > 0) {
      return `${months} months ago`;
    } else if (days > 0) {
      return `${days} days ago`;
    } else if (hours > 0) {
      return `${hours} hours ago`;
    } else if (minutes > 0) {
      return `${minutes} minutes ago`;
    } else if (seconds > 0) {
      return `${seconds} seconds ago`;
    } else {
      return `Just now`;
    }
  };

  const fillLoad = () => {
    if(comments.length===0){
      return `Load comments`
    }
    else if(post.comments>comments.length){
      return `Load ${post.comments-comments.length} more comments`
    }
    else{
      return ""
    }
  }

  return (
    <div className="min-w-[600px]">
      <NavBar />
      {loading && <Loader />}
      {!loading && post !== null && (
        <>
          <div
            key={postId}
            className="border shadow-2xl p-4 mt-2 bg-white w-full md:w-1/2 mx-auto"
          >
            <div className="flex items-center">
              <img
                src={post.avatar}
                alt={post.username}
                className="w-10 h-10 rounded-full mr-4"
              />
              <div className="flex flex-col">
                <p className="font-bold" onClick={handleProfile}>
                  {post.username}
                </p>
                <span className="text-sm">{findTime(post.created_at)}</span>
              </div>
            </div>
            <p className="w-full text-md md:text-xl my-4">{post.body}</p>
            {!post.image_url.includes("None") && (
              <img
                src={post.image_url}
                alt={post.caption}
                className="w-full my-4"
              />
            )}
            <div className="w-full">
              <div className="flex flex-row justify-between">
                <button onClick={handleLike} className="flex">
                  {liked ? (
                    <IoHeart className="text-xl text-red-500" />
                  ) : (
                    <IoHeartOutline className="text-xl" />
                  )}
                  <span className="text-sm md:ml-2">{likes}</span>
                </button>
                <button onClick={handleBookmark} className="flex">
                  {bookmark ? (
                    <IoBookmark className="text-xl text-gray-800" />
                  ) : (
                    <IoBookmarkOutline className="text-xl" />
                  )}
                  <span className="text-sm md:ml-2">{bookmarks}</span>
                </button>
                <button onClick={handleShare}>
                  <IoPaperPlaneOutline className="text-xl" />
                </button>
              </div>
            </div>
          </div>
          <div className="border p-4 shadow-2xl bg-white w-full md:w-1/2 mx-auto">
            <div className="flex flex-row items-center justify-between mb-2">
              <img
                src={user.profile_pic_url}
                alt={user.username}
                className="w-10 h-10 rounded-full mr-4"
              />
              <input
                type="text"
                placeholder="Add a comment..."
                className="w-full border rounded-lg p-2 mr-2 rounded-xl"
                name="comment"
              />
              <button
                onClick={handleComment}
                className="bg-green-400 rounded-lg p-2"
              >
                {loadSubmit ? (
                  <CSpinner />
                ) : (
                  <AiOutlineSend className="text-xl" />
                )}
              </button>
            </div>
          </div>
          <div className="border p-4 shadow-2xl bg-white ml-2 flex-grow">
            <div className="text-3xl font-semibold text-green-600">
              Comments
            </div>
            {comments.length > 0 &&
              comments.map((comment) => <Comment comment={comment} />)}
              <button onClick={loadMore} className="p-2 text-green-500 text-center font-bold mt-2">
                {loadComments ? 
                  "Loading...": fillLoad()}
              </button>
          </div>
        </>
      )}
    </div>
  );
};

export default SinglePost;
