import React, { useEffect, useState } from 'react';
import { Modal } from 'react-responsive-modal';
import { BsFillImageFill } from "react-icons/bs";
import ToastMaker from 'toastmaker';
import "toastmaker/dist/toastmaker.css";
import {useGlobalContext} from '../../Context/StateContext';
import axios from "axios";

const CreatePostModal = () => {


    const [loading, setLoading] = useState(false);
    const [open, setOpen] = useState(false);
    const {User} = useGlobalContext()

    const onOpenModal = () => setOpen(true);
    const onCloseModal = () => setOpen(false);


    const postHandler = async (e) => {
        e.preventDefault();
        setLoading(true);
        const form_data = new FormData(e.target);
        const token = localStorage.getItem('token');
        setLoading(true);
        try {
            const response = await axios.post("https://scicommons-backend.onrender.com/api/feed/", form_data, {
                headers: {
                    "Content-Type": "multipart/form-data",
                    Authorization: `Bearer ${token}`,
                },
            });
            console.log(response.data);
            ToastMaker(response.data.success, 3500,{
                valign: 'top',
                  styles : {
                      backgroundColor: 'green',
                      fontSize: '20px',
                  }
              })
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
        setLoading(false);
    }

    return (
        <>
        <div className="flex justify-end">
                <button
                    className="text-lg font-semibold"
                    onClick={onOpenModal}>
                    Add Post
                </button>
        </div>
        <Modal
            styles={{
                modal: { width: "20rem", height: "fit-content", paddingTop: "0.2rem", borderRadius: "1rem", margin: "0 auto" },
                overlay: { backgroundColor: "rgba(0,0,0,0.1)" },
            }}
            open={open}
            onClose={onCloseModal}
            showCloseIcon={false}
            center={true}
        >

            <div className="flex py-3">

                <div className="mt-3 w-12 h-12 text-lg flex-none">
                    <img src={User?.profile_picture === null ? '/': User.profile_picture} className="flex-none w-12 h-12 rounded-full" alt="avatar" />
                </div>

                <div className="w-full px-2">
                    <form className="w-full px-4 py-3" onSubmit={postHandler} encType="multipart/form-data">
                        <textarea
                            name="body"
                            placeholder="What's happening?"
                            className="resize-none mt-3 pb-3 w-full h-28 bg-slate-100 focus:outline-none rounded-xl p-2">
                        </textarea>

                        <div className="flex justify-between">
                            <label className="flex m-2">
                            <BsFillImageFill className="text-2xl mt-1 text-blue-700 cursor-pointer" />
                                <input
                                    className="hidden"
                                    type="file"
                                    accept="image/*"
                                    name="image"
                                />
                            </label>
                            <button
                                type="submit"
                                className="disabled:cursor-not-allowed p-2.5 pt-3 bg-blue-600 hover:bg-blue-800 text-white rounded-xl shadow-md 
                                hover:shadow-lg transition duration-150 ease-in-out">
                                {loading?"Posting..." : "Post"}
                            </button>
                        </div>
                    </form>
                </div>
            </div>
        </Modal>
        </>
    )
};

export default CreatePostModal;