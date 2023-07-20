import React from 'react'
import './CommunityCard.css'
import { FaBook, FaPencilAlt, FaUsers } from 'react-icons/fa';
import { useNavigate } from "react-router-dom";
import { MdSubscriptions } from 'react-icons/md';

const CommunityCard = ({index, community}) => {

    const navigate = useNavigate();

    return (
    <>
                <div key={community.id} className="p-4 bg-white shadow-md rounded-lg hover:shadow-xl" onClick={()=> {navigate(`/community/${community.Community_name}`)}}>
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
                                <FaPencilAlt className="w-5 h-5 mr-2 text-gray-500" />
                                <span className="text-gray-600">Evaluated : {community.evaluatedcount}</span>
                            </div>
                            <div className="flex items-center mb-2">
                                <FaBook className="w-5 h-5 mr-2 text-gray-500" />
                                <span className="text-gray-600">Published : {community.publishedcount}</span>
                            </div>
                        </div>
                        <div className="flex">
                            <MdSubscriptions className="text-xl text-green-700 mr-3" /> <span className="text-md text-left text-gray-500">{community?.subscribed}</span>
                        </div>
                    </div>
                </div>
    </>
    )
}

export default CommunityCard