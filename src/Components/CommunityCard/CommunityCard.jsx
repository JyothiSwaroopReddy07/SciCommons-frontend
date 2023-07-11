import React,{useState} from 'react'
import './CommunityCard.css'
import { FaBook, FaPencilAlt, FaUsers } from 'react-icons/fa';
import axios from 'axios';

const CommunityCard = ({index, onDataChange, community}) => {

    const [subscribed, setSubscribed] = useState(community.subscribed > 0 ? true : false);
    const [loading , setLoading] = useState(false);

    const handleSubscribe = async (e) => {
        e.preventDefault()
        setLoading(true)
        try {
            const updatedStatus = !subscribed; // Toggle the subscription status
            const token = localStorage.getItem('token'); // Retrieve the token from local storage

            const config = {
                headers: {
                Authorization: `Bearer ${token}`, // Include the token in the Authorization header
                },
            };
            const userString = localStorage.getItem('user');
            const user = JSON.parse(userString);
            if(subscribed === false){
                console.log("subscribed")
                const response = await axios.post(
                    'https://scicommons-backend.onrender.com/api/subscribe/',
                    { User: user.id, community: community.id }, 
                    config
                );
                if (response.status === 200) {
                    onDataChange(index,response.data.id);
                    setSubscribed(updatedStatus);
                }
            } else {
                console.log("unsubscribed")
                const response = await axios.delete(`https://scicommons-backend.onrender.com/api/subscribe/${community.subscribed}/`, config);
                if (response.status === 200) {
                    onDataChange(index, 0);
                    setSubscribed(updatedStatus);
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

    return (
    <>
                <div key={community.id} className="p-4 bg-white shadow-md rounded-lg">
                    <div className="flex items-center justify-between mb-6">
                        <div>
                            <h2 className="text-xl text-green-600 font-bold mb-4">{community.Community_name.replace(/_/g, " ")}</h2>
                        </div>
                        <div className="flex items-center mb-2">
                            <FaUsers className="w-5 h-5 mr-2 text-gray-500" />
                            <span className="text-gray-600">{community.membercount}</span>
                        </div>
                    </div>
                    <div className="flex items-center justify-between mb-2">
                        <div>
                            <div className="flex items-center mb-2">
                                <FaBook className="w-5 h-5 mr-2 text-gray-500" />
                                <span className="text-gray-600">Evaluated : {community.evaluatedcount}</span>
                            </div>
                            <div className="flex items-center mb-2">
                                <FaPencilAlt className="w-5 h-5 mr-2 text-gray-500" />
                                <span className="text-gray-600">Published : {community.publishedcount}</span>
                            </div>
                        </div>
                        <button
                            className={`${
                                subscribed
                                ? 'bg-gray-400 text-gray-700 cursor-default'
                                : 'bg-green-500 hover:bg-green-600 text-white'
                            } font-bold rounded mt-4 py-1 px-2`}
                            onClick={handleSubscribe}
                            >
                            {getButtonLabel()}
                        </button>
                    </div>
                </div>
    </>
    )
}

export default CommunityCard