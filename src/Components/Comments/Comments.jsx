import React, { useState, useEffect } from "react";
import pencil from "./pencil.png";
import "./Comments.css";
import ReactQuill from 'react-quill';
import 'react-quill/dist/quill.snow.css';
import ToastMaker from "toastmaker";
import "toastmaker/dist/toastmaker.css";


const Comments = ({ comment, article }) => {

  console.log(comment);

  const [loading, setLoading] = useState(false);
  const [repliesData, setRepliesData] = useState([]);
  const [show, setShow] = useState(false);

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

  const styleLinksWithColor = (htmlContent) => {
    const coloredLinks = htmlContent.replace(/<a /g, '<a style="color: blue;" ');
    return coloredLinks;
  };

  const fillUserType = () => {
    if(article.isArticleModerator){
      return (<span class="inline-flex items-center gap-1.5 py-1.5 ml-3 px-3 rounded-full text-xs font-medium bg-purple-500 text-white">Moderator</span>)
    }
    else if(article.isArticleReviewer){
      return (<span class="inline-flex items-center gap-1.5 py-1.5 ml-3 px-3 rounded-full text-xs font-medium bg-purple-500 text-white">Reviewer</span>)
    }
    else if(article.isAuthor) {
      return (<span class="inline-flex items-center gap-1.5 py-1.5 ml-3 px-3 rounded-full text-xs font-medium bg-purple-500 text-white">Author</span>)
    }
  }

  return (
    <>
      <div key={comment.id} className="mb-2 w-full bg-slate-200 shadow-xl rounded p-2">
          <div className="flex flex-row items-center" style={{cursor:"pointer"}} onClick={()=>{setShow(!show)}}>
              <div className="flex flex-row items-center">
                <span className='font-bold  relative  text-[#2c3a4a]  leading-[1.25rem]'>
                  {comment.Title}
                </span>
                <span className=" text-[#777] font-[400] text-[0.55 rem] ml-2  p-2">
                    • by {comment.user}
                </span>
                <span className="text-xs text-slate-400">
                  • {findTime(comment.Comment_date)} •
                </span>
              </div>
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
        </div>
          {show && (
          <>
            <div className="w-full">
              <span class="inline-flex items-center gap-1.5 py-1.5 px-3 rounded-full text-xs font-medium bg-red-500 text-white">{comment.Type}</span>
              <span class="inline-flex items-center gap-1.5 py-1.5 ml-3 px-3 rounded-full text-xs font-medium bg-cyan-500 text-white">{comment.tag}</span>
              <span class="inline-flex items-center gap-1.5 py-1.5 ml-3 px-3 rounded-full text-xs font-medium bg-orange-500 text-white">{comment.comment_type}</span>
              {fillUserType()}
            </div>
            <div className="container w-full mt-2">
              <div className="text-xl">
                Comment:
              </div>
              <ReactQuill
                value={styleLinksWithColor(comment.Comment)}
                readOnly={true}
                modules={{toolbar: false}}
                className="bg-white"
              />
            </div>
          </>)
          }
      </div>
    </>
  );
};

export default Comments;
