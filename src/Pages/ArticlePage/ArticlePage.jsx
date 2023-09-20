import React, {useState, useEffect} from 'react'
import img from './file.png'
import cal from './calendar.png'
import folder from './folder.png'
import eye from './eye-open.png'
import dublicate from './duplicate.png'
import bookmark from './bookmark.png'
import Navbar from '../../Components/NavBar/NavBar'
import {useParams, useNavigate} from 'react-router-dom'
import axios from 'axios'
import Loader from '../../Components/Loader/Loader'
import Comments from '../../Components/Comments/Comments'
import {AiFillHeart, AiTwotoneStar, AiOutlineHeart} from 'react-icons/ai'
import {MdOutlineViewSidebar} from 'react-icons/md'
import './ArticlePage.css'
import ReactQuill from 'react-quill';
import 'react-quill/dist/quill.snow.css';
import ToastMaker from "toastmaker";
import "toastmaker/dist/toastmaker.css";


const ArticleCommentModal = ({setShowCommentModal, article, handleComment }) => {

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
            {Title: title,Comment: comment, article: article.id, Type: 'comment', comment_Type:comment_Type, tag: "public", parent_comment:null, version:null}, 
            config);
            setLoading(false);
            setTitle("");
            setComment("");
            await handleComment(res.data.comment);
            setShowCommentModal(false);
            ToastMaker("Comment Posted Successfully!!!", 3000, {
                valign: "top",
                styles: {
                  backgroundColor: "green",
                  fontSize: "20px",
                },
              });
        } catch(err){
            setLoading(false);
            if(err.response.data.error){
                ToastMaker(err.response.data.error, 3000, {
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

const ArticleReviewModal = ({setShowReviewModal, article, handleComment}) => {

    const [title, setTitle] = useState("");
    const [comment, setComment] = useState("");
    const [loading, setLoading] = useState(false);
    const [rating, setRating] = useState(0);
    const [confidence, setConfidence] = useState(0);

    const handleBodyChange = (event) => {
        setComment(event);
    }
    const comment_Type = (article.isArticleModerator || article.isArticleReviewer || article.isAuthor)?"officialcomment":"publiccomment";

    const handleSubmit = async(e) => {
        e.preventDefault();
        setLoading(true);
        const config={
            headers: {
                "Content-Type": "application/json",
                Authorization: `Bearer ${localStorage.getItem("token")}`,
            }
        };
        try {
            const res = await axios.post(`https://scicommons-backend.onrender.com/api/comment/`,
            {Title: title,Comment: comment, article: article.id, rating: rating, confidence: confidence, Type: 'review',comment_Type: comment_Type, tag:"public", parent_comment:null,version:null}, 
            config);
            setLoading(false);
            setTitle("");
            setComment("");
            setRating(0);
            await handleComment(res.data.comment);
            setShowReviewModal(false);
            ToastMaker("Review Posted Successfully!!!", 3000, {
                valign: "top",
                styles: {
                  backgroundColor: "green",
                  fontSize: "20px",
                },
            });
        } catch(err){
            setLoading(false);
            if(err.response.data.error){
                ToastMaker(err.response.data.error, 3000, {
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

    const handleSliderChange = (event) => {
        setRating(event.target.value);
    };

    const handleSelectChange = (event) => {
        setConfidence(event.target.value);
    };


    return (
        <>
            <div className="fixed inset-0 flex items-center justify-center w-full z-50 bg-gray-800 bg-opacity-50">
                <div className="flex items-center justify-center w-5/6 my-2 p-4">
                    <div className="bg-slate-200 p-6 rounded-lg max-h-5/6 overflow-hidden w-full">
                    <h2 className="text-xl font-semibold mb-4">Post a Review</h2>
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
                            <ReactQuill theme="snow" className="bg-white w-full p-2 mb-4 resize-none border rounded max-h-[40vh] overflow-y-auto" value={comment} onChange={handleBodyChange}/>
                        </div>
                        <div className="mb-1">
                            <label htmlFor="rating" className="block font-medium mb-1">
                                Rating
                            </label>
                            <div className="w-64  my-1">
                                <input
                                    type="range"
                                    min="0"
                                    max="5"
                                    step="1"
                                    value={rating}
                                    onChange={handleSliderChange}
                                    className="slider-thumb w-full appearance-none h-2 bg-gray-300 focus:outline-none"
                                />
                                <div className="flex justify-between mt-2">
                                    <span className="text-sm">0</span>
                                    <span className="text-sm">{rating}</span>
                                    <span className="text-sm">5</span>
                                </div>
                                </div>
                        </div>
                        <div className="w-64 my-2">
                            <label htmlFor="select" className="block text-sm font-medium text-gray-700">
                                Confidence
                            </label>
                            <select
                                id="select"
                                value={confidence}
                                onChange={handleSelectChange}
                                className="mt-1 block w-full p-2 border border-gray-300 bg-white rounded-md shadow-sm focus:ring focus:ring-indigo-300 focus:outline-none"
                            >
                                <option value="">Select...</option>
                                <option value="5">I am absolutely certain that evaluation is correct and familiar with relevant literature</option>
                                <option value="4">I am confident but not absolutely certain that my evaluation is correct</option>
                                <option value="3">I am fairly confident that review is correct</option>
                                <option value="2">I am willing to defend my evaluation but Its likely that I didnt understand central parts of paper</option>
                                <option value="1">My review is educated guess</option>
                            </select>
                        </div>
                        <button
                        type="submit"
                        className="bg-green-500 text-white px-4 py-2 rounded hover:bg-green-600 text-white rounded mr-2 font-semibold"
                        >
                            {
                                loading ? "Posting..." : "Post Review"
                            }
                        </button>
                        <button
                            className="px-4 py-2 bg-red-500 text-white rounded font-semibold"
                            onClick={()=>{setShowReviewModal(false)}}
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

const ArticleDecisionModal = ({setShowDecisionModal, article, handleComment}) => {

    const [title, setTitle] = useState("");
    const [comment, setComment] = useState("");
    const [loading, setLoading] = useState(false);
    const [decision, setDecision] = useState("");

    const handleBodyChange = (event) => {
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
            {Title: title,Comment: comment, article: article.id,decision: decision, Type: 'decision',comment_Type: comment_Type, tag:"public",parent_comment:null}, 
            config);
            setLoading(false);
            setTitle("");
            setComment("");
            setDecision("");
            await handleComment(res.data.comment);
            setShowDecisionModal(false);
            ToastMaker("Decision Posted Successfully!!!", 3000, {
                valign: "top",
                styles: {
                  backgroundColor: "green",
                  fontSize: "20px",
                },
            });
        } catch(err){
            setLoading(false);
            if(err.response.data.error){
                ToastMaker(err.response.data.error, 3000, {
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

    const handleSelectChange = (event) => {
        setDecision(event.target.value);
    };

    return (
        <>
            <div className="fixed inset-0 flex items-center justify-center z-50 bg-gray-800 bg-opacity-50">
                <div className="flex items-center justify-center w-5/6 p-4">
                    <div className="bg-gray-200 p-6 rounded-lg w-full max-h-5/6 overflow-y-auto">
                    <h2 className="text-xl font-semibold mb-4">Post a Decision</h2>
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
                            <ReactQuill theme="snow" className="bg-white w-full p-2 mb-4 resize-none border rounded max-h-[50vh] overflow-y-auto" value={comment} onChange={handleBodyChange}/>
                        </div>
                        <div className="w-64 my-2">
                            <label htmlFor="select" className="block text-sm font-medium text-gray-700">
                                Decision
                            </label>
                            <select
                                id="select"
                                value={decision}
                                onChange={handleSelectChange}
                                className="mt-1 block w-full p-2 border border-gray-300 bg-white rounded-md shadow-sm focus:ring focus:ring-indigo-300 focus:outline-none"
                            >
                                <option value="">Select...</option>
                                <option value="reject">Accept</option>
                                <option value="accept">Reject</option>
                            </select>
                        </div>
                        <button
                        type="submit"
                        className="bg-green-500 text-white px-4 py-2 rounded hover:bg-blue-600 mr-2 font-semibold"
                        >
                            {
                                loading ? "Posting..." : "Post Decision"
                            }
                        </button>
                        <button
                            className="px-4 py-2 bg-red-500 text-white rounded font-semibold"
                            onClick={()=>{setShowDecisionModal(false)}}
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


const  ArticlePage = () => {


    const {articleId} = useParams();
    const [currentState, setcurrentState] = useState(1);
    const navigate = useNavigate();
    const [article, setArticle] = useState(null);
    const [loading, setLoading] = useState(true);
    const [comments, setComments] = useState(null);
    const [showCommentModal, setShowCommentModal] = useState(false);
    const [showDecisionModal, setShowDecisionModal] = useState(false);
    const [showReviewModal, setShowReviewModal] = useState(false);
    const [loadComments, setLoadComments] = useState(false);

    const loadArticleData = async (res) => {
        setArticle(res);
        await updateViews();
    }
    
    const loadCommentData = async (res) => {
        setComments(res);
    }

    const updateViews = async () => {
        const config={
            headers: {
                "Content-Type": "application/json",
                Authorization: `Bearer ${localStorage.getItem("token")}`,
            }
        };
        try{
            const res = await axios.put(`https://scicommons-backend.onrender.com/api/article/${articleId}/updateviews/`,config);
        }   catch(err){
            console.log(err);
        }
    }

    useEffect (() => {

        const getArticle = async () => {
            setLoading(true)
            const config={
                    headers: {
                        "Content-Type": "application/json",
                        Authorization: `Bearer ${localStorage.getItem("token")}`,
                }
            };
            try {
                const res = await axios.get(`https://scicommons-backend.onrender.com/api/article/${articleId}`,config);
                console.log(res.data.success);
                await loadArticleData(res.data.success);
            } catch(err){
                console.log(err);
                if(err.response.data.detail==="Not found."){
                    ToastMaker("Article doesn't exists!!!", 3000, {
                        valign: "top",
                        styles: {
                          backgroundColor: "red",
                          fontSize: "20px",
                        },
                      });
                    navigate('/articles');
                }
            }
            setLoading(false);
        }

        const getComments = async () => {
            setLoading(true);
            const config={
                    headers: {
                        "Content-Type": "application/json",
                        Authorization: `Bearer ${localStorage.getItem("token")}`,
                    },
                    params:{
                        article: articleId
                    }
            };
            try {
                const res = await axios.get(`https://scicommons-backend.onrender.com/api/comment/`, config);
                await loadCommentData(res.data.success.results);
            } catch(err){
                console.log(err);
            }
            setLoading(false);
        }
        getArticle();
        getComments();
    },[]);

    const handleProfile = (data) => {
        console.log(data);
        navigate(`/profile/${data}`);
    }

    const handleFile = () => {
        window.open(article.article_file_url);
    }

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

    const handleFavourites = async () => {
        const config={
            headers: {
                "Content-Type": "application/json",
                Authorization: `Bearer ${localStorage.getItem("token")}`,
            }
        };
        if(article.isFavourite === false) {
            try {
                const res = await axios.post(`https://scicommons-backend.onrender.com/api/article/favourite/`,{article:articleId}, config);
                const newArticle = {...article, isFavourite: true, favourites: article.favourites+1};
                await loadArticleData(newArticle);
            } catch(err){
                console.log(err);
            }
        } else {
            try {
                const res = await axios.post(`https://scicommons-backend.onrender.com/api/article/unfavourite/`,{article:articleId}, config);
                const newArticle = {...article, isFavourite: false, favourites: article.favourites-1};
                await loadArticleData(newArticle);
            } catch(err){
                console.log(err);
            }
        }
    }

    const onclickFuntion = (indext)=>{
        setcurrentState(indext);
    };

    const handleShow = () => {
        if(currentState===1){
            if(article.isArticleModerator){
                setShowDecisionModal(true);
            } else {
                setShowReviewModal(true);
            }
        } else {
            setShowCommentModal(true);
        }
    }

    const fillLoad = () => {
        if (comments.length === 0) {
          return `No comments to Load`;
        } else if (article.commentcount > comments.length) {
          return `Load ${article.commentcount - comments.length} more comments`;
        } else {
          return "";
        }
      };

    const loadMore = async () => {
        setLoadComments(true);
        const config = {
          headers: {
            "Content-Type": "application/json",
            Authorization: `Bearer ${localStorage.getItem("token")}`,
          },
          params: {
            article:articleId,
          },
        };
        try {
          const res = await axios.get(`https://scicommons-backend.onrender.com/api/comment/?limit=20&offset=${comments.length}`, config);
          await loadCommentData([...comments, ...res.data.success.results]);
        } catch (err) {
          console.log(err);
        }
        setLoadComments(false);
    };

    const handleComment = async(res) => {
        const newReply = [res,...comments];
        setComments(newReply);
    }

    const formatCount = (count)=>{
        if (count < 1000) {
            return count.toString();
        } else if (count < 1000000) {
            return (count / 1000).toFixed(1) + 'K';
        } else {
            return (count / 1000000).toFixed(1) + 'M';
        }
    }

    return (
        <div className="bg-white min-h-screen min-w-[800px]">
        <Navbar/>
        {(loading || article===null || comments===null) && <Loader/>}
        {!loading && article && comments && (
            < div className="bg-white">
            <div className="flex justify-center bg-white w-full md:w-5/6 mt-[1rem] mx-auto p-2 overflow-hidden">

                <div className=' mt-1 w-full  justify-self-center bg-white'>
                    <div className="py-5 ">
                        <div className="flex bg-white flex-row justify-between">

                            <div className='text-lg md:text-3xl font-[700] text-gray-600 bg-white'>
                                {article.article_name.replace(/_/g, " ")}
                            </div>
                            <div className="flex flex-row">
                                <div className="icon mr-2" style={{cursor:"pointer"}} onClick={handleFavourites}>
                                    {
                                        article.isFavourite === true ? (<AiFillHeart className='w-[40px] h-[40px]'/>):(<AiOutlineHeart className='w-[40px] h-[40px]'/>) 
                                    }
                                </div>
                                <div className="icon" onClick={handleFile}>
                                    <img className='w-[40px] h-[40px]' src={img}></img>
                                </div>
                            </div>
                        </div>
                        <div className="py-1 bg-white">

                            <span className="italic font-sans text-md md:text-lg leading-[1.5rem] ">

                                {article.authors.map((data, i) => {
                                    return (
                                        <span key={i} style={{cursor:"pointer"}} onClick={(e)=>{e.preventDefault();handleProfile(data)}}>
                                            {data } 
                                            <span>  </span>
                                             
                                        </span>
                                    );

                                })}
                                .
                            </span>
                        </div>
                        <div className="bg-white">
                            <span className="text-[.75rem] p-0">
                                <img className='w-[.875rem] inline mb-1' src={cal} ></img>
                                <span className="pl-1">
                                    Published:
                                </span>
                                {article.published_date===null?" Not Published":findTime(article.published_date)}
                                <img className='w-[.875rem] inline mb-1 mr-1 ml-4' src={folder} ></img>

                                {article.published===null?" Not Yet": `Accepted by ${article.published}`}
                                <img className='w-[.875rem] inline mb-1 mr-1 ml-4' src={eye} ></img>

                                {article.status==="public"?"Everyone":"Private"}
                                <AiFillHeart className='w-[.875rem] inline mb-1 mr-1 ml-4' />
                                {formatCount(article.favourites)}
                                <MdOutlineViewSidebar className="w-[.875rem] inline mb-1 mr-1 ml-4" />
                                {formatCount(article.views)}
                                <AiTwotoneStar className="w-[.875rem] inline mb-1 mr-1 ml-4" />
                                {article.rating===null? "0": article.rating}
                            </span>
                        </div>

                    </div>
                    <div className="text-[.75rem] leading-[1.125rem] mt-[-0.875rem] bg-white">
                        <span className="block">
                            <strong className='text-green-700'> Abstract : </strong>
                              <span>{article.Abstract}</span>
                        </span>
                        <div className="block">
                            <strong className='text-green-700 font-[700]'> License : </strong>
                            <span>{article.license===null ?"None": article.license}</span>
                        </div>
                        <div className="block">
                            <strong className='text-green-700 font-[700]'>Code : </strong>
                            <a href={article.Code} className='text-[#337ab7]'> {article.Code}</a>
                        </div>
                        <div className="block">
                            <strong className='text-green-700 font-[700]'> Video Link: </strong>
                            <a href={article.video} className='text-[#337ab7]'> {article.video}</a>                          
                        </div>
                        {
                            article.link && (
                                <div className="block">
                                    <strong className='text-green-700 font-[700]'> Article Link: </strong>
                                    <a href={article.link} className='text-[#337ab7]'> {article.link}</a>                          
                                </div>
                            )
                        }
                        <div className="block">
                            <strong className='text-green-700 font-[700]'> Submission Date : </strong>
                            <span > {findTime(article.Public_date)} </span>                            
                        </div>

                    </div>

                    <div className="ab m-0">
                        <div className='bg-white border-[#3f6978] border-solid'>
                            <div className="float-right">
                                <span className='text-[0.75rem] text-gray-600'>
                                    Add:
                                </span>
                                <span className="box-content text-white bg-[#4d8093] text-[0.55 rem] border-solid ml-2 md:font-bold p-2 pt-0 rounded" style={{cursor:"pointer"}} onClick={handleShow}>
                                    {article.isArticleModerator && currentState === 1 && "add decision"}
                                    {article.isArticleModerator === false && currentState === 1 && "add review"}
                                    {currentState!==1 && "add comment"}
                                </span>
                            </div>
                        </div>
                    </div>
                </div>
            </div>
                 <div className="flex flex-col w-full md:w-5/6 bg-white mt-[1rem] mx-auto p-2 overflow-hidden">
                    <div className="w-full">
                        <div className='w-full flex mx-auto mt-4'>
                            <button className={currentState === 1 ? 'mb-2 text-sm md:text-xl text-green-600 px-2 font-bold md:px-5 py-2 border-b-2 border-green-600' : 'mb-2 text-sm font-bold md:text-xl px-2 md:px-5 text-gray-600 border-b-2 border-gray-200 py-2'} 
                            style={{cursor:"pointer"}} onClick={()=> onclickFuntion(1)}>
                                Reviews
                            </button>
                            <button className={currentState === 2 ? 'mb-2 text-sm md:text-xl text-green-600 px-2 font-bold md:px-5 py-2 border-b-2 border-green-600' : 'mb-2 text-sm font-bold md:text-xl px-2 md:px-5 text-gray-600 border-b-2 border-gray-200  py-2'} 
                            style={{cursor:"pointer"}} onClick={()=> onclickFuntion(2)}>
                                Blogs
                            </button>
                            <button className={currentState === 3 ? 'mb-2 text-sm md:text-xl text-green-600 px-2 font-bold md:px-5 py-2  border-b-2 border-green-600' : 'mb-2 text-sm font-bold md:text-xl px-2 md:px-5 text-gray-600 border-b-2 border-gray-200 py-2'} 
                            style={{cursor:"pointer"}} onClick={()=> onclickFuntion(3)}>
                                    Videos
                            </button>
                            <button className={currentState === 4 ? 'mb-2 text-sm md:text-xl text-green-600 px-2 font-bold md:px-5 py-2 border-b-2 border-green-600' : 'mb-2 text-sm font-bold md:text-xl px-2 md:px-5 text-gray-600 border-b-2 border-gray-200 py-2'} 
                            style={{cursor:"pointer"}} onClick={()=> onclickFuntion(4)}>
                                    Discussions
                            </button>

                        </div>
                    </div>
                    <div className="w-full min-h-screen">
                        <div className='p-3'>
                            {  comments.length>0 && comments.map((comment) => (
                                        <Comments key={comment.id} comment={comment} article={article} colour={1}/>
                                ))  
                            }
                            <div className="w-full flex flex-row justify-center items-center">
                                <button
                                    style={{cursor:"pointer"}}
                                        onClick={loadMore}
                                        className="p-2 text-green-500 text-2xl text-center font-bold mt-2"
                                    >
                                        {loadComments ? "Loading..." : fillLoad()}
                                </button>
                            </div>
                        </div>
                    </div>
                 </div>
                 {showCommentModal && (<ArticleCommentModal setShowCommentModal={setShowCommentModal} article={article} handleComment={handleComment}/>)}
                 {showReviewModal && (<ArticleReviewModal setShowReviewModal={setShowReviewModal} article={article} handleComment={handleComment}/>)}
                 {showDecisionModal && article.isArticleModerator && (<ArticleDecisionModal setShowDecisionModal={setShowDecisionModal} article={article} handleComment={handleComment}/>)}
            </div>
        )}
        </div>
    )
}

export default ArticlePage;
