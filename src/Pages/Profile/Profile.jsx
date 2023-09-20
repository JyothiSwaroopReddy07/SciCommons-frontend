// src/Profile.js
import React, {useState, useEffect} from 'react';
import NavBar from '../../Components/NavBar/NavBar';
import { Link, useParams, useNavigate } from 'react-router-dom';
import axios from 'axios';
import {SlUser} from "react-icons/sl";
import Post from '../../Components/Post/Post';
import Loader from '../../Components/Loader/Loader';
import dayjs from "dayjs";
import { AiFillEye } from "react-icons/ai";
import ToastMaker from "toastmaker";
import "toastmaker/dist/toastmaker.css";
import { Bars } from 'react-loader-spinner'
import {RxCross2} from "react-icons/rx";


const Loading = () => {
  return (
    <div className="w-full h-full flex flex-col items-center bg-white justify-center px-4">
        <Bars
        height="80"
        width="80"
        color="#22c55e"
        ariaLabel="bars-loading"
        wrapperStyle={{}}
        wrapperClass=""
        visible={true}
        />
    </div>
  )
}

const Following = ({setFollowingModal}) => {

  const [loading, setLoading] = useState(false);
  const [followers, setFollowers] = useState([]);

  const {username} = useParams();

  const loadData = async(res) => {
    setFollowers(res)
  }


  const handleFollow = async(e,index) => {
    e.preventDefault();
    const config = {
      headers: {
        "Content-Type": "application/json",
        Authorization: `Bearer ${localStorage.getItem("token")}`,
      },
    };
    if(!followers[index].isFollowing){
      try {
        const res = await axios.post(
          `https://scicommons-backend.onrender.com/api/user/follow/`,{followed_user:followers[index].user},config)
        let updatedFollowers = [...followers];
        updatedFollowers[index].isFollowing = !updatedFollowers[index].isFollowing;
        await loadData(updatedFollowers);
      }
      catch(err){
        console.log(err)
      }
    }else{
      try {
        const res = await axios.post(
          `https://scicommons-backend.onrender.com/api/user/unfollow/`,{followed_user:followers[index].user},config)
          let updatedFollowers = [...followers];
          updatedFollowers[index].isFollowing = !updatedFollowers[index].isFollowing;
          await loadData(updatedFollowers);
      }
      catch(err){
        console.log(err)
      }
    }
  }

  const fillFollow = (follower) => {
    if(follower.isFollowing){
      return "Unfollow"
    }
    return "Follow";
  }
  
  const fetchFollowers = async () => {
    setLoading(true);
    const config = {
        headers: {
            "Content-Type": "application/json",
            Authorization: `Bearer ${localStorage.getItem("token")}`,
        },
        params: {
          username:username,
        },
    }
    try{
        const res = await axios.get("https://scicommons-backend.onrender.com/api/user/following/", config);
          await loadData(res.data.success)
          console.log(res.data.success);
    }
    catch(err){
        console.log(err)
    }
    setLoading(false);
  };

  useEffect(()=>{
    fetchFollowers();
  },[]);

  return (
    <>
      <div className="fixed inset-0 flex items-center justify-center z-50 bg-gray-800 bg-opacity-50">
        <div className="bg-white rounded-lg w-1/2 h-3/4 overflow-y-auto">
          <div className="flex flex-col items-center p-4">
            <div className="flex flex-row justify-between w-full mb-2">
              <h1 className="text-xl font-bold">Following</h1>
              <button className="text-xl font-bold" onClick={()=>setFollowingModal(false)}><RxCross2 className="w-6 h-6"/></button>
            </div>
            <div className="flex flex-col items-center w-full">
              {loading ? (
                <Loading />
              ) : (
                <>
                  {followers.length > 0 && (
                    followers.map((follower,index) => (
                      <div
                        key={follower.id}
                        className="flex flex-row items-center w-full"
                      >
                      {follower.avatar.includes("None")?<SlUser className="w-12 h-12 text-black-800 mr-4"/>:
                        <img
                          src={follower.avatar}
                          alt={follower.username}
                          className="w-12 h-12 rounded-full mr-4"
                        />
                      }
                        <div className="flex flex-row justify-between w-full">
                          <Link
                            to={`/profile/${follower.username}`}
                            className="text-lg font-bold text-green-600"
                          >
                            {follower.username}
                          </Link>

                          {JSON.parse(localStorage.getItem("user")).username!== follower.username &&<button 
                            className={`rounded-lg ${follower.isFollowing?"bg-gray-500":"bg-green-500"} text-white px-2 py-1`} style={{cursor:"pointer"}} onClick={(e)=>{handleFollow(e,index)}}>{fillFollow(follower)}
                          </button>}
                        </div>
                      </div>))
                  )}
                    {followers.length === 0 && <div className="flex justify-center h-full w-full">
                      <p className="text-2xl font-semibold">No Follows to show</p>
                      </div>}

                  </>)
                }
              </div>
            </div>
          </div>
      </div>
    </>
  )
}

