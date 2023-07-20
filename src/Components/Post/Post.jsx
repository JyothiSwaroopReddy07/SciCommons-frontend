import { useState } from "react";
import { HiDotsHorizontal } from "react-icons/hi";
import { GoComment } from "react-icons/go";
import { BsSuitHeart, BsSuitHeartFill } from "react-icons/bs";
import { MdOutlineBookmarkBorder, MdOutlineBookmark } from "react-icons/md";
import  CreatePostModal  from "../CreatePostModal/CreatePostModal";
import { useLocation, useNavigate } from "react-router-dom";

const Post = ({ post }) => {
    const {pathname} = useLocation();

    const [currentUser,setCurrentUser] = useState(JSON.parse(localStorage.getItem('user')));
    const [postOptions, setPostOptions] = useState(false);
    const [isLiked, setIsLiked] = useState(false);
    const [isBookmarked, setIsBookmarked] = useState(false);
    const [authUser, setAuthUser] = useState(JSON.parse(localStorage.getItem('user')));
    const [userData, setUserData] = useState(JSON.parse(localStorage.getItem('user')));
    const [editHandler, setEditHandler] = useState(false);
    const [deletePostHandler, setDeletePostHandler] = useState(false);
    const [followHandler, setFollowHandler] = useState(false);
    const [unFollowHandler, setUnFollowHandler] = useState(false);
    const [getFormattedDate, setGetFormattedDate] = useState(false);
    const navigate = useNavigate();


    return (
        <div
            className="flex border ml-0 sm:mr-0 sm:mx-3 pl-2 pr-1 sm:pr-0 sm:px-5 py-3 hover:bg-slate-100"
        >

            <CreatePostModal />

            <div className="mt-3 w-12 h-12 text-lg flex-none">
                <img
                    onClick={() => navigate(`/profile/${currentUser?.username}`)}
                    src={currentUser?.profilePicture}
                    className="flex-none w-12 h-12 rounded-full cursor-pointer"
                    alt={currentUser?.username}
                />
            </div>

            <div className="w-full px-4 py-3">

                <div className="w-full flex justify-between relative">
                    <h2
                        onClick={() => navigate(`/profile/${currentUser?.username}`)}
                        className="font-semibold cursor-pointer">
                        {`${currentUser?.firstName} ${currentUser?.lastName}`}
                        <span className="text-slate-500 font-normal pl-1.5">
                            @{post?.username}
                        </span>
                    </h2>

                    <HiDotsHorizontal className="cursor-pointer mr-3" onClick={() => setPostOptions(prev => !prev)} />

                    {/* Post Options Modal */}

                    {post?.username === userData?.username ? (
                        postOptions &&
                        <div
                            className="w-30 h-22 px-1 shadow-xl bg-white border border-slate-300 text-slate-600 font-semibold 
                                absolute right-7 top-0 z-20 rounded-xl">
                            <ul className="p-0.5 cursor-pointer text-start">
                                <li className="my-1 p-1 hover:bg-slate-200 rounded" onClick={editHandler}>Edit Post</li>
                                <li className="my-1 p-1 hover:bg-slate-200 rounded" onClick={deletePostHandler}>Delete Post</li>
                            </ul>
                        </div>

                    ) : authUser?.following.find(eachUser => eachUser?.username === post?.username) ? (
                        postOptions &&
                        <div className="w-30 h-22 px-1 shadow-xl bg-white border border-slate-300 text-slate-600 font-semibold 
                        absolute right-8 top-0 z-20 rounded-xl">
                            <ul className="p-0.5 cursor-pointer text-start">
                                <li className="my-1 p-1 hover:bg-slate-200 rounded" onClick={unFollowHandler}>Unfollow</li>
                            </ul>
                        </div>
                    ) : (postOptions &&
                        <div className="w-30 h-22 px-1 shadow-xl bg-white border border-slate-300 text-slate-600 font-semibold 
                        absolute right-8 top-0 z-20 rounded-xl">
                            <ul className="p-0.5 cursor-pointer text-start">
                                <li className="my-1 p-1 hover:bg-slate-200 rounded" onClick={followHandler}>Follow</li>
                            </ul>
                        </div>
                    )}

                </div>

                <p
                    className="py-3 cursor-pointer max-w-lg break-words"
                    onClick={() => navigate(`/post/${post.id}`)}>
                    {post?.content}
                </p>

                {post?.postImageUrl ? (<div 
                    className="max-w-3xl max-h-80 mx-auto bg-blue-100 rounded-md cursor-pointer"
                    onClick={() => navigate(`/post/${post.id}`)}>
                    <img
                        src={post?.postImageUrl}
                        className="max-w-full max-h-80 rounded-md my-2 mx-auto"
                        alt="avatar"
                    />
                </div>) : null}

                <p className="text-sm text-gray-600">{getFormattedDate(post?.createdAt)}</p>

                <div className="flex justify-between pt-8">
                    <div className="flex">
                        {isLiked ? (
                            <BsSuitHeartFill className="text-xl cursor-pointer text-red-600" onClick={e => {
                                console.log(e)
                            }} />
                        ) : (
                            <BsSuitHeart className="text-xl cursor-pointer" onClick={e => {
                               console.log(e)
                            }} />
                        )}
                        <span className="text-sm pl-4 font-semibold">
                            {pathname.includes("post") ? "" : post?.likes?.likeCount ? post?.likes?.likeCount : null}
                        </span>
                    </div>

                    <div className="flex">
                        <GoComment onClick={() => navigate(`/post/${post.id}`)} className="text-xl cursor-pointer" />
                        <span className="text-sm pl-4 font-semibold">
                            {pathname.includes("post") ? "" : post?.comments?.length > 0 ? post?.comments?.length : ""}
                        </span>
                    </div>


                    {isBookmarked ? (
                        <MdOutlineBookmark className="text-xl cursor-pointer mr-3 text-blue-600" onClick={e => {
                            console.log('swaroop')
                        }} />
                    ) : (

                        <MdOutlineBookmarkBorder className="text-xl cursor-pointer mr-3" onClick={e => {
                            console.log('swaroop')
                        }} />
                    )}

                </div>
            </div>
        </div>
    )
};

export default Post;