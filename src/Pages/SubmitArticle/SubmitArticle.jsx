import React from "react";
import {useNavigate} from 'react-router-dom';
import { MdAddBox,MdRemoveCircle } from "react-icons/md";
import "./SubmitArticle.css";
import NavBar from "../../Components/NavBar/NavBar";
import Footer from "../../Components/Footer/Footer";

const SubmitArticle = () => {

    // const baseURL = "http://127.0.0.1:8000/api/";
  const baseURL = 'https://scicommons-backend.onrender.com/api/';
  const url = baseURL + "articles/create/";

  const [authors, setAuthors] = React.useState([
    {
      userName: "",
      fullName: "",
      email: "",
    },
  ]);
  const [type, setType] = React.useState("op");

  const navigate = useNavigate();

  const submitForm = (e) => {
    e.preventDefault();
    console.log("submitting");
    const data = new FormData(e.target);
    const value = Object.fromEntries(data.entries());
    console.log(value.author);
    console.log(JSON.stringify(value));

    fetch(url, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify(value),
    })
      .then((res) => res.json())
      .then((data) => console.log(data))
      .catch((err) => console.log(err));

    navigate("/");
  };


  const addAuthor = () => {
    setAuthors([
      ...authors,
      {
        userName: "",
        fullName: "",
        email: "",
      },
    ]);
  };
  const removeAuthor = (index) => {
    const newAuthors = [...authors];
    newAuthors.splice(index, 1);
    setAuthors(newAuthors);
   };

  return (
    <>
    <NavBar/>
    <div className="m-10 flex justify-center">
      <form onSubmit={(e) => submitForm(e)}>
        <div className="grid gap-6 mb-6 ">
          <div>
            <label
              htmlFor="title"
              className="block mb-4 text-sm font-medium text-gray-900 dark:text-white"
            >
              Title
            </label>
            <input
              type="text"
              id="title"
              name="title"
              className="bg-gray-50 border border-gray-300 text-gray-900 text-sm rounded-lg focus:ring-green-500 focus:border-green-500 block w-full p-2.5 dark:bg-gray-700 dark:border-gray-600 dark:placeholder-gray-400 dark:text-white dark:focus:ring-green-500 dark:focus:border-green-500"
              required
            />
          </div>
          <div>
            <label
              htmlFor="id"
              className=" text-base mb-2 font-medium text-gray-900 dark:text-white flex flex-row"
            >
              Author(s)
              <MdAddBox
                className="h-7 w-7 mx-2 shadow-md fill-green-500 active:shadow-none"
                onClick={addAuthor}
              />
            </label>
            {authors.map((author, index) => {
              return (
                <div className="grid gap-2 md:grid-cols-3" key={index}>
                  <div>
                    <label
                      htmlFor="userName"
                      className="block mb-2 text-sm font-medium text-gray-900 dark:text-white"
                    >
                      User Id
                    </label>
                    <input
                      type="text"
                      id="userName"
                      name="author"
                      className="bg-gray-50 border border-gray-300 text-gray-900 text-sm rounded-lg focus:ring-green-500 focus:border-green-500 block w-full p-2.5 dark:bg-gray-700 dark:border-gray-600 dark:placeholder-gray-400 dark:text-white dark:focus:ring-green-500 dark:focus:border-green-500"
                      required
                    />
                  </div>
                  <div>
                    <label
                      htmlFor="fullName"
                      className="block mb-2 text-sm font-medium text-gray-900 dark:text-white"
                    >
                      Full Name
                    </label>
                    <input
                      type="tel"
                      id="fullName"
                      name="fullName"
                      className="bg-gray-50 border border-gray-300 text-gray-900 text-sm rounded-lg focus:ring-green-500 focus:border-green-500 block w-full p-2.5 dark:bg-gray-700 dark:border-gray-600 dark:placeholder-gray-400 dark:text-white dark:focus:ring-green-500 dark:focus:border-green-500"
                      placeholder=""
                      required
                    />
                  </div>
                  <div>
                    <div className="flex flex-row justify-between">
                      <label
                        htmlFor="email"
                        className="block mb-2 text-sm font-medium text-gray-900 dark:text-white"
                      >
                        Email
                      </label>
                      <MdRemoveCircle
                        className="h-5 w-5 mx-2 shadow-md fill-red-500 active:shadow-none"
                        onClick={() => removeAuthor(index)}
                      />
                    </div>
                    <input
                      type="email"
                      id="email"
                      name="email"
                      className="bg-gray-50 border border-gray-300 text-gray-900 text-sm rounded-lg focus:ring-green-500 focus:border-green-500 block w-full p-2.5 dark:bg-gray-700 dark:border-gray-600 dark:placeholder-gray-400 dark:text-white dark:focus:ring-green-500 dark:focus:border-green-500"
                      required
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
            htmlFor="articleUrl"
            className="block mb-2 text-sm font-medium text-gray-900 dark:text-white"
          >
            URL to article
          </label>
          <input
            type="url"
            id="articleUrl"
            name="articleUrl"
            className="bg-gray-50 border border-gray-300 text-gray-900 text-sm rounded-lg focus:ring-green-500 focus:border-green-500 block w-full p-2.5 dark:bg-gray-700 dark:border-gray-600 dark:placeholder-gray-400 dark:text-white dark:focus:ring-green-500 dark:focus:border-green-500"
            required
          />
        </div>
        <div className="mb-6">
            <label htmlfor="file" className="block mb-2 text-sm font-medium text-gray-900 dark:text-white">File</label>

            <input type="file" className="block w-full px-3 py-2 mt-2 text-sm text-gray-600 bg-white border border-gray-200 rounded-lg file:bg-gray-200 file:text-gray-700 file:text-sm file:px-4 file:py-1 file:border-none file:rounded-full dark:file:bg-gray-800 dark:file:text-gray-200 dark:text-gray-300 placeholder-gray-400/70 dark:placeholder-gray-500 focus:border-blue-400 focus:outline-none focus:ring focus:ring-blue-300 focus:ring-opacity-40 dark:border-gray-600 dark:bg-gray-900 dark:focus:border-blue-300" />
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
                setType(e.target.value);
              }}
              name="type"
            >
              <option selected value={"open"}>
                Open
              </option>
              <option value={"private"}>Private</option>
            </select>
          </div>
        </div>
        <div className="flex items-start mb-6">
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
              href="#"
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