const Followers = ({setFollowersModal}) => {

  const [loading, setLoading] = useState(false);
  const [followers, setFollowers] = useState([]);

  const {username} = useParams();

  const loadData = async(res) => {
    setFollowers(res)
  }


  const handleFollow = async(e,index) => {
    e.preventDefault();
    const config = {
      headers: {
        "Content-Type": "application/json",
        Authorization: `Bearer ${localStorage.getItem("token")}`,
      },
    };
    if(!followers[index].isFollowing){
      try {
        const res = await axios.post(
          `https://scicommons-backend.onrender.com/api/user/follow/`,{followed_user:followers[index].user},config)
        let updatedFollowers = [...followers];
        updatedFollowers[index].isFollowing = !updatedFollowers[index].isFollowing;
        await loadData(updatedFollowers);
      }
      catch(err){
        console.log(err)
      }
    }else{
      try {
        const res = await axios.post(
          `https://scicommons-backend.onrender.com/api/user/unfollow/`,{followed_user:followers[index].user},config)
          let updatedFollowers = [...followers];
          updatedFollowers[index].isFollowing = !updatedFollowers[index].isFollowing;
          await loadData(updatedFollowers);
      }
      catch(err){
        console.log(err)
      }
    }
  }

  const fillFollow = (follower) => {
    if(follower.isFollowing){
      return "Unfollow"
    }
    return "Follow";
  }
  
  const fetchFollowers = async () => {
    setLoading(true);
    const config = {
        headers: {
            "Content-Type": "application/json",
            Authorization: `Bearer ${localStorage.getItem("token")}`,
        },
        params: {
          username:username,
        },
    }
    try{
        const res = await axios.get("https://scicommons-backend.onrender.com/api/user/followers/", config);
          await loadData(res.data.success)
          console.log(res.data.success);
    }
    catch(err){
        console.log(err)
    }
    setLoading(false);
  };

  useEffect(()=>{
    fetchFollowers();
  },[]);

  return (
    <>
      <div className="fixed inset-0 flex items-center justify-center z-50 bg-gray-800 bg-opacity-50">
        <div className="bg-white rounded-lg w-1/2 h-3/4 overflow-y-auto">
          <div className="flex flex-col items-center p-4">
            <div className="flex flex-row justify-between w-full mb-2">
              <h1 className="text-xl font-bold">Followers</h1>
              <button className="text-xl font-bold" onClick={()=>setFollowersModal(false)}><RxCross2 className="w-6 h-6"/></button>
            </div>
            <div className="flex flex-col items-center w-full">
              {loading ? (
                <Loading />
              ) : (
                <>
                  {followers.length > 0 && (
                    followers.map((follower,index) => (
                      <div
                        key={follower.id}
                        className="flex flex-row items-center w-full"
                      >
                      {follower.avatar.includes("None")?<SlUser className="w-12 h-12 text-black-800 mr-4"/>:
                        <img
                          src={follower.avatar}
                          alt={follower.username}
                          className="w-12 h-12 rounded-full mr-4"
                        />
                      }
                        <div className="flex flex-row justify-between w-full">
                          <Link
                            to={`/profile/${follower.username}`}
                            className="text-lg font-bold text-green-600"
                          >
                            {follower.username}
                          </Link>

                          {JSON.parse(localStorage.getItem("user")).username!== follower.username &&<button 
                            className={`rounded-lg ${follower.isFollowing?"bg-gray-500":"bg-green-500"} text-white px-2 py-1`} style={{cursor:"pointer"}} onClick={(e)=>{handleFollow(e,index)}}>{fillFollow(follower)}
                          </button>}
                        </div>
                      </div>))
                  )}
                    {followers.length === 0 && <div className="flex justify-center h-full w-full">
                      <p className="text-2xl font-semibold">No Followers to show</p>
                      </div>}

                  </>)
                }
              </div>
            </div>
          </div>
      </div>
    </>
  )
}

