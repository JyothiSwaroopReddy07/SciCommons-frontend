import React, {useState,useEffect} from 'react';
import axios from 'axios';
import ToastMaker from 'toastmaker';
import "toastmaker/dist/toastmaker.css";
import Loader from '../Loader/Loader';

const CommunityEditPage = () => {

    const [community, setCommunity] = useState(null)
    const [showModal, setShowModal] = useState(false)
    const [loading, setLoading] = useState(false)
    const [subtitle, setSubtitle] = useState('')
    const [description, setDescription] = useState('')
    const [location, setLocation] = useState('')
    const [github, setGithub] = useState('')
    const [website, setWebsite] = useState('')
    const [email, setEmail] = useState('')
    const [name, setName] = useState('')

    const loadData = async(res)=>{
        setCommunity(res)
        setSubtitle(res.subtitle)
        setDescription(res.description)
        setLocation(res.location)
        setGithub(res.github)
        setWebsite(res.website)
        setEmail(res.email)
        setName(res.Community_name)
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

    const submitForm = async(e) => {
        e.preventDefault();
        
        setLoading(true)
        const form_data = new FormData(e.target);
        const token = localStorage.getItem('token');
        
        try {
          const response = await axios.put(`https://scicommons-backend.onrender.com/api/community/${community.Community_name}/`, form_data, {
            headers: {
              "Content-type": "multipart/form-data",
              Authorization: `Bearer ${token}`,
            },
          });
          if(response.data.success){
            setLoading(false)
            setShowModal(false)
            setCommunity(response.data.success)
            ToastMaker("Community Details Updated Successfully", 3500,{
                valign: 'top',
                  styles : {
                      backgroundColor: 'green',
                      fontSize: '20px',
                  }
              })
          }
        } catch (error) {
          setLoading(false)
          if(error.response.data.error){
            ToastMaker("Could not update the details", 3500,{
                valign: 'top',
                styles : {
                    backgroundColor: 'red',
                    fontSize: '20px',
                }
            })
            return;
          }
          console.log(error);

          return;
        }
    };
    const handleSubtitleChange = (e) => {
        setSubtitle(e.target.value)
    }
    const handleDescriptionChange = (e) => {
        setDescription(e.target.value)
    }
    const handleLocationChange = (e) => {
        setLocation(e.target.value)
    }
    const handleGithubChange = (e) => {
        setGithub(e.target.value)
    }
    const handleWebsiteChange = (e) => {
        setWebsite(e.target.value)
    }
    const handleEmailChange = (e) => {
        setEmail(e.target.value)
    }

  return (
    <div className='w-full'>
    {loading && <div className="w-full"><Loader/></div> }
    {!loading &&
        <div className="w-full">
                <div className="flex m-4">
                    <span className="text-green-500 text-sm md:text-md font-semibold">Name:&nbsp;</span> <p className="text-sm md:text-md">{community?.Community_name}</p>
                </div>
                <div className="flex m-4">
                    <span className="text-green-500 text-sm md:text-md font-semibold">Subtitle:&nbsp;</span> <p className="text-sm md:text-md">{community?.subtitle}</p>
                </div>
                <div className="flex m-4">
                    <span className="text-green-500 text-sm md:text-md font-semibold">Description:&nbsp;</span> <p className="text-sm md:text-md">{community?.description}</p>
                </div>
                <div className="flex m-4">
                    <span className="text-green-500 text-sm md:text-md font-semibold">Email:&nbsp;</span> <p className="text-sm md:text-md">{community?.email}</p>
                </div>
                <div className="flex m-4">
                    <span className="text-green-500 text-sm md:text-md font-semibold">Website:&nbsp;</span> <p className="text-sm md:text-md">{community?.website}</p>
                </div>
                <div className="flex m-4">
                    <span className="text-green-500 text-sm md:text-md font-semibold">GitHub:&nbsp;</span> <p className="text-sm md:text-md">{community?.github}</p>
                </div>
                <div className="flex m-4">
                    <span className="text-green-500 text-sm md:text-md font-semibold">Location:&nbsp;</span> <p className="text-sm md:text-md">{community?.location}</p>
                </div>

                <button className="bg-green-100 text-sm md:text-lg font-semibold py-2 px-2 rounded" style={{width:'auto'}} onClick={() => setShowModal(true)}>Edit Details</button>

            {showModal ? (
                <div className="w-full">
                    <div className="w-4/5 z-50 p-5 bg-white absolute top-20 overflow-y-auto h-3/4 mx-auto rounded">
                        <div className="mb-6">
                            <h1 className="text-md md:text-2xl font-semibold text-green-700 text-center">Edit Community Details</h1>
                            <button
                                className="bg-transparent border-0 text-red-600 float-right"
                                onClick={() => setShowModal(false)}
                            >
                                <span className="text-red-600 opacity-7 h-6 w-6 text-sm py-0 font-bold rounded-full">
                                     Close
                                </span>
                            </button>
                        </div>
                        <div>
                            <form onSubmit={(e) => submitForm(e)} encType="multipart/form-data" className="w-full">
                            <label
                                htmlFor="Community_name"
                                className="block mb-4 text-sm font-medium text-gray-900 dark:text-white"
                                >
                                Community Name
                                </label>
                                <input
                                type="text"
                                id="Community_name"
                                name="Community_name"
                                value={community?.Community_name}
                                className="bg-gray-50 border border-gray-300 text-gray-900 text-sm rounded-lg focus:ring-green-500 focus:border-green-500 block w-full p-2.5 dark:bg-gray-700 dark:border-gray-600 dark:placeholder-gray-400 dark:text-white dark:focus:ring-green-500 dark:focus:border-green-500"
                                disabled
                                />
                                <div className="mb-6">
                                <label
                                    htmlFor="subtitle"
                                    className="block mb-2 text-sm font-medium text-gray-900 dark:text-white"
                                >
                                    Subtitle
                                </label>
                                <input
                                    type="text"
                                    id="subtitle"
                                    name="subtitle"
                                    value={subtitle}
                                    onChange={handleSubtitleChange}
                                    className="bg-gray-50 border border-gray-300 text-gray-900 text-sm rounded-lg focus:ring-green-500 focus:border-green-500 block w-full p-2.5 dark:bg-gray-700 dark:border-gray-600 dark:placeholder-gray-400 dark:text-white dark:focus:ring-green-500 dark:focus:border-green-500"
                                    required
                                />
                                </div>

                                <div className="mb-6">
                                <label
                                    htmlFor="description"
                                    className="block mb-2 text-sm font-medium text-gray-900 dark:text-white"
                                >
                                    Description
                                </label>
                                <textarea
                                    id="description"
                                    name="description"
                                    rows={8}
                                    value={description}
                                    onChange={handleDescriptionChange}
                                    className="bg-gray-50 border border-gray-300 text-gray-900 text-sm rounded-lg focus:ring-green-500 focus:border-green-500 block w-full p-2.5 dark:bg-gray-700 dark:border-gray-600 dark:placeholder-gray-400 dark:text-white dark:focus:ring-green-500 dark:focus:border-green-500"
                                    placeholder=""
                                    required
                                />
                                </div>
                                <div className="mb-6">
                                <label
                                    htmlFor="location"
                                    className="block mb-2 text-sm font-medium text-gray-900 dark:text-white"
                                >
                                    Location
                                </label>
                                <input
                                    type="test"
                                    id="location"
                                    name="location"
                                    value={location}
                                    onChange={handleLocationChange}
                                    className="bg-gray-50 border border-gray-300 text-gray-900 text-sm rounded-lg focus:ring-green-500 focus:border-green-500 block w-full p-2.5 dark:bg-gray-700 dark:border-gray-600 dark:placeholder-gray-400 dark:text-white dark:focus:ring-green-500 dark:focus:border-green-500"
                                    required
                                />
                                </div>

                                <div className="mb-6">
                                <label
                                    htmlFor="github"
                                    className="block mb-2 text-sm font-medium text-gray-900 dark:text-white"
                                >
                                    Github Link (if any)
                                </label>
                                <input
                                    type="url"
                                    id="github"
                                    name="github"
                                    value={github}
                                    onChange={handleGithubChange}
                                    className="bg-gray-50 border border-gray-300 text-gray-900 text-sm rounded-lg focus:ring-green-500 focus:border-green-500 block w-full p-2.5 dark:bg-gray-700 dark:border-gray-600 dark:placeholder-gray-400 dark:text-white dark:focus:ring-green-500 dark:focus:border-green-500"
                                />
                                </div>

                                <div className="mb-6">
                                <label
                                    htmlFor="website"
                                    className="block mb-2 text-sm font-medium text-gray-900 dark:text-white"
                                >
                                    Website Link
                                </label>
                                <input
                                    type="url"
                                    id="website"
                                    name="website"
                                    value={website}
                                    onChange={handleWebsiteChange}
                                    className="bg-gray-50 border border-gray-300 text-gray-900 text-sm rounded-lg focus:ring-green-500 focus:border-green-500 block w-full p-2.5 dark:bg-gray-700 dark:border-gray-600 dark:placeholder-gray-400 dark:text-white dark:focus:ring-green-500 dark:focus:border-green-500"
                                    required
                                />
                                </div>

                                <div className="mb-6">
                                <label
                                    htmlFor="email"
                                    className="block mb-2 text-sm font-medium text-gray-900 dark:text-white"
                                >
                                    Email (of the Community)
                                </label>
                                <input
                                    type="email"
                                    id="email"
                                    name="email"
                                    value={email}
                                    onChange={handleEmailChange}
                                    className="bg-gray-50 border border-gray-300 text-gray-900 text-sm rounded-lg focus:ring-green-500 focus:border-green-500 block w-full p-2.5 dark:bg-gray-700 dark:border-gray-600 dark:placeholder-gray-400 dark:text-white dark:focus:ring-green-500 dark:focus:border-green-500"
                                    required
                                />
                                </div>

                                <button
                                type="submit"
                                className="text-white bg-green-700 hover:bg-green-800 focus:ring-4 focus:outline-none focus:ring-green-300 font-medium rounded-lg text-sm w-full sm:w-auto px-5 py-2.5 text-center dark:bg-green-600 dark:hover:bg-green-700 dark:focus:ring-green-800"
                                >
                                    {loading && (
                                <div className="absolute top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2">
                                    <div className="rounded-full border-2 border-t-2 border-green-100 h-4 w-4 animate-spin"></div>
                                </div>
                                )}
                                {loading ? 'Loading...' : 'Save Changes'}
                                </button>
                            </form>
                        </div>
                    </div>
                    <div className="fixed inset-0 bg-black bg-opacity-50"></div>
                </div>
            ) : null}
        </div>}
    </div>
  )
}

export default CommunityEditPage