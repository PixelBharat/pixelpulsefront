import React, { useState, useEffect } from 'react';
import axios from 'axios';
import { useParams } from 'react-router-dom'; 
import Head from '../components/Head';

const AllNotifications = () => {
  const { projectId } = useParams(); 
  const [notifications, setNotifications] = useState([]);

  useEffect(() => {
    const fetchNotifications = async () => {
      try {
        const response = await axios.get(`http://localhost:5501/api/projects/${projectId}/notifications`);
        setNotifications(response.data);
      } catch (error) {
        console.error('Error fetching notifications:', error);
      }
    };

    fetchNotifications();
  }, [projectId]);

  return (
    <div className="main">
      <div className='frame'>
     <Head heading={'All Notifications'} />
      {notifications.sort((a, b) => new Date(b.createdAt) - new Date(a.createdAt)).map((notification, index) => {
        const date = new Date(notification.createdAt);
        const isValidDate = !isNaN(date.getTime()) && notification.createdAt !== null;

        return (
          <div key={index} className="notification-item">
            {/* <img
              className="project-dash-notification-img"
              src="https://images.pexels.com/photos/674010/pexels-photo-674010.jpeg?cs=srgb&dl=pexels-anjana-c-169994-674010.jpg&fm=jpg"
              alt="Profile"
            /> */}
              <div className="card-pic" style={{ backgroundColor: `#${Math.floor(Math.random() * 16777215).toString(16)}` }}>
                    {/* {projectDetails ? projectDetails.projectName.charAt(0) : 'L'} */} N
                  </div>
            <div className="notification-content">
              <div className="notification-message">
                {notification.message}
              </div>
              <div className="notification-timestamp">
                {isValidDate
                  ? `${date.toLocaleDateString()} at ${date.toLocaleTimeString()}`
                  : "Date not available"}
              </div>
            </div>
          </div>
        );
      })}
    </div>
    </div>
  );
};

export default AllNotifications;