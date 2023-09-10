import React, {useEffect, useState} from "react";
import axios from "axios";
import {useNavigate} from 'react-router-dom';
import Loader from "../../Components/Loader/Loader";
import ToastMaker from "toastmaker";
import "toastmaker/dist/toastmaker.css";

const AcceptModal = ({setShowAccept,article,community, handleModified}) => {

    const [loading, setLoading] = useState(false);

    const handleAccept = async () => {
        setLoading(true)
        try {
            const token = localStorage.getItem('token')
            const config = {
                headers: {
                    Authorization: `Bearer ${token}`
                }
            }
            const res = await axios.post(`https://scicommons-backend.onrender.com/api/article/${article}/approve_for_review/`,{community: community}, config)
            if(res.status === 200){
                ToastMaker(res.data.success, 3500,{
                    valign: 'top',
                      styles : {
                          backgroundColor: 'green',
                          fontSize: '20px',
                      }
                  })
            }
            await handleModified(article);
        } catch (error) {
            console.log(error)
        }
        setLoading(false)
        setShowAccept(false)
    }

    return (
        <>
            <div className="w-full h-full fixed block top-0 left-0 bg-gray-900 bg-opacity-50 z-50">
                <div className="w-full h-full flex flex-col items-center justify-center">
                    <div className="w-1/2 bg-white p-5 rounded-lg flex flex-col items-center justify-center">
                        <h1 className="text-2xl font-bold text-gray-600 mb-4">Are you sure you want to accept this paper for reviewal process?</h1>
                        <div className="w-full flex flex-row items-center justify-center">
                            <button className="text-sm font-semibold text-white p-2 px-5 mr-5 rounded-lg bg-green-600 flex" style={{cursor:"pointer"}} onClick={handleAccept}>{loading?"loading...":"Yes"}</button>
                            <button className="text-sm font-semibold text-white p-2 px-5 rounded-lg bg-red-600 flex ml-2" style={{cursor:"pointer"}} onClick={() => {setShowAccept(false)}}>No</button>
                        </div>
                    </div>
                </div>
            </div>
        </>
    )
}

const RejectModal = ({setShowReject,article,community, handleReject}) => {

    const [loading, setLoading] = useState(false);

    const handleDelete = async () => {
        setLoading(true)
        try {
            const token = localStorage.getItem('token')
            const config = {
                headers: {
                    Authorization: `Bearer ${token}`
                }
            }
            const res = await axios.post(`https://scicommons-backend.onrender.com/api/article/${article}/reject_article/`,{community:community}, config)
            if(res.status === 200){
                ToastMaker(res.data.success, 3500,{
                    valign: 'top',
                      styles : {
                          backgroundColor: 'green',
                          fontSize: '20px',
                      }
                  })
            }
            await handleReject(article)
        } catch (error) {
            console.log(error)
            ToastMaker("Please try again!!!", 3500,{
                valign: 'top',
                  styles : {
                      backgroundColor: 'red',
                      fontSize: '20px',
                  }
              })
        }
        setLoading(false)
        setShowReject(false)
    }

    return (
        <>
            <div className="w-full h-full fixed block top-0 left-0 bg-gray-900 bg-opacity-50 z-50">
                <div className="w-full h-full flex flex-col items-center justify-center">
                    <div className="w-1/2 bg-white p-5 rounded-lg flex flex-col items-center justify-center">
                        <h1 className="text-2xl font-bold text-gray-600 mb-4">Are you sure you want to reject this paper?</h1>
                        <div className="w-full flex flex-row items-center justify-center">
                            <button className="text-sm font-semibold text-white p-2 px-5 mr-5 rounded-lg bg-green-600 flex" style={{cursor:"pointer"}} onClick={handleDelete}>{loading?"loading...":"Yes"}</button>
                            <button className="text-sm font-semibold text-white p-2 px-5 rounded-lg bg-red-600 flex ml-2" style={{cursor:"pointer"}} onClick={() => {setShowReject(false)}}>No</button>
                        </div>
                    </div>
                </div>
            </div>
        </>
    )
}

