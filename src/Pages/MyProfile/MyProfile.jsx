import React, { useState, useEffect } from 'react';
import axios from 'axios';
import NavBar from '../../Components/NavBar/NavBar';
import Loader from '../../Components/Loader/Loader';

const MyProfile = () => {

    const [email, setEmail] = useState('');
    const [first_name, setFirstName] = useState('');
    const [last_name, setLastName] = useState('');
    const [institute, setInstitute] = useState('');
    const [google_scholar, setGoogleScholar] = useState('');
    const [pubmed, setPubmed] = useState('');
    const [profile_pic_url, setProfilePicUrl] = useState('');
    const [loading,setLoading] = useState(false);
    const [edit,setEdit] = useState(false); 


    useEffect(() => { 
        setLoading(true);
        fetchProfile();
        setLoading(false);
    },[]);


    const loadProfile = async(res) => {
        setEmail(res.email)
        setFirstName(res.first_name===null?"":res.first_name)
        setLastName(res.last_name===null?"":res.last_name)
        setInstitute(res.institute===null?"":res.institute)
        setGoogleScholar(res.google_scholar===null?"":res.google_scholar)
        setPubmed(res.pubmed===null?"":res.pubmed)
        setProfilePicUrl(res.profile_pic_url===null?"":res.profile_pic_url)
    }

    const fetchProfile = async () => {
        const config = {
            headers: {
                Authorization: `Bearer ${localStorage.getItem('token')}`,
            },
        };
        try {
            const response = await axios.get(
                `https://scicommons-backend.onrender.com/api/user/get_current_user/`,
                config
            );
            console.log(response.data.success);
            await loadProfile(response.data.success);
        } catch (error) {
            console.error(error);
        }
    }

    const handleSubmit = async (e) => {
        e.preventDefault();
        setLoading(true);
        const config = {
            headers: {
                Authorization: `Bearer ${localStorage.getItem('token')}`,
            },
        };
        try {
            const response = await axios.put(`https://scicommons-backend.onrender.com/api/user/`,config);
            console.log(response.data.success);
            await loadProfile(response.data.success);
        } catch (error) {
            console.error(error);
        }
        setLoading(false);
    }

    const handleEdit = async() => {
        
        if(!edit)
        {
            const formInputs = document.querySelectorAll('input[type="text"]');
            formInputs.forEach(input => {
                input.removeAttribute('disabled');
            });
        } else {
            const formInputs = document.querySelectorAll('input[type="text"]');
            formInputs.forEach(input => {
                input.setAttribute('disabled',true);
            });
        }
        setEdit(!edit);

    }

    const handleShow = () => {
        if(!edit)
        {
            return "Edit";
        } else {
            return "Cancel";
        }
    }


    return (
        <div>
            <NavBar />
            {loading && <Loader/>}
            {!loading && 
            <div className="flex flex-col items-center h-full mb-5">
            <h1 className="text-3xl font-bold mt-5 mb-5">My Profile</h1>
            <div className="flex flex-col justify-center md:flex-row md:items-center">
                
                <div className="flex flex-col mr-3 mt-3 items-center md:mr-10">
                    <img className="w-[200px] h-[200px]" src={profile_pic_url} alt="Profile Picture" />
                    <form className="flex flex-col items-center" onSubmit={handleSubmit}>
                        <input className="border-2 border-gray-400 rounded-md w-full h-10 px-2 mt-3" type="file" />
                        <button className="bg-green-500 text-white rounded-md w-1/2 h-10 mt-3">Upload</button>
                    </form>
                </div>
                <div className="flex flex-col justify-start">
                    <div className="flex flex-row mt-3">
                        <label className="text-lg font-bold mr-2 text-green-500">Email </label>
                        <p className="text-md">{email}</p>
                    </div>
                    <div className="flex flex-row mt-3">
                        <label className="text-lg font-bold mr-2 text-green-500">FirstName</label>
                        <input className={`border-2 border-gray-400 rounded-md w-4/5 ${edit?"bg-white":"bg-gray-200"} h-7 px-2`} type="text" value={first_name} onChange={(e)=>{setFirstName(e.target.value)}} disabled/>
                    </div>
                    <div className="flex flex-row mt-3">
                        <label className="text-lg font-bold mr-2 text-green-500">LastName</label>
                        <input className={`border-2 border-gray-400 ${edit?"bg-white":"bg-gray-200"} rounded-md w-4/5 h-7 px-2`} type="text" value={last_name} onChange={(e)=>{setLastName(e.target.value)}} disabled/>
                    </div>
                    <div className="flex flex-row mt-3">
                        <label className="text-lg font-bold mr-2 text-green-500">Institute</label>
                        <input className={`border-2 border-gray-400 rounded-md ${edit?"bg-white":"bg-gray-200"} w-4/5 h-7 px-2`} type="text" value={institute} onChange={(e)=>{setInstitute(e.target.value)}} disabled/>
                    </div>
                    <div className="flex flex-row mt-3">
                        <label className="text-lg font-bold mr-2 text-green-500">GoogleScholar</label>
                        <input className={`border-2 border-gray-400 rounded-md ${edit?"bg-white":"bg-gray-200"} w-4/5 h-7 px-2`} type="text" value={google_scholar} onChange={(e)=>{setGoogleScholar(e.target.value)}} disabled/>
                    </div>
                    <div className="flex flex-row mt-3">
                        <label className="text-lg font-bold mr-2 text-green-500">Pubmed</label>
                        <input className={`border-2 border-gray-400 rounded-md ${edit?"bg-white":"bg-gray-200"} w-4/5 h-7 px-2`} type="text" value={pubmed} disabled/>
                    </div>
                    <div className="flex flex-row justify-around">
                        <button className="bg-green-600 text-white rounded-md w-[50px] h-10 mt-3" onClick={handleEdit}>Save</button>
                        <button className={`${!edit?"bg-gray-600":"bg-red-600"} text-white rounded-md w-[50px] h-10 mt-3`} onClick={(e)=>{e.preventDefault();handleEdit()}}>{handleShow()}</button>
                    </div>
                </div>
            </div>
            </div>
            }
        </div>
    )
};

export default MyProfile;