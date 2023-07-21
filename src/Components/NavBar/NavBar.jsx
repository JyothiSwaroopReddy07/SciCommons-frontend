import React, { useEffect, useState } from 'react'
import './NavBar.css'
import {SlUser} from 'react-icons/sl';
import {RiNotification3Line} from 'react-icons/ri';
import Popper from "popper.js";
import {useNavigate} from 'react-router-dom';
import {CiMenuFries} from 'react-icons/ci';
import SideNav from '../SideNav/SideNav';

const NavBar = () => {

    const navigate = useNavigate();
    const [state, setState] = useState(false)
    const [Menu, setMenu] = useState(false)
    const [isAuth,setIsAuth] = useState(localStorage.getItem('token')?true:false)
    const [isOpen, setIsOpen] = useState(false);

    const navigation = [
        { title: "Submit Article", path: "/submitarticle" },
        { title: "Communities", path: "/communities" },
        { title: "Articles", path: "/articles" },
        { title: "About", path: "/about" }
    ]

    const User = JSON.parse(localStorage.getItem('user'))

    useEffect(() => {
        document.onclick = (e) => {
            const target = e.target;
            if (!target.closest(".menu-btn")) setState(false);
        };
        setIsAuth(localStorage.getItem('token')?true:false)
    }, [isAuth]);

    const handleLogout = (e) => {
        localStorage.removeItem('token')
        localStorage.removeItem('user')
        localStorage.removeItem('refresh')
        localStorage.removeItem('Menu')
        setIsAuth(false)
        setIsOpen(false)
        navigate('/');
    };

    const handleChange = () => {
      setMenu(!Menu)
    }

    return (
      <>
        <nav className="sticky top-0 bg-green-50 md:text-sm z-50">
            <div className="gap-x-7 items-center px-4 md:flex md:px-8">


                <div className="flex items-center justify-between py-5 md:block">
                  <div className="flex flex-row items-center  justify-between">
                    <button onClick={handleChange}>
                      <CiMenuFries id="menu" className="h-5 w-5 mx-2 active:shadow-none"/>
                    </button>
                    <a href="/">
                        <img
                            src={process.env.PUBLIC_URL + '/logo.png'}
                            width={70}
                            height={30}
                            alt="logo"
                        />
                    </a>
                    </div>
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
                                    <li key={idx} className="text-lg text-green-600 font-semibold hover:text-green-800">
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
                                <a href="/notifications" className="block text-base font-semibold hover:text-green-700">
                                  <RiNotification3Line className="text-gray-700 w-6 h-6" />
                                </a>
                               <Dropdown color="orange" onLogout={handleLogout} User={User.profile_pic_url === null ? null: User.profile_pic_url} />

                            </>
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
        {Menu && <SideNav onMenuChange={handleChange} />}
      </>
    )
};

const Dropdown = ({ color, onLogout,User}) => {
  

    const [dropdownPopoverShow, setDropdownPopoverShow] = React.useState(false);
    const btnDropdownRef = React.createRef();
    const popoverDropdownRef = React.createRef();
    const openDropdownPopover = () => {
      new Popper(btnDropdownRef.current, popoverDropdownRef.current, {
        placement: "bottom-start"
      });
      setDropdownPopoverShow(true);
    };
    const closeDropdownPopover = () => {
      setDropdownPopoverShow(false);
    };

    let bgColor;
    color === "white"
      ? (bgColor = "bg-gray-800")
      : (bgColor = "bg-" + color + "-500");
    

    return (
      <>
        <div className="flex flex-wrap">
          <div className="w-full sm:w-6/12 md:w-4/12 px-4">
            <div className="relative inline-flex align-middle w-full">
              <button
                className={
                  "text-white font-bold uppercase text-sm px-6 rounded outline-none focus:outline-none " +
                  bgColor
                }
                style={{ transition: "all .15s ease" }}
                type="button"
                ref={btnDropdownRef}
                onClick={() => {
                  dropdownPopoverShow
                    ? closeDropdownPopover()
                    : openDropdownPopover();
                }}
              >
                <span className="w-8 h-8 inline-block ml-1">
                  {
                    (User === null) ?
                    (<SlUser className="text-black w-6 h-6 inline-block ml-1" />):
                    (<img className="object-cover w-8 h-8 rounded-full ring ring-gray-300 dark:ring-gray-600" src={User} alt="avatar"/>)
                  }
                </span>
              </button>
              <div
                ref={popoverDropdownRef}
                className={
                  (dropdownPopoverShow ? "block " : "hidden ") +
                  "text-base z-50 float-left py-2 pr-5 list-none text-left rounded shadow-lg mt-1 bg-white"
                }
                style={{ minWidth: "12rem" }}
              >
                <a
                  href="/profile"
                  className={
                    "text-sm py-2 px-4 font-normal block w-full whitespace-no-wrap bg-white text-gray-800 hover:bg-gray-200"
                  }
                >
                  Your Profile
                </a>
                <a
                  href="/activity"
                  className={
                    "text-sm py-2 px-4 font-normal block w-full whitespace-no-wrap bg-white text-gray-800 hover:bg-gray-200"
                  }
                >
                  Your Activity
                </a>
                <a
                  href="/settings"
                  className={
                    "text-sm py-2 px-4 font-normal block w-full whitespace-no-wrap bg-white text-gray-800 hover:bg-gray-200"
                  }
                >
                  Settings
                </a>
                <button
                  className={
                    "text-sm py-2 px-4 font-normal bg-white text-gray-800 hover:bg-gray-200"
                  }
                  onClick={(e)=>{onLogout(e)}}
                >
                  Log Out
                </button>
              </div>
            </div>
          </div>
        </div>
      </>
    );
  };

export default NavBar;