const AdminArticlePage = ({community}) => {

    const [searchTerm, setSearchTerm] = useState('');
    const [articles, setArticles] = useState([]);
    const [loading, setLoading] = useState(false);
    const [sortedArticles, setSortedArticles] = useState([]);
    const [selectedOption, setSelectedOption] = useState('All');
    const [showAccept, setShowAccept] = useState(false);
    const [showReject, setShowReject] = useState(false);

    const navigate = useNavigate();

    const loadData = async (res) => {
        setArticles(res);
        setSortedArticles(res);
    }

    const handleModified = async(index) => {
        const articleIndex = articles.findIndex((article) => article.article.id === index);
        let newarticles = [...articles]
        newarticles[articleIndex].status = "in review";
        await loadData(newarticles);
    }

    const handleReject = async(index) => {
        const articleIndex = articles.findIndex((article) => article.article.id === index);
        let newarticles = [...articles]
        newarticles[articleIndex].status = "rejected";
        await loadData(newarticles);
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
                `https://scicommons-backend.onrender.com/api/community/${community}/articles/`,
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
            return article.article.article_name.toLowerCase().includes(searchTerm.toLowerCase()) || article.article.authors.join(" ").toLowerCase().includes(searchTerm.toLowerCase()) || article.article.keywords.toLowerCase().includes(searchTerm.toLowerCase());
        });
        await loadSortedArticles(newArticles);
        setLoading(false);
    }

    const handleNavigate = (index) => {
        navigate(`/community/${community}/${index}`)
    } 

    return (
        <>
            <div className="flex flex-col items-center justify-center w-full bg-white">
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

            <div className="flex w-full bg-white min-h-screen mb-5">
                { loading ? <Loader /> :  (
                <ul className="mt-2 flex flex-col w-full">
                    {
                        sortedArticles.length > 0 ? (
                        sortedArticles.map((item) => (
                        <li key={item.article.id} className="p-2 bg-slate-100 m-1 rounded-md shadow-md w-full">
                                    <div className="flex flex-row justify-between flex-wrap items-center w-full" onClick={()=>{handleNavigate(item.article.id)}} style={{cursor:"pointer"}}>
                                        <h3 className="text-md md:text-xl font-medium text-green-600">
                                            {item.article.article_name.replace(/_/g, " ")}
                                        </h3>
                                        <p className="text-gray-500 mt-2 pr-2">
                                            <span className="text-green-700">Status : </span>
                                            <span className="inline-flex items-center gap-1.5 py-1 px-1 rounded text-sm font-medium text-red-500">{item.status}</span>
                                        </p>
                                        {item.status === "submitted" &&
                                        <div className="flex flex-row justify-between mt-2">
                                            <button className="bg-blue-600 px-2 py-1 rounded-lg font-semibold text-white mr-2 text-sm md:text-md" onClick={(e)=>{e.preventDefault();setShowAccept(true); e.stopPropagation();}}>Accept for Reviewal</button>
                                            <button className="bg-gray-500 px-2 py-1 rounded-lg font-semibold text-white text-sm md:text-md" onClick={(e)=>{e.preventDefault();setShowReject(true); e.stopPropagation();}}>Reject Article</button>
                                        </div>}
                                    </div>
                                    {showReject && <RejectModal setShowReject={setShowReject} article={item.article.id} community={community} handleReject={handleReject}/>}
                                    {showAccept && <AcceptModal setShowAccept={setShowAccept} article={item.article.id} community={community} handleModified={handleModified}/>}
                        </li>
                        ))):(<h1 className="text-2xl font-bold text-gray-500">No Articles Found</h1>)
                    }
                </ul>) }
            </div>
        </>
    )
}

export default AdminArticlePage;