import axios from 'axios';
import React, { useContext, useEffect, useRef, useState } from 'react'


const AppContext = React.createContext()



const AppProvider = ({ children }) => {

  const User = useRef(localStorage.getItem("User") || null);
  const [Menu, setMenu] = useState(localStorage.getItem("Menu") ||false);


  return (
    <AppContext.Provider value={{
      User,
      Menu, setMenu,
    }}>
      {children}
    </AppContext.Provider>
  )
}
export const useGlobalContext = () => {
  return useContext(AppContext);
}
export { AppContext, AppProvider }
