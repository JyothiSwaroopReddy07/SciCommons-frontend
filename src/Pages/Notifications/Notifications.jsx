import React, { useState, useEffect } from 'react';
import dayjs from 'dayjs';
import NavBar from '../../Components/NavBar/NavBar';
import './Notifications.css';
import axios from 'axios';
import Loader from "../../Components/Loader/Loader";
import ToastMaker from "toastmaker";
import "toastmaker/dist/toastmaker.css";


const NotificationCard = ({ notification, handleMarked }) => {
  console.log(notification);
    const { date, id, link, message } = notification;
    const formattedDate = dayjs(notification.date).format('MMMM D, YYYY HH:mm A');
    const [isread, setIsRead] = useState(notification.is_read);
    const [loading, setLoading] = useState(false);
  
    const handleSeen = async() => {
      setLoading(true);
      const config = {
        headers: {
          Authorization: `Bearer ${localStorage.getItem('token')}`,
        },
      }
      try{
        const response = axios.put(`https://scicommons-backend.onrender.com/api/notification/${notification.id}/`,{is_read:true},config);
        setIsRead(true);
        await handleMarked(notification.id);
      } catch(err) {
        console.log(err);
      }
      setLoading(false);
    }

    const fillMark = () => {
      if(isread===true){
        return "done";
      }
      return "Mark as read";
    }

    return (
      <div 
        className={`flex items-center justify-between p-4 bg-white shadow-md rounded-lg ${isread?'bg-white':'bg-slate-300'}`}
      >
        <div className="flex items-center space-x-4">
          <div>
            <h3 className="font-medium text-sm md:text-lg">{notification.message}</h3>
            <p className="text-gray-500 text-sm md:text-md">{formattedDate}</p>
          </div>
        </div>
        <a
          href={link}
          className="text-blue-500 hover:text-blue-700 transition-colors text-xs duration-300"
        >
          View
        </a>
        <button onClick={handleSeen} className={`${isread?'text-gray-400':'text-blue-400'} text-xs`}>
          {loading?"marking...":fillMark()}
        </button>
      </div>
  );
};



const Notifications = () => {
    const [notifications, setNotifications] = useState([]);
    const [loading, setLoading] = useState(false);
    const [loadingmore, setLoadingMore] = useState(false);

    const fetchNotifications = async () => {
      setLoading(true);
      const response = await axios.get('https://scicommons-backend.onrender.com/api/notification/', {
        headers: { Authorization: `Bearer ${localStorage.getItem('token')}` },
      });
      const data = response.data.success;
      setNotifications(data.results);
      setLoading(false);
    };

    useEffect(() => {
      if (!localStorage.getItem('token')) {
        window.location.href = '/login';
      }
      fetchNotifications();
    }, []);
    
    const loadMore = async(res) => {
      const newNotifications = [...notifications,...res]
      setNotifications(newNotifications);
    }

    const handleLoadMore = async() => {
      setLoadingMore(true);
      try{
        const response = await axios.get(`https://scicommons-backend.onrender.com/api/notification/?limit=20&offset=${notifications.length}`, {
            headers: { Authorization: `Bearer ${localStorage.getItem('token')}` },
        });
        const data = response.data.success.results;
        if(response.data.success.count === notifications.length) {
          ToastMaker("No more notifications to load", 3000, {
            valign: "top",
            styles: {
              backgroundColor: "red",
              fontSize: "20px",
            },
          });
        }
        await loadMore(data);
      } catch(err) {
        console.log(err);
      }
      setLoadingMore(false);
    }

    const handleMarked = async (index) => {
      const newNotifications = [...notifications];
      const notificationIndex = newNotifications.findIndex(notification => notification.id === index);
      if (notificationIndex !== -1) {
        newNotifications[notificationIndex].marked = true;
        setNotifications(newNotifications);
      }
    };


  return (
    <div>
        <NavBar />
        <div className="flex flex-col items-center justify-center">
            <h1 className="text-4xl font-bold mt-4 text-center text-green-500">
                Notifications
            </h1>
        </div>
        <div className="container mx-auto mt-2 w-full md:w-3/4">
          {
            loading && (<Loader/>)
          }
            {
               !loading && notifications.length === 0 && (
                <>
                    <div className="flex items-center justify-center">
                        <div className="w-1/3 h-1/3 block">
                            <img src={process.env.PUBLIC_URL + '/nonotifications.jpg'} alt="No notifications" />
                        </div>
                    </div>
                    <h1 className="text-2xl font-bold mb-4 mt-4 text-center text-green-500">
                        Nothing to see here!
                    </h1>
                </>
                )
            }
            { !loading && notifications.length > 0 &&
              <>
                {
                  notifications.map((notification) => (
                      <NotificationCard key={notification.id} notification={notification} handleMarked={handleMarked} />
                  ))
                }
                <div className="flex flex-row justify-center">
                  <button className="bg-green-500 text-white px-2 py-1 mt-4 rounded-lg" onClick={handleLoadMore}>
                    {loadingmore?"loading...": "load More Notifications"}
                  </button>
                </div>
              </>
            }
            
        </div>
    </div>
  );
};

export default Notifications;