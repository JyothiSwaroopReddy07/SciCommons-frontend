import React from 'react'
import './CommunityCard.css'
import { FaBook, FaPencilAlt, FaUsers, FaHeart } from 'react-icons/fa';

const CommunityCard = ({communities}) => {
  return (
    <>
        <ul className="mt-12 space-y-6 w-full md:w-4/5">
        {
            communities.length !== 0 ? (
            communities.map((item) => (
                <div key={item.id} className="w-full md:w-1/3 max-w-sm p-4 bg-white shadow-md rounded-lg">
                    <div className="flex items-center justify-between mb-6">
                        <h2 className="text-2xl text-green-600 font-bold mb-4">{item.Community_name}</h2>
                        <div className="flex items-center mb-2">
                            <FaUsers className="w-5 h-5 mr-2 text-gray-500" />
                            <span className="text-gray-600">{item.membercount}</span>
                        </div>
                    </div>
                    <div className="flex items-center justify-between mb-2">
                        <div>
                            <div className="flex items-center mb-2">
                                <FaBook className="w-5 h-5 mr-2 text-gray-500" />
                                <span className="text-gray-600">Evaluated : {item.evaluatedcount}</span>
                            </div>
                            <div className="flex items-center mb-2">
                                <FaPencilAlt className="w-5 h-5 mr-2 text-gray-500" />
                                <span className="text-gray-600">Published : {item.publishedcount}</span>
                            </div>
                        </div>
                        <button className="bg-green-500 hover:bg-green-600 text-white font-bold py-2 px-4 rounded mt-4">
                            Subscribe
                        </button>
                    </div>
                </div>
            ))):(<h1 className="text-2xl font-bold text-gray-500">No Communities Found</h1>)
        }
        </ul>
    </>
  )
}

export default CommunityCard