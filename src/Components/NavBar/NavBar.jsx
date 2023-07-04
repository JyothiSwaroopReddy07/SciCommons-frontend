import React, { useEffect, useState } from 'react'
import './NavBar.css'

export default () => {

    const [state, setState] = useState(false)
    const [isAuth,setIsAuth] = useState(localStorage.getItem('token')?true:false)
    const [isOpen, setIsOpen] = useState(false);

    const navigation = [
        { title: "Submit Article", path: "/submitarticle" },
        { title: "Communities", path: "/communities" },
        { title: "Articles", path: "/articles" },
        { title: "About", path: "/about" }
    ]

    useEffect(() => {
        document.onclick = (e) => {
            const target = e.target;
            if (!target.closest(".menu-btn")) setState(false);
        };
    }, [])

    const handleLogout = (e) => {
        localStorage.removeItem('token')
        setIsAuth(false)
        setIsOpen(false)

    };

    return (
        <nav className="sticky top-0 bg-green-50 md:text-sm z-50">
            <div className="gap-x-7 items-center px-4 md:flex md:px-8">
                <div className="flex items-center justify-between py-5 md:block">
                    <a href="/">
                        <img
                            src={process.env.PUBLIC_URL + '/logo.png'}
                            width={70}
                            height={30}
                            alt="logo"
                        />
                    </a>
                    <div className="md:hidden">
                        <button className="menu-btn text-gray-500 hover:text-gray-800"
                            onClick={() => setState(!state)}
                        >
                            {
                                state ? (
                                    <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6" viewBox="0 0 20 20" fill="currentColor">
                                        <path fillRule="evenodd" d="M4.293 4.293a1 1 0 011.414 0L10 8.586l4.293-4.293a1 1 0 111.414 1.414L11.414 10l4.293 4.293a1 1 0 01-1.414 1.414L10 11.414l-4.293 4.293a1 1 0 01-1.414-1.414L8.586 10 4.293 5.707a1 1 0 010-1.414z" clipRule="evenodd" />
                                    </svg>
                                ) : (
                                    <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor" className="w-6 h-6">
                                        <path strokeLinecap="round" strokeLinejoin="round" d="M3.75 6.75h16.5M3.75 12h16.5m-16.5 5.25h16.5" />
                                    </svg>
                                )
                            }
                        </button>
                    </div>
                </div>
                <div className={`flex-1 items-center mt-8 md:mt-0 md:flex ${state ? 'block' : 'hidden'} `}>
                    <ul className="justify-center items-center space-y-6 md:flex md:space-x-6 md:space-y-0">
                        {
                            navigation.map((item, idx) => {
                                return (
                                    <li key={idx} className="text-lg text-green-500 font-semibold hover:text-green-800">
                                        <a href={item.path} className="block">
                                            {item.title}
                                        </a>
                                    </li>
                                )
                            })
                        }
                    </ul>
                    <div className="profile flex-1 gap-x-6 items-center justify-end mt-6 space-y-6 md:flex md:space-y-0 md:mt-0">
                        {isAuth && (
                            <>
                                <a href="/MyActivity" className="block text-base text-green-500 font-semibold hover:text-green-700">
                                    MyActivity
                                </a>
                                <a href="/notifications" className="block text-base text-green-500 font-semibold hover:text-green-700">
                                    Notifications
                                </a>
                                <div className="profile-icon" onClick={(e) => {e.preventDefault();setIsOpen(!isOpen)}}> 
                                    <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor" className="w-6 h-6">
                                        <path strokeLinecap="round" strokeLinejoin="round" d="M15.75 6a3.75 3.75 0 11-7.5 0 3.75 3.75 0 017.5 0zM4.501 20.118a7.5 7.5 0 0114.998 0A17.933 17.933 0 0112 21.75c-2.676 0-5.216-.584-7.499-1.632z" />
                                    </svg>
                                </div>
                            </>
                        )}
                        {isOpen && (
                            <div className="profile-dropdown">
                                <div className="profile-dropdown-item">
                                    <a href="/profile" className="block text-base text-green-400 hover:text-green-700">
                                        Profile
                                    </a>
                                </div>
                                <div className="profile-dropdown-item">
                                    <a href="/settings" className="block text-base text-green-400 hover:text-green-700">
                                        Settings
                                    </a>
                                </div>
                                <div className="profile-dropdown-item">
                                    <a href="/" onClick={handleLogout} className="block text-base text-green-400 hover:text-green-700">
                                        Log out
                                    </a>
                                </div>
                            </div>
                        )}
                        {!isAuth && (
                            <>
                            <a href="/login" className="block text-base text-green-500 font-semibold hover:text-green-700">
                                Log in
                            </a>
                            <a href="/register" className="flex items-center bottom-2 justify-center gap-x-1 py-2 px-4 text-white font-medium bg-green-600 hover:bg-green-700 active:bg-green-900 rounded-full md:inline-flex">
                                Register
                                <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 20 20" fill="currentColor" className="w-5 h-5">
                                    <path fillRule="evenodd" d="M7.21 14.77a.75.75 0 01.02-1.06L11.168 10 7.23 6.29a.75.75 0 111.04-1.08l4.5 4.25a.75.75 0 010 1.08l-4.5 4.25a.75.75 0 01-1.06-.02z" clipRule="evenodd" />
                                </svg>
                            </a>
                            </>
                        )}
                    </div>
                </div>
            </div>
        </nav>
    )
}