import React, {useState,useEffect} from 'react'
import {useParams} from 'react-router-dom'
import axios from 'axios';
import ArticleCard from '../../Components/ArticleCard/ArticleCard';
import Loader from '../../Components/Loader/Loader';
import NavBar from '../../Components/NavBar/NavBar';
import Footer from '../../Components/Footer/Footer';
import CommunityDescription from '../../Components/CommunityDescription/CommunityDescription';

const CommunityPage = () => {

    const {communityName} = useParams()
    const [community, setCommunity] = useState(null)
    const [articles, setArticles] = useState([])
    const [loading, setLoading] = useState(false)
    const [searchTerm, setSearchTerm] = useState('')
    const [sortedArticles, setSortedArticles] = useState([]);

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
                setCommunity(res.data.success)
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
                setArticles(res.data.success)
                setSortedArticles(res.data.success)
            } catch (error) {
                console.log(error)
            }
        }
        const fetchData = async() => {
            await getCommunity()
            await getArticles()
        }
        fetchData()
        setLoading(false)
    }, [communityName])

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

    const onDataChange = (subscribed) => {
        const data = community;
        data.isSubscribed = subscribed;
        data.subscribed +=  subscribed? 1 : -1;  
        setCommunity(data);
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
        { loading  ? (<Loader/>):
            (
            <>
                <NavBar />
                <CommunityDescription community={community} onDataChange={onDataChange}/>
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
                        <button className="mx-1 px-3 mt-4 text-black bg-green-100 rounded-md hover:bg-green-400" onClick={sortRated}>Most Rated</button>
                        <button className="mx-1 px-3 mt-4 text-black bg-green-100 rounded-md hover:bg-green-400" onClick={sortFavourite}>Most Favourite</button>
                        <button className="mx-1 px-3 mt-4 text-black bg-green-100 rounded-md hover:bg-green-400" onClick={sortViews}>Most Views</button>
                        <button className="mx-1 px-3 mt-4 text-black bg-green-100 rounded-md hover:bg-green-400" onClick={sortDate}>Most Recent</button>
                    </div>
                </div>

                <div className="flex flex-col items-center justify-center w-full bg-gray-50 mb-5">
                    { loading ? <Loader /> :  <ArticleCard articles={sortedArticles} /> }
                </div>
                <Footer />
            </>)
        }
        </>
    )
};

export default CommunityPage