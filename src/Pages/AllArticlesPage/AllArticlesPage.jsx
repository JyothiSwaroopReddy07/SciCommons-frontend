import React, {useEffect, useState} from "react";
import NavBar from "../../Components/NavBar/NavBar";
import axios from "axios";
import ArticleCard from "../../Components/ArticleCard/ArticleCard";
import Loader from "../../Components/Loader/Loader";
import Footer from "../../Components/Footer/Footer";
import ToastMaker from "toastmaker";
import "toastmaker/dist/toastmaker.css";
import {useGlobalContext} from '../../Context/StateContext';


const AllArticlesPage = () => {

    const [searchTerm, setSearchTerm] = useState('');
    const [articles, setArticles] = useState([]);
    const [loading, setLoading] = useState(false);
    const [selectedOption, setSelectedOption] = useState('All');
    const [orderOption,setOrderOption] = useState("default");
    const [loadingmore, setLoadingMore] = useState(false);
    const {token} = useGlobalContext();

    const handleOptionChange = (e) => {
        setSelectedOption(e.target.value);
    };

    const handleOrderChange = (e) => {
        setOrderOption(e.target.value);
    };

    const loadData = async (res) => {
        setArticles(res);
    }

    const loadMoreData = async (res) => {
        const newArticles = [...articles, ...res]
        setArticles(newArticles);
    }

    const fetchArticles = async () => {
        setLoading(true)
        let config = null
        if(token!==null) {
            config = {
                headers: {
                    Authorization: `Bearer ${token}`,
                },
            };
        }
        try {
            const response = await axios.get(
                `https://scicommons-backend.onrender.com/api/article/`,
                config
            );
            await loadData(response.data.success.results);
        } catch (error) {
            console.error(error);
        } finally {
            setLoading(false)
        }   
    };

    const fillFilter = () => {
        if(selectedOption==='Rating'){
            return 'rated'
        } else if(selectedOption==='Favourites') {
            return "favourite"
        }else if (selectedOption==="Views"){
            return "viewed"
        } else if(selectedOption==='Date') {
            return "recent"
        }
        return "";
    }

    useEffect(() => {
        fetchArticles();
    }, []);

    const handleSearch = async(e) => {
        e.preventDefault();
        setLoading(true);
        let filter = fillFilter()
        let config = null;
        if(token!== null) {
            config = {
                headers: {
                    Authorization: `Bearer ${token}`, 
                },
            };
        }
        if(orderOption==="Ascending") {
            filter = "least_"+filter;
        }
        try{
            const response = await axios.get(`https://scicommons-backend.onrender.com/api/article/?search=${searchTerm}`,config);
            await loadData(response.data.success.results);
        } catch(err){
            console.log(err);
        }
        setLoading(false);
    }

    const handleLoadMore = async() => {
        setLoadingMore(true);
        try{
        let filter = fillFilter()
        if(orderOption) {
            filter = "least_"+filter;
        }
        let config = null;
        if(token!== null) {
            config = {
                headers: {
                    Authorization: `Bearer ${token}`, 
                },
            };
        }
          const response = await axios.get(`https://scicommons-backend.onrender.com/api/article/?search=${searchTerm}&limit=20&offset=${articles.length}`, config);
          const data = response.data.success.results;
          if(response.data.success.count === articles.length) {
            ToastMaker("No more articles to load", 3000, {
              valign: "top",
              styles: {
                backgroundColor: "red",
                fontSize: "20px",
              },
            });
          }
          await loadMoreData(data);
        } catch(err) {
          console.log(err);
        }
        setLoadingMore(false);
      }

    return (
        <>
            <NavBar />
            <div className="flex flex-col items-center justify-start w-full bg-gray-50 min-h-screen">
                <h1 className="text-3xl font-bold text-gray-700 mt-10">Articles</h1>
                <form className="w-5/6 px-4 mt-3 md:w-2/3" onSubmit={handleSearch}>
                    <div className="relative">
                        <div>
                            <input
                                type="text"
                                placeholder="Search using keywords, authors, articles"
                                value={searchTerm}
                                onChange={(e) => setSearchTerm(e.target.value)}
                                className="w-full py-2 pr-4 text-green-600 border rounded-md outline-none bg-gray-50 focus:bg-white focus:border-green-600"
                            />
                        </div>
                        <button
                            type="submit"
                            onClick={handleSearch}
                            className="absolute top-0 bottom-0 right-0 px-4 py-2 text-sm font-semibold text-white bg-gray-600 rounded-md hover:bg-gray-700 focus:bg-gray-700"
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
                                <option value="Rating">Rating</option>
                                <option value="Favourites">Favourites</option>
                                <option value="Views">Views</option>
                                <option value="Date">Date</option>
                            </select>
                        </div>
                    </div>
                    <div className="flex flex-row items-center mt-3">
                        <div className="text-sm md:text-xl font-semibold mr-2">
                            Order: 
                        </div>
                        <div className="relative inline-flex mr-2">
                            <select
                                className="bg-white text-gray-800 text-sm md:text-lg border rounded-lg px-4 py-1 transition duration-150 ease-in-out"
                                value={orderOption}
                                onChange={handleOrderChange}
                            >
                                <option value="Ascending">Ascending</option>
                                <option value="Descending">Descending</option>
                            </select>
                        </div>
                    </div>
                </div>

            <div className="flex flex-col items-center justify-center mx-auto w-full bg-gray-50 mb-5">
                { loading ? <Loader /> :  <ArticleCard articles={articles} /> }
                {(loading || articles.length > 0 ) && <div className="flex flex-row justify-center">
                  <button className="bg-green-500 text-white px-2 py-1 mt-4 rounded-lg" onClick={handleLoadMore}>
                    {loadingmore?"loading...": "load More Articles"}
                  </button>
                </div>}
            </div>
            </div>
            <Footer />
        </>
    )
}

export default AllArticlesPage;