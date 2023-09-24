import axios from 'axios';
import React, { useContext, useEffect, useRef, useState } from 'react'
import { FaBullseye } from 'react-icons/fa';


const AppContext = React.createContext()



const AppProvider = ({ children }) => {

  const [user, setUser] = useState(null)
  const [token, setToken] = useState(localStorage.getItem('token') || null);

  const loadUserData = async (res) => {
    setUser(res);
  }

  const getCurrentUser = async () => {
      try {
          const token = localStorage.getItem('token'); 
    
          const response = await axios.get('https://scicommons-backend.onrender.com/api/user/get_current_user/', {
              headers: {
                  Authorization: `Bearer ${token}`,
              },
          }); 
          const user = response.data.success;
          await loadUserData(user);
      } catch (error) {
        setUser(null);
        setToken(null);
        localStorage.removeItem('token');
        localStorage.removeItem('user');
        console.error(error);
      }
    };

  useEffect(()=> {
    const fetchData = async() => {
      getCurrentUser();
    }
    fetchData();
  },[])


  return (
    <AppContext.Provider value={{
      user, token, setToken, setUser
    }}>
      {children}
    </AppContext.Provider>
  )
}
export const useGlobalContext = () => {
  return useContext(AppContext);
}
export { AppContext, AppProvider }
