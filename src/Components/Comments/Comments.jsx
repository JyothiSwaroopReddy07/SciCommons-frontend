import React, { useState, useEffect } from "react";
import "./Comments.css";
import ReactQuill from 'react-quill';
import 'react-quill/dist/quill.snow.css';
import ToastMaker from "toastmaker";
import "toastmaker/dist/toastmaker.css";
import axios from "axios";

const ArticleCommentModal = ({setShowCommentModal, article, Comment, handleComment }) => {

  const [title, setTitle] = useState("");
  const [comment, setComment] = useState("");
  const [loading, setLoading] = useState(false);

  const handleCommentChange = (event) => {
      setComment(event);
  }



  const handleSubmit = async(e) => {
      e.preventDefault();
      setLoading(true);
      const config={
          headers: {
              "Content-Type": "application/json",
              Authorization: `Bearer ${localStorage.getItem("token")}`,
          }
      };
      const comment_Type = (article.isArticleModerator || article.isArticleReviewer || article.isAuthor)?"officialcomment":"publiccomment";
      try {
          const res = await axios.post(`https://scicommons-backend.onrender.com/api/comment/`,
          {Title: title,Comment: comment, article: article.id, Type: 'comment', comment_Type:comment_Type, tag: "public", parent_comment:Comment.id}, 
          config);
          console.log(res);
          setLoading(false);
          setTitle("");
          setComment("");
          await handleComment(res.data.comment);
          ToastMaker("Comment Posted Successfully!!!", 3000, {
              valign: "top",
              styles: {
                backgroundColor: "green",
                fontSize: "20px",
              },
            });
      } catch(err){
          setLoading(false);
          if(err.res.data.error){
              ToastMaker(err.res.data.error, 3000, {
                  valign: "top",
                  styles: {
                    backgroundColor: "red",
                    fontSize: "20px",
                  },
              });
          }
          console.log(err);
      }
  }


  return (
      <>
          <div className="fixed inset-0 flex items-center justify-center w-full z-50 bg-gray-800 bg-opacity-50">
              <div className="flex items-center justify-center w-5/6 my-2 p-4">
                  <div className="bg-slate-200 p-6 rounded-lg max-h-5/6 overflow-hidden w-full">
                  <h2 className="text-xl font-semibold mb-4">Post a Comment</h2>
                  <form onSubmit={handleSubmit}>
                      <div className="mb-4">
                          <label htmlFor="title" className="block font-medium mb-1">
                              Title
                          </label>
                          <input
                              type="text"
                              id="Title"
                              value={title}
                              name="Title"
                              onChange={(e) => setTitle(e.target.value)}
                              className="w-full border border-gray-300 rounded p-2"
                              required
                          />
                      </div>
                      <div className="mb-4">
                          <label htmlFor="comment" className="block font-medium mb-1">
                              Comment
                          </label>
                          <ReactQuill theme="snow" className="bg-white w-full p-2 mb-4 resize-none border rounded max-h-[40vh] overflow-y-auto" value={comment} onChange={handleCommentChange}/>
                      </div>
                      <button
                      type="submit"
                      className="bg-green-500 text-white px-4 py-2 rounded hover:bg-green-600 text-white rounded mr-2 font-semibold"
                      >
                          {
                              loading ? "Posting..." : "Post Comment"
                          }
                      </button>
                      <button
                          className="px-4 py-2 bg-red-500 text-white rounded font-semibold"
                          onClick={()=>{setShowCommentModal(false)}}
                      >
                          Close
                      </button>
                  </form>
              </div>
          </div>
      </div>
      </>
  );
};

