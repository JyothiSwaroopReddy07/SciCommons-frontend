import React, { useState, useEffect } from "react";
import img from "./file.png";
import cal from "./calendar.png";
import folder from "./folder.png";
import eye from "./eye-open.png";
import dublicate from "./duplicate.png";
import Navbar from "../../Components/NavBar/NavBar";
import { useParams, useNavigate } from "react-router-dom";
import axios from "axios";
import Loader from "../../Components/Loader/Loader";
import { AiFillHeart, AiTwotoneStar, AiOutlineHeart } from "react-icons/ai";
import { MdOutlineViewSidebar } from "react-icons/md";
import "./AuthorArticlePage.css";
import ToastMaker from "toastmaker";
import "toastmaker/dist/toastmaker.css";

const DisplayCommunity = ({article}) => {

    const [searchTerm, setSearchTerm] = useState('');
    const [articles, setArticles] = useState([]);
    const [loading, setLoading] = useState(false);
    const [sortedArticles, setSortedArticles] = useState([]);
    const [selectedOption, setSelectedOption] = useState('All');

    const navigate = useNavigate();

    const loadData = async (res) => {
        setArticles(res);
        setSortedArticles(res);
    }

    const handleOptionChange = async(e) => {
        setSelectedOption(e.target.value);
        if(e.target.value!=="All")
        {
            const newArticles = articles.filter((item)=>{
                return item.status===e.target.value
            })
            await loadSortedArticles(newArticles);
        } else{
            await loadSortedArticles([...articles]);
        }
    };

    const loadSortedArticles = async (res) => {
        setSortedArticles(res);
    }

    const fetchArticles = async () => {
        setLoading(true)
        const token = localStorage.getItem('token');
        const config = {
            headers: {
                Authorization: `Bearer ${token}`,
            },
        };
        try {
            const response = await axios.get(
                `https://scicommons-backend.onrender.com/api/article/${article}/isapproved/`,
                config
            );
            await loadData(response.data.success);
        } catch (error) {
            console.error(error);
        } finally {
            setLoading(false)
        }   
    };

    useEffect(() => {
        fetchArticles();
    }, []);

    const handleSearch = async(e) => {
        e.preventDefault();
        setLoading(true);
        const newArticles = [...articles].filter((article) => {
            return article.community.Community_name.toLowerCase().includes(searchTerm.toLowerCase());
        });
        await loadSortedArticles(newArticles);
        setLoading(false);
    }

    const handleNavigate = (index) => {
        navigate(`/community/${index}`)
    } 

    return (
        <>
            <div className="flex flex-col items-center justify-center w-full bg-amber-50">
                <form className="w-5/6 px-4 mt-1 md:w-2/3" onSubmit={handleSearch}>
                    <div className="relative">
                        <div>
                            <svg
                                xmlns="http://www.w3.org/2000/svg"
                                className="absolute top-0 bottom-0 w-6 h-6 my-auto text-gray-400 left-3"
                                fill="none"
                                viewBox="0 0 24 24"
                                stroke="currentColor"
                            >
                                <path
                                    strokeLinecap="round"
                                    strokeLinejoin="round"
                                    strokeWidth={2}
                                    d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z"
                                />
                            </svg>
                            <input
                                type="text"
                                placeholder="Search using keywords, authors, articles"
                                value={searchTerm}
                                onChange={(e) => setSearchTerm(e.target.value)}
                                className="w-full py-3 pl-12 pr-4 text-green-600 border rounded-md outline-none bg-gray-50 focus:bg-white focus:border-green-600"
                            />
                        </div>
                        <button
                            type="submit"
                            onClick={handleSearch}
                            className="absolute top-0 bottom-0 right-0 px-4 py-3 text-sm font-semibold text-white bg-gray-600 rounded-md hover:bg-gray-700 focus:bg-gray-700"
                        >
                            Search
                        </button>
                    </div>
                </form>
                <div className="flex flex-row flex-wrap justify-center items-center mb-5 w-full md:w-2/3">
                    <div className="flex flex-row items-center mt-3">
                        <div className="text-sm md:text-xl font-semibold mr-2">
                            Apply Filters: 
                        </div>
                        <div className="relative inline-flex mr-2">
                            <select
                                className="bg-white text-gray-800 text-sm md:text-lg border rounded-lg px-4 py-1 transition duration-150 ease-in-out"
                                value={selectedOption}
                                onChange={handleOptionChange}
                            >
                                <option value="All">All</option>
                                <option value="submitted">Submitted</option>
                                <option value="rejected">Rejected</option>
                                <option value="in review">In Review</option>
                                <option value="accepted">Accepted</option>
                                <option value="published">Published</option>
                            </select>
                        </div>
                    </div>
                </div>
            </div>

            <div className="flex flex-row w-full bg-amber-50 justify-center min-h-screen mb-5">
                { loading ? <Loader /> :  (
                <ul className="mt-2 flex flex-col w-full md:w-3/4">
                    {
                        sortedArticles.length > 0 ? (
                        sortedArticles.map((item) => (
                        <li key={item.community.id} className="p-2 bg-white m-1 rounded-md shadow-md w-full">
                                    <div className="flex flex-row justify-between items-center w-full" onClick={()=>{handleNavigate(item.community.Community_name)}} style={{cursor:"pointer"}}>
                                        <h3 className="text-xl font-medium text-green-600">
                                            {item.community.Community_name}
                                        </h3>
                                        <p className="text-gray-500 mt-2 pr-2">
                                            <span className="text-green-700">Status : </span>
                                            <span className="inline-flex items-center gap-1.5 py-1 px-1 rounded text-sm font-medium text-red-500">{item.status}</span>
                                        </p>
                                    </div>
                        </li>
                        ))):(<h1 className="text-2xl font-bold text-gray-500">No Communities Found</h1>)
                    }
                </ul>) }
            </div>
        </>
    )
};

