import React, {useState} from "react";
import {useNavigate} from 'react-router-dom';
import "./CreateCommunity.css";
import NavBar from "../../Components/NavBar/NavBar";
import Footer from "../../Components/Footer/Footer";
import axios from "axios";

const CreateCommunity = () => {

  const baseURL = 'https://scicommons-backend.onrender.com/api/community/'; 

  const navigate = useNavigate();

  const [loading, setLoading] = useState(false);
  const [errors, setErrors] = useState({
    Community_name: "",
  });

  const submitForm = async(e) => {
    e.preventDefault();
    setLoading(true)
    const form_data = new FormData(e.target);
    const token = localStorage.getItem('token');
    
    try {
      const response = await axios.post(baseURL, form_data, {
        headers: {
          "Content-Type": "multipart/form-data",
          Authorization: `Bearer ${token}`,
        },
      });
      console.log(response.data);
      if(response.data.success){
        setLoading(false)
        navigate('/communitysuccessfulcreated');
      }
    } catch (error) {
      setLoading(false)
      if(error.response.data.error){
        alert(error.response.data.error)
        return;
      }
      setErrors(error.response.data)
      console.log(error);
      return;
    }
  };


  return (
    <>
    <NavBar/>
    <div className="flex flex-col items-center justify-center">
      <h1 className="text-4xl font-bold mb-4 mt-4 text-center text-gray-500">
        Create a Community
      </h1>
    </div>
    <div className="m-10 flex justify-center">
      <form onSubmit={(e) => submitForm(e)} encType="multipart/form-data" className="w-full md:w-2/3">
        <div className="grid gap-6 mb-6">
          <div>
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
              className="bg-gray-50 border border-gray-300 text-gray-900 text-sm rounded-lg focus:ring-green-500 focus:border-green-500 block w-full p-2.5 dark:bg-gray-700 dark:border-gray-600 dark:placeholder-gray-400 dark:text-white dark:focus:ring-green-500 dark:focus:border-green-500"
              required
            />
            {
                errors.Community_name && (
                    <p className="text-red-500 text-xs italic">{errors.Community_name}</p>
                )
            }
          </div>
        </div>

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
            className="bg-gray-50 border border-gray-300 text-gray-900 text-sm rounded-lg focus:ring-green-500 focus:border-green-500 block w-full p-2.5 dark:bg-gray-700 dark:border-gray-600 dark:placeholder-gray-400 dark:text-white dark:focus:ring-green-500 dark:focus:border-green-500"
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
    <Footer/>
    </>
  );
};


export default CreateCommunity;