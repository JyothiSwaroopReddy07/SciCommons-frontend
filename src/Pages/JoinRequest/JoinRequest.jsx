import React, {useState} from 'react'
import {useParams, useNavigate} from 'react-router-dom'
import axios from 'axios'
import NavBar from '../../Components/NavBar/NavBar'
import ToastMaker from 'toastmaker';
import "toastmaker/dist/toastmaker.css";


const JoinRequest = () => {

    const {communityName} = useParams() 

    const navigate = useNavigate();
  
    const [loading, setLoading] = useState(false);
  
    const submitForm = async(e) => {
      e.preventDefault();
      setLoading(true)
      const form_data = new FormData(e.target);
      const token = localStorage.getItem('token');
      try {
        const response = await axios.post(`https://scicommons-backend.onrender.com/api/community/${communityName}/join_request/`, form_data, {
          headers: {
            "Content-Type": "application/json",
            Authorization: `Bearer ${token}`,
          },
        });
        console.log(response.data);
        if(response.data.success) {
          setLoading(false)
          ToastMaker("Submitted your request", 3500,{
                valign: 'top',
                styles : {
                    backgroundColor: 'green',
                    fontSize: '20px',
                }
            })
        }
        navigate(`/community/${communityName}`)
      } catch (error) {
        setLoading(false)

        ToastMaker("Could not submit your request", 3500,{
              valign: 'top',
              styles : {
                  backgroundColor: 'red',
                  fontSize: '20px',
              }
          })
        console.log(error);
        return;
      }
        setLoading(false);
    };

  return (
    <>
          <NavBar/>
            <div className="flex flex-col items-center justify-center">
            <h1 className="text-4xl font-bold mb-4 mt-4 text-center text-gray-500">
                {communityName} Join Request Form
            </h1>
            </div>
            <div className="m-10 flex justify-center">
            <form onSubmit={(e) => submitForm(e)} className="w-full md:w-2/3">
                <div className="mb-6">
                <label
                    htmlFor="about"
                    className="block mb-2 text-sm font-medium text-gray-900 dark:text-white"
                >
                    Tell us about yourself?
                </label>
                <textarea
                    id="about"
                    name="about"
                    rows={12}
                    className="bg-gray-50 border border-gray-300 text-gray-900 text-sm rounded-lg focus:ring-green-500 focus:border-green-500 block w-full p-2.5 dark:bg-gray-700 dark:border-gray-600 dark:placeholder-gray-400 dark:text-white dark:focus:ring-green-500 dark:focus:border-green-500"
                    placeholder=""
                    required
                />
                </div>

                <div className="mb-6">
                <label
                    htmlFor="summary"
                    className="block mb-2 text-sm font-medium text-gray-900 dark:text-white"
                >
                    Why do you want to join this community?
                </label>
                <textarea
                    id="summary"
                    name="summary"
                    rows={12}
                    className="bg-gray-50 border border-gray-300 text-gray-900 text-sm rounded-lg focus:ring-green-500 focus:border-green-500 block w-full p-2.5 dark:bg-gray-700 dark:border-gray-600 dark:placeholder-gray-400 dark:text-white dark:focus:ring-green-500 dark:focus:border-green-500"
                    placeholder=""
                    required
                />
                </div>

                <div className="flex items-start mb-6 mt-3">
                <div className="flex items-center h-5">
                    <input
                    id="remember"
                    type="checkbox"
                    value=""
                    className="w-4 h-4 border border-gray-300 rounded bg-gray-50 focus:ring-3 focus:ring-green-300 dark:bg-gray-700 dark:border-gray-600 dark:focus:ring-green-600 dark:ring-offset-gray-800"
                    required
                    />
                </div>
                <label
                    htmlFor="remember"
                    className="ml-2 text-sm font-medium text-gray-900 dark:text-gray-300"
                >
                    I agree with the{" "}
                    <a
                    href="/terms-and-conditions"
                    className="text-green-600 hover:underline dark:text-green-500"
                    >
                    terms and conditions
                    </a>
                    .
                </label>
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
                {loading ? 'Loading...' : 'Submit'}
                </button>
            </form>
            </div>
    </>
  )
}

export default JoinRequest