const SubmitCommunity = ({article, setShow}) => {
    const [community, setCommunity] = useState("");
    const [loading, setLoading] = useState(false);
    const [communityId,setCommunityId] = useState(0);


    const verify = async(res) => {
        for(let i=0;i<res.length;i++){
            if(res[i].Community_name.toLowerCase() === community.toLowerCase()){
                return res[i].id;
            }
        }
        return 0;
    }

    const handleCommunityName = async() => {
        const config = {
            headers: {
                "Content-Type": "application/json",
                Authorization: `Bearer ${localStorage.getItem("token")}`,
            },
        }
        try{
            const res = await axios.get(`https://scicommons-backend.onrender.com/api/community/?search=${community.toLowerCase()}`,config);
            console.log(res)
            const ans = await verify(res.data.success.results)
            if(ans){
                return ans;
            } else {
                ToastMaker("Enter Correct Community Name", 3000, {
                    valign: "top",
                    styles: {
                      backgroundColor: "red",
                      fontSize: "20px",
                    },
                });
            }
            return false;
        } catch(err) {
            ToastMaker("Enter Correct Community Name", 3000, {
                valign: "top",
                styles: {
                  backgroundColor: "red",
                  fontSize: "20px",
                },
            });
            console.log(err);
        }
        return false;
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
        const val = await handleCommunityName();
        if(val) {
            try {
                    const res = await axios.post(`https://scicommons-backend.onrender.com/api/article/${article.id}/submit_article/`,{
                        communities:[val],
                    },config);
                    setLoading(false);
                    setShow(false);
                    ToastMaker("Article Submitted to Community Successfully!!!", 3000, {
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
        setLoading(false);
    }

    return (
        <>
            <div className="fixed inset-0 flex items-center justify-center z-50 bg-gray-800 bg-opacity-50">
                <div className="flex items-center justify-center w-5/6 p-4">
                    <div className="bg-gray-200 p-6 rounded-lg w-full max-h-5/6 overflow-y-auto">
                    <h2 className="text-xl font-semibold mb-4">Submit to Community</h2>
                    <form onSubmit={handleSubmit}>
                        <div className="mb-4">
                            <label htmlFor="community" className="block font-medium mb-1">
                                Enter Community Name:
                            </label>
                            <input
                                type="text"
                                id="Community"
                                value={community}
                                name="Community"
                                onChange={(e) => setCommunity(e.target.value)}
                                className="w-full border border-gray-300 rounded p-2"
                                required
                            />
                        </div>
                        <button
                        type="submit"
                        className="bg-green-500 text-white px-4 py-2 rounded mr-2 font-semibold"
                        >
                            {
                                loading ? "Submitting..." : "Submit"
                            }
                        </button>
                        <button
                            className="px-4 py-2 bg-red-500 text-white rounded font-semibold"
                            onClick={()=>{setShow(false)}}
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


const AuthorArticlePage = () => {

  const { articleId } = useParams();
  const navigate = useNavigate();
  const [article, setArticle] = useState(null);
  const [loading, setLoading] = useState(true);
  const [show,setShow] = useState(false);

  const loadArticleData = async (res) => {
    setArticle(res);
  };

  useEffect(() => {
    const getArticle = async () => {
      setLoading(true);
      const config = {
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${localStorage.getItem("token")}`,
        },
      };
      try {
        const res = await axios.get(
          `https://scicommons-backend.onrender.com/api/article/${articleId}`,
          config
        );
        await loadArticleData(res.data.success);
      } catch (err) {
        console.log(err);
      }
      setLoading(false);
    };

    getArticle();
  }, []);

  const handleProfile = (data) => {
    navigate(`/profile/${data}`);
  };

  const handleFile = () => {
    window.open(article.article_file_url);
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

  const handleFavourites = async () => {
    const config = {
      headers: {
        "Content-Type": "application/json",
        Authorization: `Bearer ${localStorage.getItem("token")}`,
      },
    };
    if (article.isFavourite === false) {
      try {
        const res = await axios.post(
          `https://scicommons-backend.onrender.com/api/article/favourite/`,
          { article: articleId },
          config
        );
        const newArticle = {
          ...article,
          isFavourite: true,
          favourites: article.favourites + 1,
        };
        await loadArticleData(newArticle);
      } catch (err) {
        console.log(err);
      }
    } else {
      try {
        const res = await axios.post(
          `https://scicommons-backend.onrender.com/api/article/unfavourite/`,
          { article: articleId },
          config
        );
        const newArticle = {
          ...article,
          isFavourite: false,
          favourites: article.favourites - 1,
        };
        await loadArticleData(newArticle);
      } catch (err) {
        console.log(err);
      }
    }
  };

  const handleShow = () => {
    setShow(true);
  }

  return (
    <div className="bg-amber-50 min-h-screen">
      <Navbar />
      {loading && <Loader />}
      {!loading && article!==null && (
        <div className="bg-amber-50">
          <div className="flex justify-center bg-amber-50 w-full md:w-5/6 mt-[1rem] mx-auto p-2 overflow-hidden">
            <div className=" mt-1 w-full  justify-self-center bg-amber-50">
              <div className="py-5 ">
                <div className="flex bg-amber-50 flex-row justify-between">
                  <div className="text-lg md:text-3xl font-[700] text-gray-600 bg-amber-50">
                    {article.article_name.replace(/_/g, " ")}
                  </div>
                  <div className="flex flex-row">
                    <div
                      className="icon mr-2"
                      style={{ cursor: "pointer" }}
                      onClick={handleFavourites}
                    >
                      {article.isFavourite === true ? (
                        <AiFillHeart className="w-[40px] h-[40px]" />
                      ) : (
                        <AiOutlineHeart className="w-[40px] h-[40px]" />
                      )}
                    </div>
                    <div className="icon" onClick={handleFile}>
                      <img className="w-[40px] h-[40px]" src={img}></img>
                    </div>
                  </div>
                </div>
                <div className="py-1 bg-amber-50">
                  <span className="italic font-sans text-md md:text-lg leading-[1.5rem] ">
                    {article.authors.map((data, i) => {
                      return (
                        <span
                          key={i}
                          style={{ cursor: "pointer" }}
                          onClick={(data) => {
                            handleProfile(data);
                          }}
                        >
                          {data}
                          <span> </span>
                        </span>
                      );
                    })}
                    .
                  </span>
                </div>
                <div className="bg-amber-50">
                  <span className="text-[.75rem] p-0">
                    <img className="w-[.875rem] inline mb-1" src={cal}></img>
                    <span className="pl-1">Published:</span>
                    {article.published_date === null
                      ? " Not Published"
                      : findTime(article.published_date)}
                    <img
                      className="w-[.875rem] inline mb-1 mr-1 ml-4"
                      src={folder}
                    ></img>
                    {article.published === null
                      ? " Not Yet"
                      : `Accepted by ${article.published}`}
                    <img
                      className="w-[.875rem] inline mb-1 mr-1 ml-4"
                      src={eye}
                    ></img>
                    {article.status === "public" ? "Everyone" : "Private"}
                    <img
                      className="w-[.875rem] inline mb-1 mr-1 ml-4"
                      src={dublicate}
                    ></img>
                    Versions
                    <AiFillHeart className="w-[.875rem] inline mb-1 mr-1 ml-4" />
                    {article.favourites}
                    <MdOutlineViewSidebar className="w-[.875rem] inline mb-1 mr-1 ml-4" />
                    {article.views}
                    <AiTwotoneStar className="w-[.875rem] inline mb-1 mr-1 ml-4" />
                    {article.rating === null ? "0" : article.rating}
                  </span>
                </div>
              </div>
              <div className="text-[.75rem] leading-[1.125rem] mt-[-0.875rem] bg-amber-50">
                <span className="block">
                  <strong className="text-green-700"> Abstract : </strong>
                  <span>{article.Abstract}</span>
                </span>
                <div className="block">
                  <strong className="text-green-700 font-[700]">
                    {" "}
                    License :{" "}
                  </strong>
                  <span>
                    {article.license === null ? "None" : article.license}
                  </span>
                </div>
                <div className="bock">
                  <strong className="text-green-700 font-[700]">
                    {" "}
                    Submission Length :{" "}
                  </strong>
                  <span>{article.sub_len}</span>
                </div>
                <div className="bock">
                  <strong className="text-green-700 font-[700]">Code : </strong>
                  <a href={article.Code} className="text-[#337ab7]">
                    {" "}
                    {article.Code}
                  </a>
                </div>
                <div className="bock">
                  <strong className="text-green-700 font-[700]">
                    {" "}
                    Video Link:{" "}
                  </strong>
                  <a href={article.video} className="text-[#337ab7]">
                    {" "}
                    {article.video}
                  </a>
                </div>
                {article.link && (
                  <div className="bock">
                    <strong className="text-green-700 font-[700]">
                      {" "}
                      Video Link:{" "}
                    </strong>
                    <a href={article.link} className="text-[#337ab7]">
                      {" "}
                      {article.link}
                    </a>
                  </div>
                )}
                <div className="bock">
                  <strong className="text-green-700 font-[700]">
                    {" "}
                    Submission Date :{" "}
                  </strong>
                  <span> {findTime(article.Public_date)} </span>
                </div>
              </div>
                <div className="m-0">
                    <div className='bg-amber-50 border-[#3f6978] border-solid'>
                        <div className="float-right">
                            <span className='text-[0.75rem] text-gray-600'>
                                Add:
                            </span>
                            <span className="box-content text-white bg-[#4d8093] text-[0.55 rem] border-solid ml-2 md:font-bold p-2 pt-0 rounded" style={{cursor:"pointer"}} onClick={handleShow}>
                                Community
                            </span>
                        </div>
                    </div>
                </div>
            </div>
          </div>
          <div className="w-full mt-3">
                <DisplayCommunity article={articleId}/>
          </div>
          {show && <SubmitCommunity article={article} setShow={setShow}/>}
        </div>
      )}
    </div>
  );
};

export default AuthorArticlePage;
