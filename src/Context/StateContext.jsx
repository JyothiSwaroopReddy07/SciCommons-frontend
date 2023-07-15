import axios from 'axios';
import React, { useContext, useEffect, useState } from 'react'


const AppContext = React.createContext()



const AppProvider = ({ children }) => {

  const [User, setUser] = useState(localStorage.getItem("User") || null);
  const [Menu, setMenu] = useState(localStorage.getItem("Menu") ||false);


  return (
    <AppContext.Provider value={{
      User, setUser,
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
