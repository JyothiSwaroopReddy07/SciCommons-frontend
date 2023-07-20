import React, {useState, useRef, Fragment} from 'react'
import './Login.css'
import axios from 'axios'
import { useNavigate } from 'react-router-dom';
import Loader from '../../Components/Loader/Loader';
import ToastMaker from 'toastmaker';
import "toastmaker/dist/toastmaker.css";
import { useGlobalContext} from '../../Context/StateContext';


const Login = () => {
    const navigate = useNavigate()
    const [isPasswordHidden, setPasswordHidden] = useState(false)
    const username = useRef(null)
    const password = useRef(null)
    const [loading, setLoading] = useState(false)
    const {User} = useGlobalContext();
    const getCurrentUser = async () => {
        try {
            const token = localStorage.getItem('token'); 
      
            const response = await axios.get('https://scicommons-backend.onrender.com/api/user/get_current_user/', {
                headers: {
                    Authorization: `Bearer ${token}`,
                },
            }); 
            const user = response.data.success;
            console.log(user)
            User.current = user;
            localStorage.setItem('user', JSON.stringify(user));
        } catch (error) {
          console.error(error);
        }
    };

    const handleSubmit = async(e) => {
        e.preventDefault()
        setLoading(true); // Show the loader while the login request is in
        const data = {
            username: username.current.value,
            password: password.current.value,
        };

        try {
            const response = await axios.post(
              'https://scicommons-backend.onrender.com/api/user/login/',
              data,
              {
                headers: {
                  'Content-Type': 'application/json',
                },
              }
            );
        
            // Save the token to local storage

            localStorage.setItem('token', response.data.success.access);
            await getCurrentUser();
            
            // Perform any additional actions after successful login, e.g., navigate to the home page
            navigate('/');
          } catch (error) {
            // Handle login error
            console.error(error);
            try{
                ToastMaker(error.response.data.non_field_errors[0], 3500,{
                    valign: 'top',
                      styles : {
                          backgroundColor: 'red',
                          fontSize: '20px',
                      }
                  })
            } catch (error) {
                ToastMaker("Something went wrong. Please try again later!!!", 3500,{
                    valign: 'top',
                      styles : {
                          backgroundColor: 'red',
                          fontSize: '20px',
                      }
                  })
            }
          } finally {
            setLoading(false); // Hide the loader after the login request completes, whether it succeeded or failed
        }
    }
  return (
    <>
      {loading && <Loader />}
      {!loading && (
            <main className="w-full h-screen flex flex-col items-center bg-green-50 justify-center px-4">
                <div className="max-w-sm w-full text-gray-600">
                    <div className="text-center" onClick={(e)=>{e.preventDefault();navigate("/")}}>
                        <img src={process.env.PUBLIC_URL + '/logo.png'} width={150} className="mx-auto" alt="logo" />
                    </div>
                    <br/>
                    <div className="bg-white shadow p-4 py-6 sm:p-6 sm:rounded-lg">
                        <form>
                            <div className="max-w-md mx-auto">
                                <label htmlFor="username" className="block py-2 text-gray-500">
                                    Username
                                </label>
                                <div className="flex items-center text-gray-700 border rounded-md">
                                    <div className="px-3 py-2.5 rounded-l-md bg-gray-50 border-r">
                                        @
                                    </div>
                                    <input 
                                        type="text"
                                        placeholder="Suresh Krishna"
                                        id="username"
                                        ref={username}
                                        className="w-full p-2.5 ml-2 bg-transparent outline-none"
                                    />
                                </div>
                            </div>
                            <div>
                                <label className="text-gray-600">
                                    Password
                                </label>
                                <div className="relative max-w-screen mt-2">
                                    <button className="text-gray-700 absolute right-3 inset-y-0 my-auto active:text-gray-600"
                                        onClick={(e) => {e.preventDefault(); setPasswordHidden(!isPasswordHidden);}}
                                    >
                                        {
                                            isPasswordHidden ? (
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
                                        type={!isPasswordHidden ? "password" : "text"}
                                        id="password"
                                        ref={password}
                                        className="w-full pr-12 pl-3 py-2 text-gray-700 bg-transparent outline-none border focus:border-green-600 shadow-sm rounded-lg"
                                    />
                                </div>
                            </div >
                            <div className="text-right">
                                <a href="/forgotpassword" className="hover:text-green-600">Forgot password?</a>
                            </div>
                            <br/>
                            
                            <button
                                className="w-full px-4 py-2 text-white font-medium bg-green-600 hover:bg-green-500 active:bg-green-600 rounded-lg duration-150"
                                onClick={handleSubmit}
                            >
                                Sign in
                            </button>
                            <br/>
                            <hr className="my-6 border-gray-200 w-full" />
                            <p className="text-center">Don't have an account? <a href="/register" className="font-medium text-green-600 hover:text-green-500">Register</a></p>
                    
                        </form>
                    </div>
                </div>
            </main>
        )}
    </>
  )
}

export default Login
