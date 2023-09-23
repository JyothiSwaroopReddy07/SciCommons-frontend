import React,{useState,useEffect} from 'react'
import axios from 'axios'
import ToastMaker from "toastmaker";
import "toastmaker/dist/toastmaker.css";
import {useNavigate} from 'react-router-dom'
import Loader from '../../Components/Loader/Loader';

const ForgotPassword = () => {

    const [email,setEmail] = useState('')
    const [otp,setOtp] = useState('')
    const [password1,setPassword1] = useState('')
    const [password2,setPassword2] = useState('')
    const [loading, setLaoding] = useState(false);
    const [isPasswordHidden1, setPasswordHidden1] = useState(false)
    const [isPasswordHidden2, setPasswordHidden2] = useState(false)

    const navigate = useNavigate()

    useEffect(()=> {
        if(localStorage.getItem('token')){ 
            navigate('/')
        }
    },[])

    const handleSubmit = async (e) => {
        e.preventDefault();
        setLaoding(true);
        try {
            const response = await axios.post(
                `https://scicommons-backend.onrender.com/api/user/forgot_password/`,
                {email:email}
            );
            ToastMaker("Otp sent to email!!", 3000, {
                valign: "top",
                styles: {
                  backgroundColor: "green",
                  fontSize: "20px",
                },
              });
        } catch (error) {
            ToastMaker(error.response.data.error, 3000, {
                valign: "top",
                styles: {
                  backgroundColor: "red",
                  fontSize: "20px",
                },
            });
            console.error(error);
        }
        setLaoding(false);
    }

    const handleChange = async (e) => {
        e.preventDefault();
        setLaoding(true);
        try {
            const response = await axios.post(
                `https://scicommons-backend.onrender.com/api/user/reset_password/`,
                {email:email,otp:otp,password:password1,password2:password2}
            );
            console.log(response.data)
            ToastMaker("Password Changed Successfully!!!", 3000, {
                valign: "top",
                styles: {
                  backgroundColor: "green",
                  fontSize: "20px",
                },
            });
            navigate('/login');
        } catch (error) {
            ToastMaker(error.response.data.error, 3000, {
                valign: "top",
                styles: {
                  backgroundColor: "red",
                  fontSize: "20px",
                },
            });
            console.error(error);
        }
        setLaoding(false);
    }

    return (
        <>
            {!loading && (
            <div className="w-full h-screen flex flex-col items-center justify-center bg-green-50">
                <div className="text-center" style={{cursor:"pointer"}} onClick={(e)=>{e.preventDefault();navigate("/")}}>
                        <img src={process.env.PUBLIC_URL + '/logo.png'} width={150} className="mx-auto" alt="logo" />
                </div>
                <br/>
                <div className="w-full md:w-1/2 flex flex-col p-3 shadow-2xl rounded-lg justify-center bg-white">
                <h1 className="text-3xl font-bold text-gray-600 m-5 text-center">Forgot Password</h1>
                <div className="w-full mx-auto">
                    <div className="flex items-center text-gray-700 border rounded-md m-2">
                                    <div className="px-3 py-2.5 rounded-l-md bg-gray-50 border-r">
                                        @
                                    </div>
                                    <input 
                                        type="email"
                                        placeholder="Enter the email"
                                        value={email}
                                        onChange={(e)=>{setEmail(e.target.value)}}
                                        className="w-full bg-transparent outline-none rounded-lg"
                                    />
                    </div>
                    <div className="m-2">
                        <button className="w-full px-4 py-2 text-white font-medium bg-green-600 hover:bg-green-500 active:bg-green-600 rounded-lg duration-150"
                                style={{cursor:"pointer"}} onClick={handleSubmit}>Send OTP</button>
                    </div>
                </div>
                <div className="w-full mx-auto m-4">
                    <h1 className="text-3xl font-bold text-gray-600 m-5 text-center">Reset Password</h1>
                    <div className="relative max-w-screen m-2">
                        <input type="text" className="w-full bg-transparent outline-none rounded-lg" placeholder="Enter OTP" value={otp} onChange={(e)=>{setOtp(e.target.value)}} />
                    </div>
                    <div className="relative max-w-screen m-2">
                                    <button className="text-gray-700 absolute right-3 inset-y-0 my-auto active:text-gray-600"
                                       style={{cursor:"pointer"}}   onClick={(e) => {e.preventDefault(); setPasswordHidden1(!isPasswordHidden1);}}
                                    >
                                        {
                                            isPasswordHidden1 ? (
                                                <svg className="w-6 h-6" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor">
                                                    <path strokeLinecap="round" strokeLinejoin="round" d="M2.036 12.322a1.012 1.012 0 010-.639C3.423 7.51 7.36 4.5 12 4.5c4.638 0 8.573 3.007 9.963 7.178.07.207.07.431 0 .639C20.577 16.49 16.64 19.5 12 19.5c-4.638 0-8.573-3.007-9.963-7.178z" />
                                                    <path strokeLinecap="round" strokeLinejoin="round" d="M15 12a3 3 0 11-6 0 3 3 0 016 0z" />
                                                </svg>
                                            ) : (
                                                <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor" className="w-6 h-6">
                                                    <path strokeLinecap="round" strokeLinejoin="round" d="M3.98 8.223A10.477 10.477 0 001.934 12C3.226 16.338 7.244 19.5 12 19.5c.993 0 1.953-.138 2.863-.395M6.228 6.228A10.45 10.45 0 0112 4.5c4.756 0 8.773 3.162 10.065 7.498a10.523 10.523 0 01-4.293 5.774M6.228 6.228L3 3m3.228 3.228l3.65 3.65m7.894 7.894L21 21m-3.228-3.228l-3.65-3.65m0 0a3 3 0 10-4.243-4.243m4.242 4.242L9.88 9.88" />
                                                </svg>

                                            )
                                        }
                                    </button>
                                    <input
                                        type={!isPasswordHidden1 ? "password" : "text"}
                                        id="password"
                                        placeholder="enter the password"
                                        value={password1}
                                        onChange={(e)=>{setPassword1(e.target.value)}}
                                        className="w-full pr-12 pl-3 py-2 text-gray-700 bg-transparent outline-none border focus:border-green-600 shadow-sm rounded-lg"
                                    />
                    </div>
                    <div className="relative max-w-screen m-2">
                                    <button className="text-gray-700 absolute right-3 inset-y-0 my-auto active:text-gray-600"
                                       style={{cursor:"pointer"}}   onClick={(e) => {e.preventDefault(); setPasswordHidden2(!isPasswordHidden2);}}
                                    >
                                        {
                                            isPasswordHidden2 ? (
                                                <svg className="w-6 h-6" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor">
                                                    <path strokeLinecap="round" strokeLinejoin="round" d="M2.036 12.322a1.012 1.012 0 010-.639C3.423 7.51 7.36 4.5 12 4.5c4.638 0 8.573 3.007 9.963 7.178.07.207.07.431 0 .639C20.577 16.49 16.64 19.5 12 19.5c-4.638 0-8.573-3.007-9.963-7.178z" />
                                                    <path strokeLinecap="round" strokeLinejoin="round" d="M15 12a3 3 0 11-6 0 3 3 0 016 0z" />
                                                </svg>
                                            ) : (
                                                <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor" className="w-6 h-6">
                                                    <path strokeLinecap="round" strokeLinejoin="round" d="M3.98 8.223A10.477 10.477 0 001.934 12C3.226 16.338 7.244 19.5 12 19.5c.993 0 1.953-.138 2.863-.395M6.228 6.228A10.45 10.45 0 0112 4.5c4.756 0 8.773 3.162 10.065 7.498a10.523 10.523 0 01-4.293 5.774M6.228 6.228L3 3m3.228 3.228l3.65 3.65m7.894 7.894L21 21m-3.228-3.228l-3.65-3.65m0 0a3 3 0 10-4.243-4.243m4.242 4.242L9.88 9.88" />
                                                </svg>

                                            )
                                        }
                                    </button>
                                    <input
                                        type={!isPasswordHidden2 ? "password" : "text"}
                                        id="password"
                                        placeholder="Confirm new password"
                                        value={password2}
                                        onChange={(e)=>{setPassword2(e.target.value)}}
                                        className="w-full pr-12 pl-3 py-2 text-gray-700 bg-transparent outline-none border focus:border-green-600 shadow-sm rounded-lg"
                                    />
                    </div>
                    <div className="m-2">
                        <button className="w-full px-4 py-2 text-white font-medium bg-green-600 hover:bg-green-500 active:bg-green-600 rounded-lg duration-150"
                                style={{cursor:"pointer"}} onClick={handleChange}>Submit</button>
                    </div>
                </div>
                </div>
            </div>)}
            {loading && <Loader/>}
        </>
    )
}

export default ForgotPassword;
