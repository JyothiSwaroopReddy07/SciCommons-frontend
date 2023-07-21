import React, {useState} from 'react';
import {MdLocationPin, MdSubscriptions} from 'react-icons/md';
import {BsGithub} from 'react-icons/bs';
import {BiLogoGmail} from 'react-icons/bi';
import {CgWebsite} from 'react-icons/cg';
import {FaUsers, FaBook, FaPencilAlt} from 'react-icons/fa';
import {useNavigate} from "react-router-dom";
import axios from "axios";



const CommunityDescription = ({community, onDataChange}) => {

    const navigate = useNavigate();
    const [loading, setLoading] = useState(false)
    const [subscribed, setSubscribed] = useState(community?.isSubscribed);

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
            if(subscribed === false){
                console.log("subscribed")
                const response = await axios.post(
                    `https://scicommons-backend.onrender.com/api/community/${community.Community_name}/subscribe/`, {},
                    config
                );
                if (response.status === 200) {
                    setSubscribed(updatedStatus);
                    onDataChange(updatedStatus);
                }
            } else {
                console.log("unsubscribed")
                const response = await axios.post(`https://scicommons-backend.onrender.com/api/community/${community.Community_name}/unsubscribe/`,{}, config);
                if (response.status === 200) {
                    setSubscribed(updatedStatus);
                    onDataChange(updatedStatus);
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
        <div className="w-4/5 md:w-2/3 flex flex-col justify-center mx-auto">
                <div className="m-4 flex flex-col justify-center">
                    <h1 className="text-7xl font-bold text-center text-gray-500">{community?.Community_name}</h1>
                </div>
                <div className="mt-4">
                    <p className="text-md text-left text-gray-500"><span className="text-lg text-left font-bold text-green-700">Subtitle : </span>{community?.subtitle}</p>
                    <p className="text-md text-left text-gray-500"><span className="text-lg text-center font-bold text-green-700">Description : </span>{community?.description}</p>
                    <p className="text-md text-left text-gray-500"><span className="text-lg text-center font-bold text-green-700">Admins : </span>{community?.admins.map((admin) => admin).join(', ')}</p>
                </div>
                <div className="mt-4 flex flex-wrap justify-between">
                    <div className="mt-4 flex">
                        <MdLocationPin className="text-xl text-green-700 mr-3" /> <span className="text-md text-left text-gray-500">{community?.location}</span>
                    </div>
                    <div className="mt-4 flex">
                        <BsGithub className="text-xl text-green-700 mr-3" /> <a className="text-md text-left text-gray-500" href={community?.github}>{community?.github}</a>
                    </div>
                    <div className="mt-4 flex">
                        <BiLogoGmail className="text-xl text-green-700 mr-3" /> <span className="text-md text-left text-gray-500">{community?.email}</span>
                    </div>
                    <div className="mt-4 flex">
                        <CgWebsite className="text-xl text-green-700 mr-3" /> <a className="text-md text-left text-gray-500" href={community?.website}>{community?.website}</a>
                    </div>
                </div>
                <div className="mt-4 flex flex-wrap justify-between">
                    <div className="mt-4 flex">
                        <FaUsers className="text-xl text-green-700 mr-3" /> <span className="text-md text-left text-gray-500">{community?.membercount}</span>
                    </div>
                    <div className="mt-4 flex">
                        <FaPencilAlt className="text-xl text-green-700 mr-3" /> <a className="text-md text-left text-gray-500" href={community?.github}>{community?.evaluatedcount}</a>
                    </div>
                    <div className="mt-4 flex">
                        <FaBook className="text-xl text-green-700 mr-3" /> <span className="text-md text-left text-gray-500">{community?.publishedcount}</span>
                    </div>
                    <div className="mt-4 flex">
                        <MdSubscriptions className="text-xl text-green-700 mr-3" /> <span className="text-md text-left text-gray-500">{community?.subscribed}</span>
                    </div>
                </div>
                <div className="mt-8 flex flex-row justify-around">
                <button
                            className={`${
                                subscribed
                                ? 'bg-gray-400 text-gray-700 cursor-default'
                                : 'bg-red-500 hover:bg-red-600 text-white'
                            } font-bold rounded-xl py-2 px-4`}
                            onClick={handleSubscribe}
                            >
                            {getButtonLabel()}
                        </button>
                    <button className="bg-blue-500 text-white px-4 font-bold py-2 rounded-xl" onClick={()=> navigate(`/join-community/${community.Community_name}`)}>Join Community</button>
                </div>
        </div>
    </>
  )
}

export default CommunityDescription