import React, {useState,useEffect} from 'react'
import {useParams, useNavigate} from 'react-router-dom'
import axios from 'axios';
import ArticleCard from '../../Components/ArticleCard/ArticleCard';
import Loader from '../../Components/Loader/Loader';
import NavBar from '../../Components/NavBar/NavBar';
import {MdLocationPin, MdSubscriptions} from 'react-icons/md';
import {BsGithub} from 'react-icons/bs';
import {BiLogoGmail} from 'react-icons/bi';
import {CgWebsite} from 'react-icons/cg';
import {FaUsers, FaBook, FaPencilAlt} from 'react-icons/fa';

const CommunityPage = () => {

    const {communityName} = useParams()
    const navigate = useNavigate()
    const [community, setCommunity] = useState(null)
    const [articles, setArticles] = useState([])
    const [loading, setLoading] = useState(false)
    const [searchTerm, setSearchTerm] = useState('')
    const [sortedArticles, setSortedArticles] = useState([]);
    const [subscribed, setSubscribed] = useState(null);
    const [User, setUser] = useState(localStorage.getItem('user'));

    const loadCommunity = async (res) => {
            setCommunity(res)
    }
    const loadArticles = async(res) => {
        setArticles(res)
        setSortedArticles(res)
    }
    const loadData = async (res) => {
        setSubscribed(res)
        const data = community
        data.isSubscribed = res
        data.subscribed = res? data.subscribed + 1 : data.subscribed - 1
        setCommunity(data)
    }
    useEffect(() => {
        setLoading(true)
        const getCommunity = async () => {
            try {
                const token = localStorage.getItem('token')
                const config = {
                    headers: {
                        Authorization: `Bearer ${token}`
                    }
                }
                const res = await axios.get(`https://scicommons-backend.onrender.com/api/community/${communityName}/`, config )
                await loadCommunity(res.data.success)
                setSubscribed(res.data.success.isSubscribed)
            } catch (error) {
                console.log(error)
            }
        }
        const getArticles = async () => {
            try {
                const token = localStorage.getItem('token');
                const config = {
                    headers: {
                        Authorization: `Bearer ${token}`
                    }
                }
                const res = await axios.get(`https://scicommons-backend.onrender.com/api/community/${communityName}/articles/`, config)
                await loadArticles(res.data.success)
            } catch (error) {
                console.log(error)
            }
        }
        const fetchData = async () => {
            await getCommunity()
            await getArticles()
        }
        fetchData()
        setLoading(false)
    }, [communityName])

    const handleSubscribe = async (e) => {
        e.preventDefault()
        setLoading(true)
        try {
            const updatedStatus = !subscribed; // Toggle the subscription status
            const token = localStorage.getItem('token'); // Retrieve the token from local storage

            const config = {
                headers: {
                     Authorization: `Bearer ${token}`,
                },
            };
            if(subscribed === false){
                const response = await axios.post(
                    `https://scicommons-backend.onrender.com/api/community/${community.Community_name}/subscribe/`,{
                        "user": User.id
                    },
                    config
                );
                if (response.status === 200) {
                    await loadData(updatedStatus);
                    
                }
            } else {
                const response = await axios.post(`https://scicommons-backend.onrender.com/api/community/${community.Community_name}/unsubscribe/`,
                {
                    "user": User.id
                },config);
                if (response.status === 200) {
                    await loadData(updatedStatus);
                }
            }
          } catch (error) {
            console.error(error);
        } finally {
            setLoading(false);
        }
    };
    const getButtonLabel = () => {
        if (loading) {
            return (
                <svg
                  className="animate-spin -ml-1 mr-2 h-5 w-5 text-white"
                  xmlns="http://www.w3.org/2000/svg"
                  fill="none"
                  viewBox="0 0 24 24"
                >
                  <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4" />
                  <path
                    className="opacity-75"
                    fill="currentColor"
                    d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647zM12 20c3.042 0 5.824-1.135 7.938-3l-2.647-3A7.962 7.962 0 0012 16v4zm5.291-9H20c0-3.042-1.135-5.824-3-7.938l-3 2.647A7.962 7.962 0 0116 12h4zm-9-5.291V4c-3.042 0-5.824 1.135-7.938 3l2.647 3A7.962 7.962 0 0112 8V4zm-5.291 9L4 16c3.042 0 5.824-1.135 7.938-3l2.647 3A7.962 7.962 0 018 20h4v-4H4.709z"
                  />
                </svg>
            );
          }
      
          return (
            <>
              {subscribed === true ? 'Unsubscribe' : 'Subscribe'}
            </>
          );
    };

    useEffect(() => {
        const fetchArticles = async () => {
            const newArticles= [...articles]
            const filteredArticles = newArticles.filter((article) => {
                let str = article.authors.map((author) => author.username).join(" ");
                return (article.article_name.toLowerCase().includes(searchTerm.toLowerCase())
                || article.keywords.toLowerCase().includes(searchTerm.toLowerCase())|| str.toLowerCase().includes(searchTerm.toLowerCase()))
            });
            setSortedArticles(filteredArticles);
        };
            
        fetchArticles();
    }, [searchTerm]);

    const handleSearch = (e) => {
        e.preventDefault();
    }
    
    const sortRated = (e) => {
        e.preventDefault();
        setLoading(true)
        const sortedByRating = [...articles].sort((a, b) => b.rating - a.rating);
        setSortedArticles(sortedByRating);
        setLoading(false)
    }
    const sortFavourite = (e) => {
        e.preventDefault();
        setLoading(true)
        const sortedByFavourite = [...articles].sort((a, b) => b.favourites - a.favourites);
        setSortedArticles(sortedByFavourite);

        setLoading(false)
    }
    const sortViews = (e) => {
        e.preventDefault();
        setLoading(true)
        const sortedByViews = [...articles].sort((a, b) => b.views - a.views);
        setSortedArticles(sortedByViews);

        setLoading(false)
    }
    const sortDate = (e) => {
        e.preventDefault();
        setLoading(true)
        const sortedByDate = [...articles].sort((a, b) => {
            const dateA = new Date(a.Public_date);
            const dateB = new Date(b.Public_date);
            return dateB - dateA;
        });
        setSortedArticles(sortedByDate);
        setLoading(false)
    }        

    return (
        <>
        <NavBar />
        { loading && community===null && (<Loader/>)}
        { !loading && community!==null &&    (
            <>
                <div className="w-4/5 md:w-2/3 flex flex-col justify-center mx-auto rounded-2xl shadow-2xl bg-green-100 mt-4 p-3 mb-8 md:p-6">
                    <div className="m-4 flex flex-col justify-center">
                        <h1 className="text-xl md:text-7xl font-bold text-center text-gray-500">{community?.Community_name}</h1>
                    </div>
                    <div className="mt-4">
                        <p className="test-sm md:text-md text-left text-gray-500"><span className="text-sm md:text-lg text-left font-bold text-green-700">Subtitle : </span>{community?.subtitle}</p>
                        <p className="test-sm md:text-md text-left text-gray-500"><span className="test-sm md:text-lg text-left font-bold text-green-700">Description : </span>{community?.description}</p>
                        <p className="test-sm md:text-md text-left text-gray-500"><span className="test-sm md:text-lg text-left font-bold text-green-700">Admins : </span>{community?.admins.map((admin) => admin).join(', ')}</p>
                    </div>
                        <div className="mt-4 flex flex-wrap justify-between">
                            <div className="mt-4 flex">
                                <MdLocationPin className="text-xl text-green-700 md:mr-3" /> <span className="text-sm md:text-md text-left text-gray-500">{community?.location}</span>
                            </div>
                            <div className="mt-4 flex">
                                <BsGithub className="text-xl text-green-700 md:mr-3" /> <a className="text-sm md:text-md text-left text-gray-500" href={community?.github}>{community?.github}</a>
                            </div>
                            <div className="mt-4 flex">
                                <BiLogoGmail className="text-xl text-green-700 md:mr-3" /> <span className="text-sm md:text-md text-left text-gray-500">{community?.email}</span>
                            </div>
                            <div className="mt-4 flex">
                                <CgWebsite className="text-xl text-green-700 md:mr-3" /> <a className="text-sm md:text-md text-left text-gray-500" href={community?.website}>{community?.website}</a>
                            </div>
                        </div>
                        <div className="mt-4 flex flex-wrap justify-between">
                            <div className="mt-4 flex">
                                <FaUsers className="text-xl text-green-700 md:mr-3" /> <span className="text-sm md:text-md text-left text-gray-500">{community?.membercount}</span>
                            </div>
                            <div className="mt-4 flex">
                                <FaPencilAlt className="text-xl text-green-700 md:mr-3" /> <a className="text-sm md:text-md text-left text-gray-500" href={community?.github}>{community?.evaluatedcount}</a>
                            </div>
                            <div className="mt-4 flex">
                                <FaBook className="text-xl text-green-700 md:mr-3" /> <span className="text-sm md:text-md text-left text-gray-500">{community?.publishedcount}</span>
                            </div>
                            <div className="mt-4 flex">
                                <MdSubscriptions className="text-xl text-green-700 md:mr-3" /> <span className="text-sm md:text-md text-left text-gray-500">{community?.subscribed}</span>
                            </div>
                        </div>
                        <div className="mt-8 flex flex-row justify-end">
                                <button className="bg-teal-500 text-white md:px-4 md:py-2 rounded-xl mr-3 p-1" style={{cursor:"pointer"}} onClick={()=> navigate(`/join-community/${community.Community_name}`)}>Join Community</button>
                                    <button
                                        className={`${
                                            subscribed
                                            ? 'bg-gray-400 text-gray-700 cursor-default'
                                            : 'bg-red-500 hover:bg-red-600 text-white'
                                        } rounded-xl p-1 md:py-2 md:px-4`}
                                        style={{cursor:"pointer"}}
                                        onClick={handleSubscribe}
                                        >
                                        {getButtonLabel()}
                                    </button>
                        </div>
                </div>
                <div className="flex flex-col items-center justify-center w-full bg-gray-50">
                    <form className="w-5/6 px-4 mt-20 md:w-2/3" onSubmit={handleSearch}>
                        <div className="relative">
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
                    </form>
                    <div className="flex flex-row justify-end mb-5 w-full md:w-2/3">
                        <button className="mx-1 px-3 mt-4 text-black bg-green-100 rounded-md hover:bg-green-400" style={{cursor:"pointer"}} onClick={sortRated}>Most Rated</button>
                        <button className="mx-1 px-3 mt-4 text-black bg-green-100 rounded-md hover:bg-green-400" style={{cursor:"pointer"}} onClick={sortFavourite}>Most Favourite</button>
                        <button className="mx-1 px-3 mt-4 text-black bg-green-100 rounded-md hover:bg-green-400" style={{cursor:"pointer"}} onClick={sortViews}>Most Views</button>
                        <button className="mx-1 px-3 mt-4 text-black bg-green-100 rounded-md hover:bg-green-400" style={{cursor:"pointer"}} onClick={sortDate}>Most Recent</button>
                    </div>
                </div>

                <div className="flex flex-col items-center justify-center w-full bg-gray-50 mb-5">
                    { loading ? <Loader /> :  <ArticleCard articles={sortedArticles} /> }
                </div>
            </>)
        }
        </>
    )
};

export default CommunityPage