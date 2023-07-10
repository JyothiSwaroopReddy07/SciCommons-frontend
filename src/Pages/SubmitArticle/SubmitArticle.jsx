import React, {useState} from "react";
import {useNavigate} from 'react-router-dom';
import { MdAddBox,MdRemoveCircle } from "react-icons/md";
import "./SubmitArticle.css";
import NavBar from "../../Components/NavBar/NavBar";
import Footer from "../../Components/Footer/Footer";
import axios from "axios";

const SubmitArticle = () => {

  const baseURL = 'https://scicommons-backend.onrender.com/api/article/';

  const [authors, setAuthors] = useState([
    {
      username: "",
    },
  ]);

  const [communities, setCommunities] = useState([{
    name: "",
  }]);

  const [authorIds, setAuthorIds] = useState([]);
  const [communityIds, setCommunityIds] = useState([]);
  const [status, setStatus] = useState("public");
  

  const navigate = useNavigate();

  const validateUser = async(token) => {

    for(let i=0; i < authors.length; i++){
      if(authors[i].username === ""){
        return false;
      }
      else{
        try{
          const response = await axios.get(`https://scicommons-backend.onrender.com/api/user/`, {
            params: {
              search: authors[i].username,
            },
            headers: {
              "Content-Type": "application/json",
              Authorization: `Bearer ${token}`,
            },
          })
          console.log(response.data.success.results[0].id)
          if(response.data.success.results.length === 0 || (response.data.success.results[0].username !== authors[i].username)){
            return false;
          }
          else {
            const newAuthorIds = [...authorIds, response.data.success.results[0].id];
            setAuthorIds(newAuthorIds);
          }
        } catch(error){
          console.log(error)
          return false;
        }
      }
    }
    return true;
  }

  const validateCommunity = async(token) => {
    for(let i=0; i<communities.length; i++){
      if(communities[i].name === ""){
        return false;
      }
      else{
        try{
          const response = await axios.get(`https://scicommons-backend.onrender.com/api/community/`, {
            params: {
              search: communities[i].name,
            },
            headers: {
              "Content-Type": "application/json",
              Authorization: `Bearer ${token}`,
            },
          })
          console.log(response.data.success.results[0].id)
          if(response.data.success.results.length === 0 || (response.data.success.results[0].Community_name !== communities[i].name)){
            return false;
          }
          else {
            const newCommunityIds = [...communityIds, response.data.success.results[0].id];
            setCommunityIds(newCommunityIds);
          }
        } catch(error){
          console.log(error)
          return false;
        }
      }
    }
    return true;
  }
  const submitForm = async(e) => {
    e.preventDefault();
    setAuthorIds([]);
    setCommunityIds([]);
    const form_data = new FormData(e.target);
    const token = localStorage.getItem('token');
    if(communities.length === 0) {
      alert("Please enter atleast one community name")
      return;
    }
    var res = await validateUser(token)
    if( res === false){
      alert("Please enter the correct usernames")
      return;
    }
    res = await validateCommunity(token)
    if(res === false){
      alert("Please enter the correct community names")
      return;
    }

    form_data.delete('authors');
    form_data.delete('communities');
    form_data.delete('username');

    for(let i=0;i<authorIds.length;i++){
      form_data.append(`authors[${i}]`, JSON.stringify(authorIds[i]));
    }

    for(let i=0;i<communityIds.length;i++){
      form_data.append(`communities[${i}]`, JSON.stringify(communityIds[i]));
    }



    try {
      const response = await axios.post(baseURL, form_data, {
        headers: {
          "Content-Type": "multipart/form-data",
          Authorization: `Bearer ${token}`,
        },
      });
      console.log(response.data);
    } catch (error) {
      console.log(error.response.data)
      alert(error.response.data.error);
      console.log(error);
      return;
    }

    navigate('/articlesuccessfulsubmission');
  };


  const addAuthor = () => {
    setAuthors([
      ...authors,
      {
        username: "",
      },
    ]);
  };
  const removeAuthor = (index) => {
    const newAuthors = [...authors];
    newAuthors.splice(index, 1);
    setAuthors(newAuthors);
   };

   const addCommunity = () => {
    setCommunities([
      ...communities,
      {
        name: "",
      },
    ]);
  };

  const removeCommunity = (index) => {
    const newCommunities = [...communities];
    newCommunities.splice(index, 1);
    setCommunities(newCommunities);
  };

  const changeAuthor = (e, index) => {
    const newAuthors = [...authors];
    newAuthors[index].username = e.target.value;
    setAuthors(newAuthors);
  };

  const changeCommunity = (e, index) => {
    const newCommunities = [...communities];
    newCommunities[index].name = e.target.value;
    setCommunities(newCommunities);
  };

  return (
    <>
    <NavBar/>
    <div className="flex flex-col items-center justify-center">
      <h1 className="text-4xl font-bold mb-4 mt-4 text-center text-gray-500">
        Submit Your Article
      </h1>
      <p className="text-lg text-gray-600 text-center">
        Share your knowledge with the world.
      </p>
    </div>
    <div className="m-10 flex justify-center">
      <form onSubmit={(e) => submitForm(e)} enctype="multipart/form-data">
        <div className="grid gap-6 mb-6 ">
          <div>
            <label
              htmlFor="article_name"
              className="block mb-4 text-sm font-medium text-gray-900 dark:text-white"
            >
              Title
            </label>
            <input
              type="text"
              id="article_name"
              name="article_name"
              className="bg-gray-50 border border-gray-300 text-gray-900 text-sm rounded-lg focus:ring-green-500 focus:border-green-500 block w-full p-2.5 dark:bg-gray-700 dark:border-gray-600 dark:placeholder-gray-400 dark:text-white dark:focus:ring-green-500 dark:focus:border-green-500"
              required
            />
          </div>
          <div>
            <label
              htmlFor="id"
              className=" text-base mb-2 font-medium text-gray-900 dark:text-white flex flex-row"
            >
              Author(s) (Add other authors except yourself)
              <MdAddBox
                className="h-7 w-7 mx-2 shadow-md fill-green-500 active:shadow-none"
                onClick={addAuthor}
              />
            </label>
            {authors.map((author, index) => {
              return (
                <div className="grid gap-2 md:grid-cols-3" key={index}>
                  <div>
                    <div className="flex flex-row justify-between">
                      <label
                        htmlFor="userName"
                        className="block mb-2 text-sm font-medium text-gray-900 dark:text-white"
                      >
                        User Name
                      </label>
                      <MdRemoveCircle
                        className="h-5 w-5 mx-2 shadow-md fill-red-500 active:shadow-none"
                        onClick={() => removeAuthor(index)}
                      />
                    </div>
                    <input
                      type="text"
                      id="username"
                      name="username"
                      onChange={(e)=>changeAuthor(e, index)}
                      className="bg-gray-50 border border-gray-300 text-gray-900 text-sm rounded-lg focus:ring-green-500 focus:border-green-500 block w-full p-2.5 dark:bg-gray-700 dark:border-gray-600 dark:placeholder-gray-400 dark:text-white dark:focus:ring-green-500 dark:focus:border-green-500"
                    />
                  </div>
                </div>
              );
            })}
          </div>
          <div>
            <label
              htmlFor="id"
              className=" text-base mb-2 font-medium text-gray-900 dark:text-white flex flex-row"
            >
              Communities
              <MdAddBox
                className="h-7 w-7 mx-2 shadow-md fill-green-500 active:shadow-none"
                onClick={addCommunity}
              />
            </label>
            {communities.map((community, index) => {
              return (
                <div className="grid gap-2 md:grid-cols-1" key={index}>
                  <div>
                    <div className="flex flex-row justify-between">
                      <label
                        htmlFor="Community_name"
                        className="block mb-2 text-sm font-medium text-gray-900 dark:text-white"
                      >
                        Community Name
                      </label>
                      <MdRemoveCircle
                          className="h-5 w-5 mx-2 shadow-md fill-red-500 active:shadow-none"
                          onClick={() => removeCommunity(index)}
                        />
                    </div>
                    <input
                      type="text"
                      id="Community_name"
                      name="Community_name"
                      onChange={(e)=>changeCommunity(e, index)}
                      className="bg-gray-50 border border-gray-300 text-gray-900 text-sm rounded-lg focus:ring-green-500 focus:border-green-500 block w-full p-2.5 dark:bg-gray-700 dark:border-gray-600 dark:placeholder-gray-400 dark:text-white dark:focus:ring-green-500 dark:focus:border-green-500"
                    />
                  </div>
                </div>
              );
            })}
          </div>
        </div>

        <div className="mb-6">
          <label
            htmlFor="keywords"
            className="block mb-2 text-sm font-medium text-gray-900 dark:text-white"
          >
            Keywords(separated with {'","'})
          </label>
          <input
            type="text"
            id="keywords"
            name="keywords"
            className="bg-gray-50 border border-gray-300 text-gray-900 text-sm rounded-lg focus:ring-green-500 focus:border-green-500 block w-full p-2.5 dark:bg-gray-700 dark:border-gray-600 dark:placeholder-gray-400 dark:text-white dark:focus:ring-green-500 dark:focus:border-green-500"
            required
          />
        </div>
        <div className="mb-6">
          <label
            htmlFor="link"
            className="block mb-2 text-sm font-medium text-gray-900 dark:text-white"
          >
            URL to article (Add the Url only if it is already published, else leave it empty)
          </label>
          <input
            type="url"
            id="link"
            name="link"
            className="bg-gray-50 border border-gray-300 text-gray-900 text-sm rounded-lg focus:ring-green-500 focus:border-green-500 block w-full p-2.5 dark:bg-gray-700 dark:border-gray-600 dark:placeholder-gray-400 dark:text-white dark:focus:ring-green-500 dark:focus:border-green-500"
          />
        </div>

        <div className="mb-6">
          <label
            htmlFor="video"
            className="block mb-2 text-sm font-medium text-gray-900 dark:text-white"
          >
            Video Link (if any)
          </label>
          <input
            type="url"
            id="video"
            name="video"
            className="bg-gray-50 border border-gray-300 text-gray-900 text-sm rounded-lg focus:ring-green-500 focus:border-green-500 block w-full p-2.5 dark:bg-gray-700 dark:border-gray-600 dark:placeholder-gray-400 dark:text-white dark:focus:ring-green-500 dark:focus:border-green-500"
          />
        </div>

        <div className="mb-6">
          <label
            htmlFor="Code"
            className="block mb-2 text-sm font-medium text-gray-900 dark:text-white"
          >
            Code Link (if any)
          </label>
          <input
            type="url"
            id="Code"
            name="Code"
            className="bg-gray-50 border border-gray-300 text-gray-900 text-sm rounded-lg focus:ring-green-500 focus:border-green-500 block w-full p-2.5 dark:bg-gray-700 dark:border-gray-600 dark:placeholder-gray-400 dark:text-white dark:focus:ring-green-500 dark:focus:border-green-500"
          />
        </div>
        <div className="mb-6">
            <label htmlfor="file" className="block mb-2 text-sm font-medium text-gray-900 dark:text-white">File</label>

            <input type="file" required name="article_file" accept="application/pdf" className="block w-full px-3 py-2 mt-2 text-sm text-gray-600 bg-white border border-gray-200 rounded-lg file:bg-gray-200 file:text-gray-700 file:text-sm file:px-4 file:py-1 file:border-none file:rounded-full dark:file:bg-gray-800 dark:file:text-gray-200 dark:text-gray-300 placeholder-gray-400/70 dark:placeholder-gray-500 focus:border-blue-400 focus:outline-none focus:ring focus:ring-blue-300 focus:ring-opacity-40 dark:border-gray-600 dark:bg-gray-900 dark:focus:border-blue-300" />
        </div>
        <div className="mb-6">
          <label
            htmlFor="abstract"
            className="block mb-2 text-sm font-medium text-gray-900 dark:text-white"
          >
            Abstract
          </label>
          <textarea
            id="absctract"
            name="abstract"
            rows={4}
            className="bg-gray-50 border border-gray-300 text-gray-900 text-sm rounded-lg focus:ring-green-500 focus:border-green-500 block w-full p-2.5 dark:bg-gray-700 dark:border-gray-600 dark:placeholder-gray-400 dark:text-white dark:focus:ring-green-500 dark:focus:border-green-500"
            placeholder=""
            required
          />
        </div>
        <div className=" flex flex-row items-start space-x-5">
          <div className="max-w-xs">
            <label
              htmlFor="fullName"
              className="block mb-2 text-sm font-medium text-gray-900 dark:text-white"
            >
              Article Submission Type
            </label>
            <select
              className="w-full p-2.5 text-gray-500 bg-gray-50 border rounded-md shadow-sm outline-none appearance-none focus:border-green-600"
              onChange={(e) => {
                setStatus(e.target.value);
              }}
              name="status"
            >
              <option selected value={"public"}>
                Public
              </option>
              <option value={"private"}>Private</option>
            </select>
          </div>
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
          Submit
        </button>
      </form>
    </div>
    <Footer/>
    </>
  );
};


export default SubmitArticle;