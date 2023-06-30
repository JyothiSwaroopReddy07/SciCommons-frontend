import React from 'react'
import { Bars } from 'react-loader-spinner'

const Loader = () => {
  return (
    <div className="w-full h-screen flex flex-col items-center bg-gray-700 justify-center px-4">
        <Bars
        height="80"
        width="80"
        color="#fcd34d"
        ariaLabel="bars-loading"
        wrapperStyle={{}}
        wrapperClass=""
        visible={true}
        />
    </div>
  )
}

export default Loader