const Profile = () => {

  const {username} = useParams();
  const [user, setUser] = useState(null)
  const [loading, setLoading] = useState(false);
  const [currentState, setcurrentState] = useState(1);
  const [posts,setPosts] = useState([]);
  const [articles, setArticles] = useState([]);
  const [followers,setFollowers] = useState(false);
  const [following,setFollowing] = useState(false);
  const navigate = useNavigate();


  const handleFollow = async(e) => {
    e.preventDefault();
    const config = {
      headers: {
        "Content-Type": "application/json",
        Authorization: `Bearer ${localStorage.getItem("token")}`,
      },
    };
    if(!user.isFollowing){
      try {
        const res = await axios.post(
          `https://scicommons-backend.onrender.com/api/user/follow/`,{followed_user:user.id},config)
        let updatedUser = {...user};
        updatedUser.isFollowing = !updatedUser.isFollowing;
        updatedUser.followers = updatedUser.followers + 1;
        await loadUserData(updatedUser);
      }
      catch(err){
        console.log(err)
      }
    }else{
      try {
        const res = await axios.post(
          `https://scicommons-backend.onrender.com/api/user/unfollow/`,{followed_user:user.id},config)
        let updatedUser = {...user};
        updatedUser.isFollowing = !updatedUser.isFollowing;
        updatedUser.followers = updatedUser.followers - 1;
        await loadUserData(updatedUser);
      }
      catch(err){
        console.log(err)
      }
    }
  }

  const formatCount = (count) => {
    if (count < 1000) {
      return count.toString();
    } else if (count < 1000000) {
      return (count / 1000).toFixed(1) + "K";
    } else {
      return (count / 1000000).toFixed(1) + "M";
    }
  };

  const loadData = async(res) => {
    setPosts(res)
  }

  const onDeletePost = async(id) => {
    const updatedPosts = posts.filter(post => post.id !== id);
    await loadData(updatedPosts);
  }
  
  const handleEditChange = async(postId,body,image_url) => {
    const updatedPosts = [...posts];
    const index = updatedPosts.findIndex(post => post.id === postId);
    updatedPosts[index].body = body;
    updatedPosts[index].image_url = image_url;
    await loadData(updatedPosts);
  }

  const loadArticleData = async(res) => {
    setArticles(res);
  }

  const getPosts = async() => {
    const config = {
        headers: {
            "Content-Type": "application/json",
            Authorization: `Bearer ${localStorage.getItem("token")}`,
        },
    }
    try{
        const res = await axios.get(`https://scicommons-backend.onrender.com/api/user/${username}/posts/`, config)
        await loadData(res.data.success)
    } catch(err) {
        console.log(err)
    }
  };

  const fetchArticles = async () => {
    const token = localStorage.getItem('token');
    const config = {
        headers: {
            Authorization: `Bearer ${token}`,
        },
    };
    try {
        const response = await axios.get(
            `https://scicommons-backend.onrender.com/api/user/${username}/articles/`,
            config
        );
        await loadArticleData(response.data.success);
    } catch (error) {
        console.error(error);
    } 
};

const loadUserData = async(res) => {
  setUser(res)
}

  const fetchUser = async() => {

    const config = {
      headers: {
        "Content-Type": "application/json",
        Authorization: `Bearer ${localStorage.getItem("token")}`,
      },
    };
    try {
      const res = await axios.get(
        `https://scicommons-backend.onrender.com/api/user?search=${username}`,config)
        if(res.data.success.results.length === 0) {
          ToastMaker("User not found", 3000, {
            valign: "top",
            styles: {
              backgroundColor: "red",
              fontSize: "20px",
            },
        });
        navigate('/');
        }
      await loadUserData(res.data.success.results[0]); 
    }
    catch(err){
      console.log(err)
    }
  };

  const onclickFuntion = (indext)=>{
    setcurrentState(indext);
  };

  useEffect(()=> {
    setLoading(true);
    getPosts();
    fetchArticles();
    fetchUser();
    setLoading(false);
  },[])

  const fillFollow = () => {
    if(user.isFollowing){
      return "Unfollow"
    }
    return "Follow";
  }


  return (
    <>
        <NavBar/>
        {!loading && user!==null && <div className="container mx-auto px-4 w-full md:w-1/2">
          <div className="flex items-center mt-8">
              {user.profile_pic_url.includes("None")?<SlUser className="w-12 h-12 text-black-800 mr-4"/>: 
                <img
                src={user.profile_pic_url}
                alt={user.username}
                className="w-24 h-24 rounded-full mr-4"
                />
              }
              <div>
                <div className="flex flex-row items-center">
                  <h2 className="text-xl text-gray-500 font-bold mr-5">{user.username}</h2>
                  {JSON.parse(localStorage.getItem("user")).username !== user.username && <span className={`rounded-lg ${user.isFollowing?"bg-gray-500":"bg-green-500"} text-white px-2 py-1`} style={{cursor:"pointer"}} onClick={handleFollow}>{fillFollow()}</span>}
                </div>
                <p>{user.fullName}</p>
                <p className="text-gray-600">{user.bio}</p>
                <div className="mt-4">
                    <span className="mr-3">
                    <strong>{user.posts}</strong> <span className="text-xs">posts</span>
                    </span>
                    <span className="mr-3">
                    <strong>{user.followers}</strong> <span className="text-xs" style={{cursor:"pointer"}}onClick={()=>setFollowers(true)}>followers</span>
                    </span>
                    <span>
                    <strong>{user.following}</strong> <span className="text-xs" style={{cursor:"pointer"}}onClick={()=>setFollowing(true)}>following</span>
                    </span>
                </div>
              </div>
          </div>
          <div className="flex flex-col w-full md:w-5/6 bg-white mt-[1rem] mx-auto p-2 overflow-hidden">
            <div className="w-full">
              <div className='w-full flex mx-auto mt-4'>
                <button className={currentState === 1 ? 'mb-2 text-sm md:text-xl text-green-600 px-2 font-bold md:px-5 py-2 border-b-2 border-green-600' : 'mb-2 text-sm font-bold md:text-xl px-2 md:px-5 text-gray-600 border-b-2 border-gray-200 py-2'} 
                  style={{cursor:"pointer"}} onClick={()=> onclickFuntion(1)}>
                      Posts
                </button>
                <button className={currentState === 2 ? 'mb-2 text-sm md:text-xl text-green-600 px-2 font-bold md:px-5 py-2 border-b-2 border-green-600' : 'mb-2 text-sm font-bold md:text-xl px-2 md:px-5 text-gray-600 border-b-2 border-gray-200  py-2'} 
                  style={{cursor:"pointer"}} onClick={()=> onclickFuntion(2)}>
                    Articles
                </button>
                <button className={currentState === 3 ? 'mb-2 text-sm md:text-xl text-green-600 px-2 font-bold md:px-5 py-2 border-b-2 border-green-600' : 'mb-2 text-sm font-bold md:text-xl px-2 md:px-5 text-gray-600 border-b-2 border-gray-200  py-2'} 
                  style={{cursor:"pointer"}} onClick={()=> onclickFuntion(3)}>
                    User Info
                </button>
              </div>
            </div>
            <div className="w-full">
              {
                currentState === 1 &&(<div className="container px-4 w-full">
                {loading? <Loader/> : (<>{posts.length > 0 && posts.map((post) => (
                    <Post key={post.id} post={post} onDeletePost={onDeletePost} handleEditChange={handleEditChange} />
                ))}
                {
                  posts.length === 0 && <div className="flex justify-center h-screen">
                    <p className="text-2xl font-semibold">No Posts to show</p>
                  </div>
                }</>)}
                </div>)
              }
              { currentState===2 && (
                  <div className="w-full">
                  { loading ? <Loader /> : (<>{articles.length > 0 ? (
                    articles.map((item) => (
                      <div key={item.id} className="p-5 bg-white rounded-md m-2 shadow-md">
                        <a href={"/article/" + `${item.id}`}>
                          <div>
                            <div className="justify-between sm:flex">
                              <div className="flex-1">
                                <h3 className="text-md md:text-xl font-medium text-green-600">
                                  {item.article_name.replace(/_/g, " ")}
                                </h3>
                                <p className="text-gray-500 mt-2 pr-2">
                                  <span className="text-green-700">Authors : </span>
                                  {item.authors.map((author, index) => (
                                    <span key={index} className="font-bold mr-2">
                                      {author}
                                    </span>
                                  ))}
                                </p>
                                <p className="text-gray-500 mt-2 pr-2">
                                  <span className="text-green-700">Keywords : </span>
                                  {item.keywords.replace(/[\[\]"_\|\|]/g, "")}
                                </p>
                                <p className="text-gray-500 mt-2 pr-2">
                                  <span className="text-green-700">Added On : </span>
                                  {dayjs(item.Public_date).format("MMMM D, YYYY HH:mm A")}
                                </p>
                                <div className="flex flex-row">
                                  <span className="flex items-center text-gray-500 mr-4">
                                    <AiFillEye className="w-4 h-4 mr-2" />
                                    <span className="text-lg font-bold">
                                      {item.views == null ? 0 : formatCount(item.views)}
                                    </span>
                                  </span>
                                  <span className="flex items-center text-gray-500">
                                    <svg
                                      className="text-rose-500 w-4 h-4 mr-2 fill-current"
                                      xmlns="http://www.w3.org/2000/svg"
                                      fill="none"
                                      viewBox="0 0 24 24"
                                      strokeWidth={1.5}
                                      stroke="currentColor"
                                    >
                                      <path
                                        strokeLinecap="round"
                                        strokeLinejoin="round"
                                        d="M21 8.25c0-2.485-2.099-4.5-4.688-4.5-1.935 0-3.597 1.126-4.312 2.733-.715-1.607-2.377-2.733-4.313-2.733C5.1 3.75 3 5.765 3 8.25c0 7.22 9 12 9 12s9-4.78 9-12z"
                                      />
                                    </svg>
                                    <span className="text-lg font-bold">
                                      {item.favourites == null
                                        ? 0
                                        : formatCount(item.favourites)}
                                    </span>
                                  </span>
                                </div>
                              </div>
                            </div>
                            <div className="mt-4 items-center space-y-4 text-sm sm:flex sm:space-x-4 sm:space-y-0">
                              <div className="flex items-center">
                                <div className="flex mr-2">
                                  <svg
                                    xmlns="http://www.w3.org/2000/svg"
                                    viewBox="0 0 24 24"
                                    fill="currentColor"
                                    className={`h-5 w-5 ${
                                      (item.rating == null ? 0 : item.rating) >= 1
                                        ? "text-yellow-500"
                                        : "text-gray-400"
                                    }`}
                                  >
                                    <path d="M12 1l2.753 8.472h8.938l-7.251 5.269 2.753 8.472L12 18.208l-7.193 5.005 2.753-8.472L.309 9.472h8.938z" />
                                  </svg>

                                  <svg
                                    xmlns="http://www.w3.org/2000/svg"
                                    viewBox="0 0 24 24"
                                    fill="currentColor"
                                    className={`h-5 w-5 ${
                                      (item.rating == null ? 0 : item.rating) >= 2
                                        ? "text-yellow-500"
                                        : "text-gray-400"
                                    }`}
                                  >
                                    <path d="M12 1l2.753 8.472h8.938l-7.251 5.269 2.753 8.472L12 18.208l-7.193 5.005 2.753-8.472L.309 9.472h8.938z" />
                                  </svg>
                                  <svg
                                    xmlns="http://www.w3.org/2000/svg"
                                    viewBox="0 0 24 24"
                                    fill="currentColor"
                                    className={`h-5 w-5 ${
                                      (item.rating == null ? 0 : item.rating) >= 3
                                        ? "text-yellow-500"
                                        : "text-gray-400"
                                    }`}
                                  >
                                    <path d="M12 1l2.753 8.472h8.938l-7.251 5.269 2.753 8.472L12 18.208l-7.193 5.005 2.753-8.472L.309 9.472h8.938z" />
                                  </svg>
                                  <svg
                                    xmlns="http://www.w3.org/2000/svg"
                                    viewBox="0 0 24 24"
                                    fill="currentColor"
                                    className={`h-5 w-5 ${
                                      (item.rating == null ? 0 : item.rating) >= 4
                                        ? "text-yellow-500"
                                        : "text-gray-400"
                                    }`}
                                  >
                                    <path d="M12 1l2.753 8.472h8.938l-7.251 5.269 2.753 8.472L12 18.208l-7.193 5.005 2.753-8.472L.309 9.472h8.938z" />
                                  </svg>
                                  <svg
                                    xmlns="http://www.w3.org/2000/svg"
                                    viewBox="0 0 24 24"
                                    fill="currentColor"
                                    className={`h-5 w-5 ${
                                      (item.rating == null ? 0 : item.rating) >= 5
                                        ? "text-yellow-500"
                                        : "text-gray-400"
                                    }`}
                                  >
                                    <path d="M12 1l2.753 8.472h8.938l-7.251 5.269 2.753 8.472L12 18.208l-7.193 5.005 2.753-8.472L.309 9.472h8.938z" />
                                  </svg>
                                  <span className="font-bold ml-3">
                                    {item.rating == null ? 0 : item.rating}/5
                                  </span>
                                </div>
                              </div>
                            </div>
                          </div>
                        </a>
                      </div>
                    ))
                  ) : (
                    <h1 className="text-2xl font-bold text-center w-full text-gray-500">No Articles Found</h1>
                  )}</>)}
                </div>)
              }
              {
                currentState ===  3 && (<div className="container px-4 w-full">
                  <div className="flex flex-col items-start">
                    <div className="flex flex-row items-center">
                      <h1 className="text-lg text-green-600 font-semibold">Email : </h1>
                      <p className="text-md ml-2">{user.email}</p>
                    </div>
                    <div className="flex flex-row items-center">
                      <h1 className="text-lg text-green-600 font-semibold">First Name : </h1>
                      <p className="text-md ml-2">{user.first_name}</p>
                    </div>
                    <div className="flex flex-row items-center">
                      <h1 className="text-lg text-green-600 font-semibold">Last Name : </h1>
                      <p className="text-md ml-2">{user.last_name}</p>
                    </div>
                    <div className="flex flex-row items-center">
                      <h1 className="text-lg text-green-600 font-semibold">Institute :</h1>
                      <p className="text-md ml-2">{user.institute}</p>
                    </div>
                    <div className="flex flex-row items-center">
                      <h1 className="text-lg text-green-600 font-semibold">Google Scholar Link :</h1>
                      <p className="text-md ml-2">{user.google_scholar}</p>
                    </div>
                    <div className="flex flex-row items-center">
                      <h1 className="text-lg text-green-600 font-semibold">Pubmed Link :</h1>
                      <p className="text-md ml-2">{user.pubmed}</p>
                    </div>
                  </div>
                </div>)
              }
            </div>
          </div>
        </div>
      }
      {(loading||user===null || articles===null || posts===null) && <Loader/>}
      {followers && <Followers setFollowersModal={setFollowers}/>}
      {following && <Following setFollowingModal={setFollowing}/>} 
    </>
  );
};

export default Profile;
