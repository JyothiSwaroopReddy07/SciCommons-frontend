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


const  ArticlePage = () => {


    const {articleId} = useParams();
    const [currentState, setcurrentState] = useState(1);
    const navigate = useNavigate();
    const [article, setArticle] = useState(null);
    const [loading, setLoading] = useState(true);
    const [comments, setComments] = useState([]);

    const loadArticleData = async (res) => {
        setArticle(res);
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
                await loadArticleData(res.data.success);
                await updateViews();
            } catch(err){
                console.log(err);
            }
            setLoading(false);
        }
        const getComments = async () => {
            setLoading(true);
            const config={
                    headers: {
                        "Content-Type": "application/json",
                        Authorization: `Bearer ${localStorage.getItem("token")}`,
                    }
            };
            try {
                const res = await axios.get(`https://scicommons-backend.onrender.com/api/comment/`,{article: articleId}, config);
                await loadCommentData(res.data.success);
            } catch(err){
                console.log(err);
            }
            setLoading(false);
        }
        getArticle();
        getComments();
    },[]);

    const handleProfile = (data) => {
        navigate(`/profile/${data}`);
    }

    const handleFile = () => {
        console.log(article.article_file_url);
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
        console.log("jyothi swaroop");
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

    return (
        <>
        <Navbar/>
        {loading && <Loader/>}
        {!loading && article && (
            <>
            <div className="flex justify-center  w-full md:w-5/6 bg-[#fffdfa] mt-[1rem] mx-auto p-2 overflow-hidden">

                <div className=' mt-1 w-full  justify-self-center bg-[#fffdfa]'>
                    <div className="py-5 ">
                        <div className="flex bg-[#fffdfa] flex-row justify-between">

                            <div className='text-lg md:text-3xl font-[700] text-gray-600 bg-[#fffdfa]'>
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
                        <div className="py-1 bg-[#fffdfa]">

                            <span className="italic font-sans text-md md:text-lg leading-[1.5rem] ">

                                {article.authors.map((data, i) => {
                                    return (
                                        <span key={i} style={{cursor:"pointer"}} onClick={(data)=>{handleProfile(data)}}>
                                            {data } 
                                            <span>  </span>
                                             
                                        </span>
                                    );

                                })}
                                .
                            </span>
                        </div>
                        <div className="bg-[#fffdfa]">
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
                                <img className='w-[.875rem] inline mb-1 mr-1 ml-4' src={dublicate} ></img>

                                Versions
                                <AiFillHeart className='w-[.875rem] inline mb-1 mr-1 ml-4' />
                                {article.favourites}
                                <MdOutlineViewSidebar className="w-[.875rem] inline mb-1 mr-1 ml-4" />
                                {article.views}
                                <AiTwotoneStar className="w-[.875rem] inline mb-1 mr-1 ml-4" />
                                {article.rating===null? "0": article.rating}
                            </span>
                        </div>

                    </div>
                    <div className="text-[.75rem] leading-[1.125rem] mt-[-0.875rem] bg-[#fffdfa]">
                        <span className="block">
                            <strong className='text-green-700'> Abstract : </strong>
                              <span>{article.Abstract}</span>
                        </span>
                        <div className="block">
                            <strong className='text-green-700 font-[700]'> License : </strong>
                            <span>{article.license===null ?"None": article.license}</span>
                        </div>
                        <div className="bock">
                            <strong className='text-green-700 font-[700]'> Submission Length : </strong>
                           <span>{article.sub_len}</span>

                        </div>
                        <div className="bock">
                            <strong className='text-green-700 font-[700]'>Code : </strong>
                            <a href={article.Code} className='text-[#337ab7]'> {article.Code}</a>
                        </div>
                        <div className="bock">
                            <strong className='text-green-700 font-[700]'> Video Link: </strong>
                            <a href={article.video} className='text-[#337ab7]'> {article.video}</a>                          
                        </div>
                        {
                            article.link && (
                                <div className="bock">
                                    <strong className='text-green-700 font-[700]'> Video Link: </strong>
                                    <a href={article.link} className='text-[#337ab7]'> {article.link}</a>                          
                                </div>
                            )
                        }
                        <div className="bock">
                            <strong className='text-green-700 font-[700]'> Submission Date : </strong>
                            <span > {findTime(article.Public_date)} </span>                            
                        </div>

                    </div>

                    <div className="ab m-0">
                        <div className='bg-[#fffdfa] border-[#3f6978] border-solid'>
                            <div className="float-right">
                                <span className='text-[0.75rem] text-gray-600'>
                                    Add:
                                </span>
                                <span className="box-content text-white bg-[#4d8093] text-[0.55 rem] border-solid ml-2 md:font-bold p-2 pt-0 rounded">
                                    <a href='' className='text-[0.75rem]'>
                                        public comment
                                    </a>
                                </span>
                            </div>


                        </div>
                    </div>
                </div>
            </div>
                 <div className="flex w-full md:w-5/6 bg-[#fffdfa] mt-[1rem] mx-auto p-2 overflow-hidden">
                    <div>
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
                        <div>
                            <div className='p-3 w-full md:w-4/5 mx-auto'>
                                {  comments.length>0 && comments.map((comment) => (
                                        <Comments comment={comment}/>
                                    ))  
                                }
                                {
                                    comments.length==0 && (
                                        <div className="flex justify-center">
                                            <div className="text-[1.25rem] text-green-600">
                                                No Comments
                                            </div>
                                        </div> 
                                    )          
                                }
                            </div>
                        </div>
                    </div>
                 </div>
            </>
        )}
        </>
    )
}

export default ArticlePage;
