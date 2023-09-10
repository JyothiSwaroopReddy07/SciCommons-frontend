import React,{useEffect} from 'react';
import { useState } from 'react'; 
import NavBar from '../../Components/NavBar/NavBar';
import CommunityEditPage from '../../Components/CommunityEditPage/CommunityEditPage';
import JoinRequests from '../../Components/JoinRequests/JoinRequests'
import axios from "axios"
import Loader from '../../Components/Loader/Loader';
import MembersTable from '../../Components/MembersTable/MembersTable';
import AdminArticlePage from '../AdminArticlePage/AdminArticlePage';


const  CommunityAdminPage =()=>{

const [currentState, setcurrentState] = useState(1);
const [community,setCommunity] = useState(null);
const [loading, setLoading] = useState(false);

const loadData = async (res) => {
    setCommunity(res);
}

useEffect(() => {
    setLoading(true)
    const getCommunity = async () => {
        try {
            const token = localStorage.getItem('token')
            const config = {
                headers: {
                    Authorization: `Bearer ${token}`
                }
            }
            const res = await axios.get('https://scicommons-backend.onrender.com/api/community/mycommunity',config)
            await loadData(res.data.success)
    
        } catch (error) {
            console.log(error)
        }
    }
    getCommunity()

    setLoading(false)
},[])

const onclickFuntion = (indext)=>{
  setcurrentState(indext);
};

  return(
    <div className="w-full">
        <NavBar/>
        {loading && <Loader/>}

        {!loading && 
        community!==null && (
        <div>
            <div className='w-full md:w-4/5 flex mx-auto mt-4'>
                <button className={currentState === 1 ? 'mb-2 text-sm md:text-xl text-green-600 px-2 md:px-5 py-2 border-b-2 border-green-600' : 'mb-2 text-sm md:text-xl px-2 md:px-5 text-gray-600 border-b-2 border-gray-200 py-2'} 
                   style={{cursor:"pointer"}} onClick={()=> onclickFuntion(1)}>
                     Community Info
                </button>
                <button className={currentState === 2 ? 'mb-2 text-sm md:text-xl text-green-600 px-2 md:px-5 py-2 border-b-2 border-green-600' : 'mb-2 text-sm md:text-xl px-2 md:px-5 text-gray-600 border-b-2 border-gray-200  py-2'} 
                   style={{cursor:"pointer"}} onClick={()=> onclickFuntion(2)}>
                        Articles
                </button>
                <button className={currentState === 3 ? 'mb-2 text-sm md:text-xl text-green-600 px-2 md:px-5 py-2  border-b-2 border-green-600' : 'mb-2 text-sm md:text-xl px-2 md:px-5 text-gray-600 border-b-2 border-gray-200 py-2'} 
                   style={{cursor:"pointer"}} onClick={()=> onclickFuntion(3)}>
                        Members
                </button>
                <button className={currentState === 4 ? 'mb-2 text-sm md:text-xl text-green-600 px-2 md:px-5 py-2 border-b-2 border-green-600' : 'mb-2 text-sm md:text-xl px-2 md:px-5 text-gray-600 border-b-2 border-gray-200 py-2'} 
                   style={{cursor:"pointer"}} onClick={()=> onclickFuntion(4)}>
                        Join Requests
                </button>

            </div>
            <div>
                <div className={ currentState === 1? ' p-3 w-full md:w-4/5 mx-auto' : ' p-3 hidden'}>
                    <CommunityEditPage/>
                </div>
                <div className={ currentState === 2? ' p-3 w-full md:w-4/5 mx-auto' : ' p-3 hidden'}>
                    <AdminArticlePage community={community.Community_name}/>
                </div>
                <div className={ currentState === 3? ' p-3 w-full md:w-4/5 mx-auto' : ' p-3 hidden'}>
                    <MembersTable community={community?.Community_name}/>
                </div>
                <div className={ currentState === 4? ' p-3 w-full md:w-4/5 mx-auto' : ' p-3 hidden'}>
                   <JoinRequests community={community?.Community_name}/>
                </div>

            </div>
        </div>)}
        {(!loading && community===null) && (<div className='w-full md:w-4/5 mx-auto mt-4'>
            <div className='text-center text-2xl font-bold'>You are not an admin of any community</div>
            </div>)}

    </div>


    )
};

export default CommunityAdminPage;