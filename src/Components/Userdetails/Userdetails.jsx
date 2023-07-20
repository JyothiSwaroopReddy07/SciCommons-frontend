import React,{useState} from "react";
import { Link, useNavigate } from "react-router-dom";


const UserDetails = ({ currentUser }) => {


    const navigate = useNavigate();
    const [authUser,setAuthUser] = useState(JSON.parse(localStorage.getItem('user')));

    return (
        <div className="ml-5 mt-8 mb-4 flex w-10/12 justify-around ">

            <div className="flex ">
                <img 
                    src={currentUser?.profilePicture} 
                    className="w-12 h-12 rounded-full cursor-pointer" 
                    alt={`${currentUser?.username}`} 
                    onClick={() => navigate(`/profile/${currentUser?.username}`)}
                />

                <div className="w-40 flex flex-col px-2 ">
                    <Link to={`/profile/${currentUser?.username}`}>
                        <h2 className="font-semibold">{`${currentUser?.firstName} ${currentUser?.lastName}`}</h2>
                        <h2> @{currentUser?.username} </h2>
                    </Link>
                </div>
            </div>

            {authUser?.username === currentUser?.username ? null : authUser?.following.find(eachUser => eachUser?.username === currentUser?.username) ? (
            <button 
                className="mt-1.5 px-3 w-18 h-8 bg-blue-600 hover:bg-blue-800 text-white rounded-xl shadow-md hover:shadow-lg transition duration-150 ease-in-out" 
                onClick={() => console.log("swaroop")} >
                Unfollow
            </button>
            ) : (
            <button 
                className="mt-1.5 px-3 w-18 h-8 bg-blue-600 hover:bg-blue-800 text-white rounded-xl shadow-md hover:shadow-lg transition duration-150 ease-in-out" 
                onClick={() => console.log("swaroop")} >
                Follow
            </button>
            )}
        </div>
    )
};

export default UserDetails;