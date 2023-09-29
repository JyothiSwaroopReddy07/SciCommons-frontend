import React, {useState, useEffect} from 'react'
import axios from 'axios';
import Post from '../../Components/Post/Post';
import Loader from '../../Components/Loader/Loader';
import NavBar from '../../Components/NavBar/NavBar';
import {AiOutlinePlus, AiOutlineMinus} from 'react-icons/ai';
import Toggle from 'react-toggle';
import 'react-toggle/style.css';
import ReactQuill from 'react-quill';
import 'react-quill/dist/quill.snow.css';
import './MyPostsPage.css';
import ToastMaker from 'toastmaker';
import "toastmaker/dist/toastmaker.css";
import {useGlobalContext} from '../../Context/StateContext';


const MyPostsPage = () => {


    const [loading, setLoading] = useState(true);
    const [isAccordionOpen, setIsAccordionOpen] = useState(false);
    const [posts, setPosts] = useState([]);
    const {token,user} = useGlobalContext();
    const [body, setBody] = useState('');

    const handleBodyChange = (event) => {
        setBody(event);
    }

    const loadData = async(res) => {
        setPosts(res);
    }

    const fetchPosts = async () => {
        setLoading(true);
        const config = {
            headers: {
                Authorization: `Bearer ${token}`,
                'Content-Type': 'application/json',
            }
        };
        try{
            const res = await axios.get(`https://scicommons-backend.onrender.com/api/user/${user.username}/posts/`, config);
            await loadData(res.data.success);
        } catch(err) {
            console.log(err);
        }
        setLoading(false);
    }

    useEffect(() => {
        
        fetchPosts();
        
    },[]);

    const handleSubmit = async(e) => {
        e.preventDefault();
        const form_data = new FormData(e.target);
        form_data.append('body', body);
        const file = form_data.get('image');
        if (file && file.size > 10485760) {
          ToastMaker('File size is too large. Maximum allowed size is 10 MB', 3500,{
            valign: 'top',
              styles : {
                  backgroundColor: 'red',
                  fontSize: '20px',
              }
          })
          e.target.reset()
          return;
        } else {
          console.log('File size is ok')
        }

        const config = {
            headers: {
                "Content-Type": "multipart/form-data",
                Authorization: `Bearer ${token}`,
        
            },
        };
        try{
            const res = await axios.post("https://scicommons-backend.onrender.com/api/feed/", form_data, config);
            await fetchPosts()
            ToastMaker("Post Added Successfully", "success")
            setIsAccordionOpen(false)
            e.target.reset()
        }
        catch(err) {
            console.log(err)
        }
      };
    
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


  return (
    <>
     <NavBar />
     {(loading || posts===null) && <Loader/>}
    { !loading &&
        <> 
        <div className="p-4 w-full md:w-1/2 mx-auto">
            <h1 className="text-3xl font-semibold text-center">My Posts</h1>
        <div className="flex items-center mb-2">
            <Toggle
            checked={isAccordionOpen}
            icons={{
                checked: <AiOutlineMinus className="text-gray-700" />,
                unchecked: <AiOutlinePlus className="text-gray-700" />,
            }}
            onChange={() => setIsAccordionOpen(!isAccordionOpen)}
            />
            <span className="ml-2 text-xl font-semibold text-center float-right">Add Post</span>
        </div>
        {isAccordionOpen && (
            <div className="p-4 bg-slate-100 rounded-md shadow-md">
            <form onSubmit={(e)=>handleSubmit(e)} encType="multipart/form-data">
                <ReactQuill theme="snow" className="bg-white w-full p-2 mb-4 resize-none border rounded" value={body} onChange={handleBodyChange}/>
                <div className="flex justify-between items-center">
                    <input
                    type="file"
                    accept="image/*"
                    className="mb-4 rounded-xl"
                    name="image"
                    />
                    <button
                    type="submit"
                    className="bg-green-500 hover:bg-green-700 text-white h-8 px-2 rounded"
                    >
                    Post
                    </button>
                </div>
            </form>
            </div>
        )}
        </div>
        <div className="container mx-auto px-4 w-full md:w-1/2">
          {
            posts.length > 0 && posts.map((post) => (
                <Post key={post.id} post={post} onDeletePost={onDeletePost} handleEditChange={handleEditChange} />
            ))
          }
          {
            posts.length === 0 && <div className="flex justify-center h-screen">
              <p className="text-2xl font-semibold">No Posts to show</p>
            </div>
          }

        </div>
        </>
        }
    </>
  )
}

export default MyPostsPage