import React,{useState, useEffect} from 'react';
import axios from 'axios';
import NavBar from '../../Components/NavBar/NavBar';
import Footer from '../../Components/Footer/Footer';

const feedCard = (props) => {
    return (
        <div className="flex flex-col items-center justify-center w-full bg-gray-50 p-5">
            <div className="flex flex-col items-center justify-center w-full bg-gray-50 p-5">
                <div className="flex items-center justify-between w-full">
                    <div className="flex items-center space-x-4">
                        <div>
                            <h3 className="font-medium text-lg">{props.message}</h3>
                            <p className="text-gray-500">{props.formattedDate}</p>
                        </div>
                    </div>
                    <a
                        href={props.link}
                        className="text-blue-500 hover:text-blue-700 transition-colors duration-300"
                    >
                        View
                    </a>
                </div>
            </div>
        </div>
    )
}

const Feed = () => {

    const [feed, setFeed] = useState([]);

    useEffect(() => {
        if (!localStorage.getItem('token')) {
          window.location.href = '/login';
        }
        const fetchFeed = async () => {
            const response = await axios.get('https://scicommons-backend.onrender.com/api/notification/', {
                headers: { Authorization: `Bearer ${localStorage.getItem('token')}` },
            });
            const data = response.data.success;
            setFeed(data.results);
        }
        fetchFeed();
    },[feed]);


  return (
    <div>
        <NavBar />
        <div className="flex flex-col items-center justify-center">
            {
                feed.length === 0 ? (<h1 className="text-2xl font-bold text-gray-500">No Posts to Show</h1>):(
                    <>
                        {
                            feed.map((item, index) => {
                                return (
                                    <feedCard
                                        key={index}
                                        message={item.message}
                                        formattedDate={item.formattedDate}
                                        link={item.link}
                                    />
                                )
                            })
                        }
                    </>
                )
            }
        </div>
        <Footer/>
    </div>
  )
}

export default Feed