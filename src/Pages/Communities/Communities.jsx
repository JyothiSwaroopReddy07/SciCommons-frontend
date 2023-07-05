import React, {useState,useEffect} from 'react';
import NavBar from '../../Components/NavBar/NavBar';
import axios from 'axios';
import CommunityCard from '../../Components/CommunityCard/CommunityCard';
import Loader from '../../Components/Loader/Loader';
import './Communities.css';

const Communities = () => {

    const [searchTerm, setSearchTerm] = useState('');
    const [communities, setCommunities] = useState([]);
    const [loading, setLoading] = useState(false);

    useEffect(() => {
        const fetchCommunities = async () => {
            setLoading(true)
            const token = localStorage.getItem('token'); // Retrieve the token from local storage
            const config = {
                headers: {
                    Authorization: `Bearer ${token}`, // Include the token in the Authorization header
                },
            };
            try {
                const response = await axios.get(
                    `https://scicommons-backend.onrender.com/api/community?search=${searchTerm}`,
                    config
                );
                console.log(response.data.success.results);
                setCommunities(response.data.success.results);
            } catch (error) {
                console.error(error);
            } finally {
                setLoading(false)
            }   
        };
        fetchCommunities();
        const intervalId = setInterval(fetchCommunities, 300000);
        return () => {
            clearInterval(intervalId);
        };
    }, [searchTerm]);

    const handleSearch = (e) => {
        e.preventDefault();
    }

    const handleDataChange = (index) => {
        var newData = [...communities];
        newData[index].subscribed = !newData[index].subscribed;
        setCommunities(newData);
    };

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
                        placeholder="Search Communities"
                        value={searchTerm}
                        onChange={(e) => setSearchTerm(e.target.value)}
                        className="w-full py-3 pl-12 pr-4 text-green-600 border rounded-md outline-none bg-gray-50 focus:bg-white focus:border-green-600"
                    />
                </div>
            </form>
            <div className="flex flex-col items-center justify-center w-full bg-gray-50">
            { loading ? (<Loader />): 
                (<ul className="mt-12 space-y-6 w-full md:w-4/5">
                {
                    communities.length !== 0 ? (
                    communities.map((item, index) => (
                        <CommunityCard index={index} onDataChange={handleDataChange} community={item} />
                    ))):(<h1 className="text-2xl font-bold text-gray-500">No Communities Found</h1>)
                }
                </ul>)
            }
            </div>
        </div>
                
    </>
  )
}

export default Communities