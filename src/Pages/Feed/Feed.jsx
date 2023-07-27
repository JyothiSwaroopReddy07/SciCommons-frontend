import React, {useEffect} from 'react'
import NavBar from '../../Components/NavBar/NavBar'
import { AiOutlineArrowUp } from "react-icons/ai";
import Loader from "../../Components/Loader/Loader";

const Feed = () => {

    const [posts, setPosts] = useState([])

    const loadData =  async(res) => {
        setPosts(res)
    }
        
    useEffect(()=>{
        const getPosts = async () => {
            const token = localStorage.getItem('token');
            try {
                const response = await axios.get("https://scicommons-backend.onrender.com/api/feed/", {
                    headers: {
                        Authorization: `Bearer ${token}`,
                    },
                });
                console.log(response.data);
                await loadData(response.data.success)
            } catch (error) {
                console.log(error.response.data)
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
        }
        getPosts();
    },[])


  return (
    <div>
            <NavBar />
            {/* <div className="flex justify-center px-5 sm:px-32 md:mt-4">
                <div className="flex h-screen w-screen">

                    <AsideLeft />

                    <main className="md:mx-4 w-full sm:basis-2/3">

                        <header className="m-4 hidden sm:flex">
                            <h1 className="text-xl">Explore</h1>
                        </header>

                        {isLoading ? (
                            <div className="z-20">
                                <Loader show={isLoading} />
                            </div>
                        ) : (
                            posts.map(post => <Post key={post._id} post={post} />)
                        )}

                    </main>

                    <a href="#">
                        <AiOutlineArrowUp className="hidden sm:block fixed bottom-0 right-20 bg-blue-300 text-slate-50 text-5xl p-3 rounded-full mb-2 mr-20 hover:bg-blue-500" />
                    </a>
                </div>
            </div> */}
        </div>
  )
}

export default Feed