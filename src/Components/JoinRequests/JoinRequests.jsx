import React,{useState, useEffect} from 'react'
import axios from 'axios'
import Loader from '../Loader/Loader'

const JoinRequests = ({community}) => {

    const [loading, setLoading] = useState(false)
    const [requests, setRequests] = useState([])
    const [User, setUser] = useState(localStorage.getItem('user'))

    const loadData = async(res) => {
        setRequests(res)
    }  
    useEffect(()=> {
        setLoading(true)
        const getJoinRequests = async() => {
            try {
                const token = localStorage.getItem('token')
                const config = {
                    headers: {
                        Authorization: `Bearer ${token}`
                    }
                }
                const res = await axios.get(`http://127.0.0.1:8000/api/community/${community}/get_requests/`, config)
                await loadData(res.data.success)
                setLoading(false)
            } catch (error) {
                console.log(error)
            }
        }
        getJoinRequests()
    },[])



    return (
        <div className="w-full">
            {loading && <Loader/>}
            {!loading && 
            
                <div className="w-full">
                    {
                        requests.length === 0 ?
                        <div className="w-full flex flex-col items-center justify-center">
                            <h1 className="text-2xl font-bold text-gray-600">No Join Requests</h1>
                        </div>:
                        <div className="w-full">
                            {requests.map((request, index) => (
                                <div key={index} className="w-full flex flex-col items-center justify-center">
                                    <div className="w-full flex flex-row items-center justify-between">
                                        <div className="w-1/2 flex flex-row items-center justify-start">
                                            <img className="object-cover w-8 h-8 rounded-full ring ring-gray-300 dark:ring-gray-600" src={request.user.profile_pic} alt="avatar"/>
                                            <h1 className="text-lg font-bold text-gray-600 ml-2">{request.user.username}</h1>
                                        </div>
                                        <div className="w-1/2 flex flex-row items-center justify-end">
                                            <button className="text-sm font-bold text-green-600" onClick={() => {}}>Accept</button>
                                            <button className="text-sm font-bold text-red-600 ml-2" onClick={() => {}}>Reject</button>
                                        </div>
                                    </div>
                                </div>
                            ))}   
                        </div>
                    }
                </div>
            
            }

        </div>
    )
}

export default JoinRequests