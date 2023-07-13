import React, { useState, useEffect } from 'react';
import dayjs from 'dayjs';
import NavBar from '../../Components/NavBar/NavBar';
import './Notifications.css';
import axios from 'axios';


const NotificationCard = ({ notification }) => {
    const { date, id, is_read, link, message } = notification;
    const formattedDate = dayjs(date).format('MMMM D, YYYY HH:mm A');
  
    return (
      <div
        className={`flex items-center justify-between p-4 bg-white shadow-md hover:bg-green-50 rounded-lg ${
          is_read ? 'bg-gray-200' : 'bg-blue-100'
        }`}
      >
        <div className="flex items-center space-x-4">
          <div>
            <h3 className="font-medium text-lg">{message}</h3>
            <p className="text-gray-500">{formattedDate}</p>
          </div>
        </div>
        <a
          href={link}
          className="text-blue-500 hover:text-blue-700 transition-colors duration-300"
        >
          View
        </a>
      </div>
    );
  };

const Notifications = () => {
    const [notifications, setNotifications] = useState([]);

    useEffect(() => {
      if (!localStorage.getItem('token')) {
        window.location.href = '/login';
      }
      const fetchNotifications = async () => {
        const response = await axios.get('https://scicommons-backend.onrender.com/api/notification/', {
          headers: { Authorization: `Bearer ${localStorage.getItem('token')}` },
        });
        const data = response.data.success;
        console.log(data.results);
        setNotifications(data.results);
      };
      fetchNotifications();
    }, []);
    


  return (
    <div>
        <NavBar />
        <div className="flex flex-col items-center justify-center">
            <h1 className="text-4xl font-bold mb-4 mt-4 text-center text-gray-500">
                Notifications
            </h1>
        </div>
        <div className="container mx-auto m-8 p-8">
            {
                notifications.length === 0 && (
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
            {
                notifications.map((notification) => (
                    <NotificationCard key={notification.id} notification={notification} />
                ))
            }
        </div>
    </div>
  );
};

export default Notifications;