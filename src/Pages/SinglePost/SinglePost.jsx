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
import ReactQuill from 'react-quill';
import 'react-quill/dist/quill.snow.css';
import './SinglePost.css';
import Post from "../../Components/Post/Post";
import SocialComment from "../../Components/SocialComment/SocialComment";
import { useGlobalContext } from "../../Context/StateContext";


const SinglePost = () => {

  const {token, user} = useGlobalContext()
  const [liked, setLiked] = useState(false);
  const [bookmark, setBookmark] = useState(false);
  const [likes, setLikes] = useState(false);
  const [bookmarks, setBookmarks] = useState(false);
  const [post, setPost] = useState(null);
  const [loading, setLoading] = useState(true);
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
  };

  const loadMore = async () => {
    setLoadComments(true);
    const config = {
      headers: {
        "Content-Type": "application/json",
        Authorization: `Bearer ${token}`,
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
        Authorization: `Bearer ${token}`,
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
      if(err.response.data.detail==="Not found.") {
        ToastMaker("Post doesn't exists!!!", 3000, {
          valign: "top",
          styles: {
            backgroundColor: "red",
            fontSize: "20px",
          },
        });
        navigate('/explore')
      }
    }
  };

  const formatCount = (count)=>{
    if (count < 1000) {
        return count.toString();
    } else if (count < 1000000) {
        return (count / 1000).toFixed(1) + 'K';
    } else {
        return (count / 1000000).toFixed(1) + 'M';
    }
  }

  useEffect(() => {
    setLoading(true);
    fetchPost();
    setLoading(false);
  }, []);

  const handleComment = async (e) => {
    e.preventDefault();
    setLoadSubmit(true);
    const comment = document.getElementsByName("comment")[0].value;
    const config = {
      headers: {
        "Content-Type": "application/json",
        Authorization: `Bearer ${token}`,
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
      res.data.comment.commentliked = 0;
      res.data.comment.commentlikes = 0;
      res.data.comment.personal = true;
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
        {(loading || post === null) && <Loader />}
        {!loading && post !== null && (
          <>
          <div className="bg-white w-full md:w-1/2 mx-auto">
              <Post post={post} />
           </div>
            <div className="border p-4 mt-[-20px] shadow-2xl bg-white w-full md:w-1/2 mx-auto">
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
                style={{cursor:"pointer"}}
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
                Comments {comments.length > 0 && `(${formatCount(comments.length)})`}
              </div>
              {comments.length > 0 &&
                comments.map((comment) => <SocialComment key={comment.id} comment={comment} />)}
              <button
              style={{cursor:"pointer"}}
                onClick={loadMore}
                className="p-2 text-black-500 text-center font-bold mt-2"
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



export default SinglePost;
