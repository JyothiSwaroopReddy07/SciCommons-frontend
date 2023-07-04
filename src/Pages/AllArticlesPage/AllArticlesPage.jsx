import React, {useEffect, useState} from "react";
import NavBar from "../../Components/NavBar/NavBar";
import axios from "axios";
import ArticleCard from "../../Components/ArticleCard/ArticleCard";
import Loader from "../../Components/Loader/Loader";


const AllArticlesPage = () => {

    const [searchTerm, setSearchTerm] = useState('');
    const [articles, setArticles] = useState([]);
    const [loading, setLoading] = useState(false);
    const [sortedArticles, setSortedArticles] = useState([]);

    useEffect(() => {
        const fetchArticles = async () => {
            setLoading(true)
            const token = localStorage.getItem('token'); // Retrieve the token from local storage
            const config = {
                headers: {
                    Authorization: `Bearer ${token}`, // Include the token in the Authorization header
                },
            };
            try {
                const response = await axios.get(
                    `https://scicommons-backend.onrender.com/api/article?search=${searchTerm}`,
                    config
                );
                console.log(response.data.success.results)
                setArticles(response.data.success.results);
                setSortedArticles(response.data.success.results);
            } catch (error) {
                console.error(error);
            } finally {
                setLoading(false)
            }   
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
        const sortedByDate = [...articles].sort((a, b) => b.Public_date - a.Public_date);
        setSortedArticles(sortedByDate);
        setLoading(false)
    }        

    return (
        <>
            <NavBar />
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

            <div className="flex flex-col items-center justify-center w-full bg-gray-50">
                { loading ? <Loader /> :  <ArticleCard articles={sortedArticles} /> }
            </div>

        </>
    )
}

export default AllArticlesPage;