import React, { useState, useEffect, useRef } from "react";
import { useParams } from "react-router-dom";
import NavBar from "../../Components/NavBar/NavBar";
import { useNavigate } from "react-router-dom";
import { SlUser } from "react-icons/sl";
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
import { BsReplyAll } from "react-icons/bs";
import { AiOutlineEdit } from "react-icons/ai";
import {BiDotsHorizontal} from "react-icons/bi";
import Popper from "popper.js";



const ReplyModal = ({ comment, setShowReply, handleReply, addReply }) => {
  const [user, setUser] = useState(JSON.parse(localStorage.getItem("user")));
  const [loading, setLoading] = useState(false);
  const { postId } = useParams();

  const handleComment = async (e) => {
    e.preventDefault();
    setLoading(true);
    const body = document.getElementsByName("reply")[0].value;

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
      addReply(res.data.comment);
      ToastMaker("Replied!!!", 3000, {
        valign: "top",
        styles: {
          backgroundColor: "green",
          fontSize: "20px",
        },
      });
      setShowReply(false);
      await handleReply(e);
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
      <div className="flex flex-row items-center justify-between mb-2 mt-2 max-w-[600px]">
        {user.profile_pic_url.includes("None") ? (
          <SlUser className="w-6 h-6 rounded-full mr-4" />
        ) : (
          <img
            src={user.profile_pic_url}
            alt={user.username}
            className="w-8 h-8 rounded-full mr-4"
          />
        )}
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

const EditModal = ({ comment, setShowEdit, changeComment }) => {
  const [editedComment, setEditedComment] = useState(comment.comment);
  const [loading, setLoading] = useState(false);

  const handleInputChange = (event) => {
    setEditedComment(event.target.value);
  };

  const handleSave = (e) => {
    handleEdit(e);
  };

  const handleEdit = async (e) => {
    e.preventDefault();
    setLoading(true);
    const body = document.getElementsByName("edit")[0].value;

    const config = {
      headers: {
        "Content-Type": "application/json",
        Authorization: `Bearer ${localStorage.getItem("token")}`,
      },
    };
    try {
      const res = await axios.put(
        `https://scicommons-backend.onrender.com/api/feedcomment/${comment.id}/`,
        { post: comment.post, comment: body },
        config
      );

      ToastMaker("Edited!!!", 3000, {
        valign: "top",
        styles: {
          backgroundColor: "green",
          fontSize: "20px",
        },
      });
      await changeComment(res.data.success.comment);
      setShowEdit(false);
    } catch (err) {
      console.log(err);
    }
    setLoading(false);
  };

  return (
    <div className="fixed inset-0 flex items-center justify-center z-50 bg-gray-800 bg-opacity-50">
      <div className="bg-white w-80 rounded-lg shadow-lg p-6">
        <h2 className="text-xl font-semibold mb-4">Edit Comment</h2>
        <textarea
          className="w-full h-24 border rounded-lg p-2 mb-4"
          value={editedComment}
          name="edit"
          onChange={handleInputChange}
        />
        <div className="flex justify-end">
          <button
            className="bg-gray-300 hover:bg-gray-400 text-gray-800 font-semibold py-2 px-4 rounded mr-2"
            onClick={() => {
              setShowEdit(false);
            }}
          >
            Cancel
          </button>
          <button
            className="bg-green-500 hover:bg-green-600 text-white font-semibold py-2 px-4 rounded"
            onClick={handleSave}
          >
            {loading ? "Saving..." : "Save"}
          </button>
        </div>
      </div>
    </div>
  );
};

const Comment = ({ comment }) => {
  const navigate = useNavigate();
  const [user, setUser] = useState(JSON.parse(localStorage.getItem("user")));
  const [value, setValue] = useState(comment.comment);
  const [liked, setLiked] = useState(comment.commentliked);
  const [likes, setLikes] = useState(comment.commentlikes);
  const [loading, setLoading] = useState(false);
  const [showReply, setShowReply] = useState(false);
  const [showEdit, setShowEdit] = useState(false);
  const [replyData, setReplyData] = useState(null);
  const [repliesData, setRepliesData] = useState([]);
  const [editData, setEditData] = useState(null);
  const { postId } = useParams();

  const handleProfile = (e) => {
    e.preventDefault();
    navigate(`/profile/${comment.username}`);
  };

  const loadData = async (res) => {
    const newReply = [...repliesData, ...res];
    setRepliesData(newReply);
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

  const addAnchorTags = (text) => {
    const words = text.split(' ');
  
    const processedWords = words.map((word, index) => {
      if (word.includes('https://')) {
        return (
          <span key={index}>
            <a href={`${word}`} className="text-blue-500 underline">{word}</a>
          </span>
        );
      }
      return <span key={index}>{word} </span>;
    });
  
    return processedWords;
  }

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
        `https://scicommons-backend.onrender.com/api/feedcomment/?limit=20&offset=${repliesData.length}`,
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
    if (repliesData.length === 0) {
      return `Load replies`;
    } else if (comment.replies > repliesData.length) {
      return `Load ${comment.replies - repliesData.length} more replies`;
    } else {
      return "";
    }
  };

  const changeComment = async (body) => {
    setValue(body);
  };

  const addReply = async (res) => {
    res.commentavatar = user.profile_pic_url;
    res.username = user.username;
    const newReply = [...repliesData, res];
    setRepliesData(newReply);
  };

  return (
    <>
      <div
        key={comment.id}
        className="rounded-lg pl-2 my-2 mt-2 bg-white border-l-2 border-green-600"
      >
        <div className="flex mb-2">
          <div className="flex flex-row items-center">
            {comment.commentavatar.includes("None") ? (
              <SlUser className="w-6 h-6 mr-1" />
            ) : (
              <img
                src={comment.commentavatar}
                alt={comment.username}
                className="w-6 h-6 rounded-full mr-2"
              />
            )}
            <div className="flex flex-col ml-2">
              <p
                className="font-medium text-sm text-green-600"
                onClick={handleProfile}
              >
                {comment.username}
              </p>
              <span className="text-xs text-slate-400">
                {findTime(comment.created_at)}
              </span>
            </div>
          </div>
        </div>
        <p className="w-full text-sm my-2 pl-8 text-slate-600">{addAnchorTags(value)}</p>
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
          {comment.username === user.username && (
            <span
              className="text-xs ml-4"
              onClick={() => {
                setShowEdit(true);
                setEditData(comment);
              }}
            >
              <AiOutlineEdit className="w-5 h-5 text-zinc-500" />
            </span>
          )}
          <span
            className="text-xs ml-4"
            onClick={() => {
              setShowReply(true);
              setReplyData(comment);
            }}
          >
            <BsReplyAll className="w-5 h-5 text-zinc-500" />
          </span>
        </div>
        {showReply && (
          <ReplyModal
            comment={replyData}
            setShowReply={setShowReply}
            handleReply={handleReply}
            addReply={addReply}
          />
        )}
        {showEdit && (
          <EditModal
            comment={editData}
            setShowEdit={setShowEdit}
            changeComment={changeComment}
          />
        )}
        <div className="ml-10">
          {repliesData.length > 0 &&
            repliesData.map((reply) => <Comment key={reply.id} comment={reply} />)}
        </div>
        {comment.replies > 0 && (
          <button onClick={handleReply} className="ml-5 text-xs mt-4">
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
    console.log(res);
    setComments(res);
  };

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
      res.data.comment.commentavatar = user.profile_pic_url;
      res.data.comment.username = user.username;
      await loadCommentsData([res.data.comment, ...comments]);
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

  const addAnchorTags = (text) => {
    const words = text.split(' ');
  
    const processedWords = words.map((word, index) => {
      if (word.includes('https://')) {
        return (
          <span key={index}>
            <a href={`${word}`} className="text-blue-500 underline">{word}</a>
          </span>
        );
      }
      return <span key={index}>{word} </span>;
    });
  
    return processedWords;
  }

  const fillLoad = () => {
    if (comments.length === 0) {
      return `No comments to Load`;
    } else if (post.comments > comments.length) {
      return `Load ${post.comments - comments.length} more comments`;
    } else {
      return "";
    }
  };

  return (
    <>
      <NavBar />
      <div className="overflow-hidden">
        {loading && <Loader />}
        {!loading && post !== null && (
          <>
            <div
              key={postId}
              className="border shadow-2xl p-4 mt-2 bg-white w-full md:w-1/2 mx-auto"
            >
              <div className="flex justify-between">
                <div className="flex items-center">
                  {post.avatar.includes("None") ? (
                    <SlUser className="w-6 h-6 mr-1" />
                  ) : (
                    <img
                      src={post.avatar}
                      alt={post.username}
                      className="w-10 h-10 rounded-full mr-4"
                    />
                  )}
                  <div className="flex flex-col">
                    <p className="font-bold" onClick={handleProfile}>
                      {post.username}
                    </p>
                    <span className="text-sm text-slate-400">
                      {findTime(post.created_at)}
                    </span>
                  </div>
                </div>
                {post.username===user.username && <div>
                  <Dropdown post={post}/>
                </div>}
              </div>
              <p className="w-full text-md md:text-xl my-4">{addAnchorTags(post.body)}</p>
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
                {user.profile_pic_url.includes("None") ? (
                  <SlUser className="w-8 h-8 mr-2" />
                ) : (
                  <img
                    src={user.profile_pic_url}
                    alt={user.username}
                    className="w-10 h-10 rounded-full mr-4"
                  />
                )}
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
            <div className="border p-6 bg-white">
              <div className="text-3xl font-semibold text-green-600">
                Comments {comments.length > 0 && `(${comments.length})`}
              </div>
              {comments.length > 0 &&
                comments.map((comment) => <Comment key={comment.id} comment={comment} />)}
              <button
                onClick={loadMore}
                className="p-2 text-green-500 text-center font-bold mt-2"
              >
                {loadComments ? "Loading..." : fillLoad()}
              </button>
            </div>
          </>
        )}
      </div>
    </>
  );
};


const Dropdown = ({post}) => {
  

  const [dropdownPopoverShow, setDropdownPopoverShow] = React.useState(false);
  const btnDropdownRef = React.createRef();
  const popoverDropdownRef = React.createRef();
  const openDropdownPopover = () => {
    new Popper(btnDropdownRef.current, popoverDropdownRef.current, {
      placement: "bottom-start"
    });
    setDropdownPopoverShow(true);
  };
  const closeDropdownPopover = () => {
    setDropdownPopoverShow(false);
  };

  const EditPost = async() => {


    try{
      const res = await axios.put(`https://scicommons-backend.onrender.com/api/feed/${post.id}/`);
    } catch(err) {
      console.log(err);
    }

  }

  const DeletePost = async() => {
      
      try{
        const res = await axios.delete(`https://scicommons-backend.onrender.com/api/feed/${post.id}/`);
      } catch(err) {
        console.log(err);
      }
  }
  

  return (
    <>
      <div className="flex flex-wrap">
        <div className="w-full sm:w-6/12 md:w-4/12 px-4">
          <div className="relative inline-flex align-middle w-full">
            <button
              className={
                "uppercase text-sm px-6 rounded outline-none focus:outline-none"
              }
              style={{ transition: "all .15s ease" }}
              type="button"
              ref={btnDropdownRef}
              onClick={() => {
                dropdownPopoverShow
                  ? closeDropdownPopover()
                  : openDropdownPopover();
              }}
            >
              <BiDotsHorizontal className="w-6 h-6 text-black-800" />
            </button>
            <div
              ref={popoverDropdownRef}
              className={
                (dropdownPopoverShow ? "block " : "hidden ") +
                "text-base z-50 float-left py-2 list-none text-left rounded shadow-lg mt-1 bg-white"
              }
              style={{ minWidth: "8rem" }}
            >
              <div
                onClick={EditPost}
                className={
                  "text-sm py-2 px-4 font-normal block w-full whitespace-no-wrap bg-white text-gray-800 hover:bg-gray-200"
                }
              >
                Edit Post
              </div>
              <div
                onClick={DeletePost}
                className={
                  "text-sm py-2 px-4 font-normal text-red-400 block w-full whitespace-no-wrap bg-white text-gray-800 hover:bg-gray-200"
                }
              >
                Delete Post
              </div>
            </div>
          </div>
        </div>
      </div>
    </>
  );
};


export default SinglePost;
