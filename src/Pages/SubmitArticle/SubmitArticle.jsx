import React, {useState} from "react";
import {useNavigate} from 'react-router-dom';
import { MdAddBox,MdRemoveCircle } from "react-icons/md";
import "./SubmitArticle.css";
import NavBar from "../../Components/NavBar/NavBar";
import Footer from "../../Components/Footer/Footer";
import Loader from "../../Components/Loader/Loader";
import axios from "axios";
import ToastMaker from 'toastmaker';
import "toastmaker/dist/toastmaker.css";
import {useGlobalContext} from '../../Context/StateContext'

const SubmitArticle = () => {

  const baseURL = 'https://scicommons-backend.onrender.com/api/article/';
  const {token} = useGlobalContext()

  const [authors, setAuthors] = useState([
    {
      username: "",
    },
  ]);

  const [communities, setCommunities] = useState([{
    name: "",
  }]);

  const [status, setStatus] = useState("public");
  const [loading, setLoading] = useState(false);
  

  const navigate = useNavigate();

  const validateKeywords = (value) => {
    // Regular expression to match characters other than alphabets, commas, and spaces
    const regex = /[^a-zA-Z, ]/;
  
    // Check if the value contains any invalid characters
    if (regex.test(value)) {
      return false;
    }
  
    return true;
  } 

  const submitForm = async(e) => {
    e.preventDefault();
    const form_data = new FormData(e.target);

    var authorIds = [];
    var communityIds = [];
    if(validateKeywords(form_data.get('keywords'))=== false){
      ToastMaker("Please enter the correct keywords following the format specified", 3500,{
        valign: 'top',
          styles : {
              backgroundColor: 'red',
              fontSize: '20px',
          }
      })
      return;
    }
    for(let i=0; i < authors.length; i++){
      if(authors[i].username === ""){
        return;
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
          if(response.data.success.results.length === 0 || (response.data.success.results[0].username !== authors[i].username)){
            return;
          }
          else {
            authorIds.push(response.data.success.results[0].id);
          }
        } catch(error){
          console.log(error)
          ToastMaker("Please enter the correct usernames!!!", 3500,{
            valign: 'top',
              styles : {
                  backgroundColor: 'red',
                  fontSize: '20px',
              }
          })
          return;
        }
      }
    }


    form_data.delete('authors');
    form_data.delete('communities');
    form_data.delete('username');

    form_data.append('authors[0]', JSON.stringify(0));
  
    for(let i=0;i<authorIds.length;i++){
      form_data.append(`authors[${i+1}]`, JSON.stringify(authorIds[i]));
    }


    form_data.append('communities[0]', JSON.stringify(0));

    setLoading(true);
    try {
      const response = await axios.post(baseURL, form_data, {
        headers: {
          "Content-Type": "multipart/form-data",
          Authorization: `Bearer ${token}`,
        },
      });
    } catch (error) {
      ToastMaker(error.response.data.error, 3500,{
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
    setAuthors([...newAuthors]);
   };

  const changeAuthor = (e, index) => {
    const newAuthors = [...authors];
    newAuthors[index].username = e.target.value;
    setAuthors([...newAuthors]);
  };


  return (
    <>
    <NavBar/>
    {
      loading ? (<Loader/>) :
    (<>
    <div className="flex flex-col items-center justify-center">
      <h1 className="text-4xl font-bold mb-4 mt-4 text-center text-gray-500">
        Submit Your Article
      </h1>
      <p className="text-lg text-gray-600 text-center">
        Share your knowledge with the world.
      </p>
    </div>
    <div className="m-10 flex justify-center">
      <form onSubmit={(e) => submitForm(e)} encType="multipart/form-data">
        <div className="grid gap-6 mb-6 ">
          <div>
            <label
              htmlFor="article_name"
              className="block mb-4 text-sm font-medium text-gray-900"
            >
              Title
            </label>
            <input
              type="text"
              id="article_name"
              name="article_name"
              className="bg-gray-50 border border-gray-300 text-gray-900 text-sm rounded-lg focus:ring-green-500 focus:border-green-500 block w-full p-2.5"
              required
            />
          </div>
          <div>
            <label
              htmlFor="id"
              className=" text-base mb-2 font-medium text-gray-900 flex flex-row"
            >
              Author(s) (Add other authors except yourself)
              <MdAddBox
                className="h-7 w-7 mx-2 shadow-md fill-green-500 active:shadow-none"
                style={{cursor:"pointer"}}
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
                        className="block mb-2 text-sm font-medium text-gray-900"
                      >
                        User Name
                      </label>
                      <MdRemoveCircle
                        className="h-5 w-5 mx-2 shadow-md fill-red-500 active:shadow-none"
                        style={{cursor:"pointer"}}
                        onClick={() => removeAuthor(index)}
                      />
                    </div>
                    <input
                      type="text"
                      id="username"
                      name="username"
                      onChange={(e)=>changeAuthor(e, index)}
                      className="bg-gray-50 border border-gray-300 text-gray-900 text-sm rounded-lg focus:ring-green-500 focus:border-green-500 block w-full p-2.5"
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
            className="block mb-2 text-sm font-medium text-gray-900"
          >
            Keywords(separated with {'","'})
          </label>
          <input
            type="text"
            id="keywords"
            name="keywords"
            className="bg-gray-50 border border-gray-300 text-gray-900 text-sm rounded-lg focus:ring-green-500 focus:border-green-500 block w-full p-2.5"
            required
          />
        </div>
        <div className="mb-6">
          <label
            htmlFor="link"
            className="block mb-2 text-sm font-medium text-gray-900"
          >
            URL to article (Add the Url only if it is already published, else leave it empty)
          </label>
          <input
            type="url"
            id="link"
            name="link"
            className="bg-gray-50 border border-gray-300 text-gray-900 text-sm rounded-lg focus:ring-green-500 focus:border-green-500 block w-full p-2.5"
          />
        </div>

        <div className="mb-6">
          <label
            htmlFor="video"
            className="block mb-2 text-sm font-medium text-gray-900"
          >
            Video Link (if any)
          </label>
          <input
            type="url"
            id="video"
            name="video"
            className="bg-gray-50 border border-gray-300 text-gray-900 text-sm rounded-lg focus:ring-green-500 focus:border-green-500 block w-full p-2.5"
          />
        </div>

        <div className="mb-6">
          <label
            htmlFor="Code"
            className="block mb-2 text-sm font-medium text-gray-900"
          >
            Code Link (if any)
          </label>
          <input
            type="url"
            id="Code"
            name="Code"
            className="bg-gray-50 border border-gray-300 text-gray-900 text-sm rounded-lg focus:ring-green-500 focus:border-green-500 block w-full p-2.5"
          />
        </div>
        <div className="mb-6">
            <label htmlFor="file" className="block mb-2 text-sm font-medium text-gray-900">File</label>
            <input type="file" required accept="application/pdf" name="article_file" className="block w-full px-5 py-2 mt-2 text-sm text-gray-600 bg-white border border-gray-200 rounded-lg file:bg-gray-200 file:text-gray-700 file:text-sm file:px-4 file:py-1 file:border-none file:rounded-full  placeholder-gray-400/70  focus:border-blue-400 focus:outline-none focus:ring focus:ring-blue-300 focus:ring-opacity-40" />
        </div>
        <div className="mb-6">
          <label
            htmlFor="Abstract"
            className="block mb-2 text-sm font-medium text-gray-900"
          >
            Abstract
          </label>
          <textarea
            id="Abstract"
            name="Abstract"
            rows={4}
            className="bg-gray-50 border border-gray-300 text-gray-900 text-sm rounded-lg focus:ring-green-500 focus:border-green-500 block w-full p-2.5"
            placeholder=""
            required
          />
        </div>
        <div className=" flex flex-row items-start space-x-5">
          <div className="max-w-xs">
            <label
              htmlFor="fullName"
              className="block mb-2 text-sm font-medium text-gray-900"
            >
              Article Submission Type
            </label>
            <select
              className="w-full p-2.5 text-gray-500 bg-gray-50 border rounded-md shadow-sm outline-none appearance-none focus:border-green-600"
              value={status}
              onChange={(e) => {
                setStatus(e.target.value);
              }}
              name="status"
            >
              <option value="public">Public</option>
              <option value="private">Private</option>
            </select>
          </div>
        </div>
        <div className="flex items-start mb-6 mt-3">
          <div className="flex items-center h-5">
            <input
              id="remember"
              type="checkbox"
              value=""
              className="w-4 h-4 border border-gray-300 rounded bg-gray-50 focus:ring-3 focus:ring-green-300"
              required
            />
          </div>
          <label
            htmlFor="remember"
            className="ml-2 text-sm font-medium text-gray-900"
          >
            I agree with the{" "}
            <a
              href="/terms-and-conditions"
              className="text-green-600 hover:underline"
            >
              terms and conditions
            </a>
            .
          </label>
        </div>

        <button
          type="submit"
          className="text-white bg-green-700 hover:bg-green-800 focus:ring-4 focus:outline-none focus:ring-green-300 font-medium rounded-lg text-sm w-full sm:w-auto px-5 py-2.5 text-center"
        >
          Submit
        </button>
      </form>
    </div>
    </>)
    }
    <Footer/>
    </>
  );
};


export default SubmitArticle;