const Comments = ({ comment, article, colour }) => {

  const [loading, setLoading] = useState(false);
  const [repliesData, setRepliesData] = useState([]);
  const [show, setShow] = useState(false);
  const [rating, setRating] = useState(comment.userrating?comment.userrating:0);
  const [overallrating, setOverallRating] = useState(comment.commentrating?comment.commentrating:0);
  const [showCommentModal, setShowCommentModal] = useState(false);

  const colorClasses = {
    0: 'bg-slate-100',
    1: 'bg-white',
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

  const handleComment = async(res) => {
    const newReply = [...repliesData,res];
    setRepliesData(newReply);
    setShowCommentModal(false)
  }

  const styleLinksWithColor = (htmlContent) => {
    const coloredLinks = htmlContent.replace(/<a /g, '<a style="color: blue;" ');
    return coloredLinks;
  };

  const fillUserType = () => {
    if(article.isArticleModerator){
      return (<span className="inline-flex items-center gap-1.5 py-1 ml-3 px-1 rounded text-xs font-medium bg-purple-500 text-white">Moderator</span>)
    }
    else if(article.isArticleReviewer){
      return (<span className="inline-flex items-center gap-1.5 py-1 ml-3 px-1 rounded text-xs font-medium bg-purple-500 text-white">Reviewer</span>)
    }
    else if(article.isAuthor) {
      return (<span className="inline-flex items-center gap-1.5 py-1 ml-3 px-1 rounded text-xs font-medium bg-purple-500 text-white">Author</span>)
    }
  }

  const fillConfidence = () => {
    if(comment.confidence === 1){
      return (<span className="text-sm italic">My review is educated guess</span>)
    }
    else if(comment.confidence===2){
      return (<span className="text-sm italic">I am willing to defend my evaluation but Its likely that I didnt understand central parts of paper</span>)
    }
    else if(comment.confidence===3){
      return (<span className="text-sm italic">I am fairly confident that review is correct</span>)
    }
    else if(comment.confidence===4){
      return (<span className="text-sm italic">I am confident but not absolutely certain that my evaluation is correct</span>)
    }
    else if(comment.confidence===5){
      return (<span className="text-sm italic">I am absolutely certain that evaluation is correct and familiar with relevant literature</span>)
    }
  }

  const loadRatingData = async(event) => {
    const rate = overallrating-rating+parseInt(event.target.value);
    setOverallRating(rate);
    setRating(event.target.value);
  }

  const handleSliderChange = async(event) => {
    await loadRatingData(event);
    await handleLike(event);
  };

  const handleLike = async(event) => {
    const config={
      headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${localStorage.getItem("token")}`,
      }
    };
    try {
      const res = await axios.post(`https://scicommons-backend.onrender.com/api/comment/like/`,
      {post:comment.id, value:event.target.value}, 
      config);
      ToastMaker("Comment Rated Successfully!!!", 3000, {
          valign: "top",
          styles: {
            backgroundColor: "green",
            fontSize: "20px",
          },
      });
    } catch(err){
      console.log(err);
      ToastMaker(err.response.data.error, 3000, {
        valign: "top",
        styles: {
          backgroundColor: "red",
          fontSize: "20px",
        },
    });
    }
  }

  const loadData = async (res) => {
    const newReply = [...repliesData, ...res];
    setRepliesData(newReply);
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
        parent_comment: comment.id,
        article: article.id,
      },
    };
    try {
      const res = await axios.get(
        `https://scicommons-backend.onrender.com/api/comment/?limit=20&offset=${repliesData.length}`,
        config
      );
      await loadData(res.data.success.results);
    } catch (err) {
      console.log(err);
    }
    setLoading(false);
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


  return (
    <>
      <div className={`mb-2 w-full ${colorClasses[colour]} shadow-lg rounded px-4 py-2 overflow-x-auto`} data-commentid={comment.id}>
          <div className="flex flex-row items-center" style={{cursor:"pointer"}} onClick={()=>{setShow(!show)}}>
              <div className="flex flex-row items-center">
                <span className='font-bold  relative text-xl text-gray-600 leading-[1.25rem]'>
                  {comment.Title}
                </span>
                <span className=" text-[#777] font-[400] text-[0.55 rem] ml-2  p-2">
                    • by {comment.personal?"you":comment.user}
                </span>
                <span className="text-xs text-slate-400">
                  • {findTime(comment.Comment_date)} •
                </span>
              </div>
              {comment.Type==="review" && 
                <div className="flex ml-2">
                        <svg
                        xmlns="http://www.w3.org/2000/svg"
                        viewBox="0 0 24 24"
                        fill="currentColor"
                        className={`h-5 w-5 ${
                            (comment.rating == null ? 0 : comment.rating) >= 1
                            ? "text-yellow-500"
                            : "text-gray-400"
                        }`}
                        >
                        <path d="M12 1l2.753 8.472h8.938l-7.251 5.269 2.753 8.472L12 18.208l-7.193 5.005 2.753-8.472L.309 9.472h8.938z" />
                        </svg>

                        <svg
                        xmlns="http://www.w3.org/2000/svg"
                        viewBox="0 0 24 24"
                        fill="currentColor"
                        className={`h-5 w-5 ${
                            (comment.rating == null ? 0 : comment.rating) >= 2
                            ? "text-yellow-500"
                            : "text-gray-400"
                        }`}
                        >
                        <path d="M12 1l2.753 8.472h8.938l-7.251 5.269 2.753 8.472L12 18.208l-7.193 5.005 2.753-8.472L.309 9.472h8.938z" />
                        </svg>
                        <svg
                        xmlns="http://www.w3.org/2000/svg"
                        viewBox="0 0 24 24"
                        fill="currentColor"
                        className={`h-5 w-5 ${
                            (comment.rating == null ? 0 : comment.rating) >= 3
                            ? "text-yellow-500"
                            : "text-gray-400"
                        }`}
                        >
                        <path d="M12 1l2.753 8.472h8.938l-7.251 5.269 2.753 8.472L12 18.208l-7.193 5.005 2.753-8.472L.309 9.472h8.938z" />
                        </svg>
                        <svg
                        xmlns="http://www.w3.org/2000/svg"
                        viewBox="0 0 24 24"
                        fill="currentColor"
                        className={`h-5 w-5 ${
                            (comment.rating == null ? 0 : comment.rating) >= 4
                            ? "text-yellow-500"
                            : "text-gray-400"
                        }`}
                        >
                        <path d="M12 1l2.753 8.472h8.938l-7.251 5.269 2.753 8.472L12 18.208l-7.193 5.005 2.753-8.472L.309 9.472h8.938z" />
                        </svg>
                        <svg
                        xmlns="http://www.w3.org/2000/svg"
                        viewBox="0 0 24 24"
                        fill="currentColor"
                        className={`h-5 w-5 ${
                            (comment.rating == null ? 0 : comment.rating) >= 5
                            ? "text-yellow-500"
                            : "text-gray-400"
                        }`}
                        >
                        <path d="M12 1l2.753 8.472h8.938l-7.251 5.269 2.753 8.472L12 18.208l-7.193 5.005 2.753-8.472L.309 9.472h8.938z" />
                        </svg>
                    </div>
                  }
          </div>
          {show && (
          <>
          <div className="w-full" style={{cursor:"pointer"}} onClick={()=>{setShow(!show)}}>
              <span className="inline-flex items-center gap-1.5 py-1 px-1 rounded text-xs font-medium bg-red-500 text-white">{comment.Type}</span>
              <span className="inline-flex items-center gap-1.5 py-1 ml-3 px-1 rounded text-xs font-medium bg-cyan-500 text-white">{comment.tag}</span>
              <span className="inline-flex items-center gap-1.5 py-1 ml-3 px-1 rounded text-xs font-medium bg-orange-500 text-white">{comment.comment_type}</span>
              {fillUserType()}
          </div>
            <div className="container w-full mt-2">
              <div className="text-sm font-semibold text-green-600">
                Comment:
              </div>
              <ReactQuill
                value={styleLinksWithColor(comment.Comment)}
                readOnly={true}
                modules={{toolbar: false}}
              />
            </div>
              {comment.Type==="review" && <div className="container w-full mt-1">
                <span className="font-semibold text-sm text-green-600">Confidence:</span> {fillConfidence()}
              </div>}
              <div className="flex flex-row justify-between items-center">
                  <div className="mb-1 flex flex-row items-center">
                    <div className="text-sm mr-2 font-semibold text-green-600">
                      Rate the Comment:
                    </div>
                    <div className="w-32 my-1 mr-2 relative">
                      <input
                        type="range"
                        min="0"
                        max="5"
                        step="1"
                        value={rating}
                        onChange={handleSliderChange}
                        className="w-full h-2 appearance-none bg-transparent outline-none"
                        style={{
                          backgroundImage: `linear-gradient(to right, #38A169, #38A169 ${rating * 20}%, #E2E8F0 ${rating * 20}%, #E2E8F0 100%)`,
                          borderRadius: '10px',
                        }}
                      />
                      <div className="flex justify-between mt-2">
                        <span className="text-xs text-gray-500">Bad</span>
                        <span className="text-xs text-gray-500">{rating}</span>
                        <span className="text-xs text-gray-500">Excellent</span>
                      </div>
                      <div
                        className="bg-green-600 rounded-full"
                        style={{
                          transform: 'translateY(-50%)',
                          left: `${rating * 20}%`,
                        }}
                      ></div>
                    </div>
                    <div className="text-xl font-semibold ml-3">
                      {overallrating}
                    </div>
                  </div>
                <div className="flex flex-row">
                <span className="box-content text-white bg-[#4d8093] text-[0.55 rem] border-solid ml-2 mr-2 md:font-bold p-2 pt-0 rounded" style={{cursor:"pointer"}} onClick={()=>{setShowCommentModal(true);}}>
                    edit comment
                  </span>
                  <span className="box-content text-white bg-[#4d8093] text-[0.55 rem] border-solid ml-2 md:font-bold p-2 pt-0 rounded" style={{cursor:"pointer"}} onClick={()=>{setShowCommentModal(true);}}>
                    reply
                  </span>
                </div>
              </div>
            <div className="ml-10">
            {repliesData.length > 0 &&
              repliesData.map((reply) => <Comments key={reply.id} comment={reply} article={article} colour={colour===1?0:1}/>)}
            </div>
            {comment.replies > 0 && (
              <button style={{cursor:"pointer"}} onClick={handleReply} className="ml-5 text-xs mt-4">
                {loading ? (
                  <span className="text-gray-600 font-bold">Loading...</span>
                ) : (
                  <span className="text-gray-600 font-bold">{fillLoad()}</span>
                )}
              </button>
            )}

          </>)
          }
          {showCommentModal && <ArticleCommentModal setShowCommentModal={setShowCommentModal} article={article} Comment={comment} handleComment={handleComment}/>}
      </div>
    </>
  );
};

export default Comments;
