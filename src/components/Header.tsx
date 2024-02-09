import { useState, useEffect, KeyboardEvent } from "react";
import { RiNotificationBadgeFill } from "react-icons/ri";

import "../styles/components/Header.css";

const Header = () => {
  
  const [ currentTime, setCurrentTime ] = useState(new Date());
  
  const latestNotif = "You have the latest notification";
  const username = "John Doe";
  const is24HourFormat = false;

  useEffect(() => {
    const timeRefreshIntervalId = setInterval(() => {
      setCurrentTime(new Date());
    }, 1000);

    return () => {
      clearInterval(timeRefreshIntervalId);
    }
  }, []);

  return (
    <div className="header-container">
      <div className="header-notif-container">
        <RiNotificationBadgeFill className="header-notif-icon" />
        <span className="header-notif-text">{latestNotif}</span>
      </div>
      
      <div className="header-profile-container">
        <img src="/assets/avatar.jpg" alt="avatar" className="header-profile-avatar" /> 
        <span className="header-profile-username">{username}</span>
      </div>
      
      <div className="header-time-container">
        <span className="header-time-text">{ currentTime.toLocaleString([], { 
              hour: "numeric", 
              minute: "numeric",
              hour12: !is24HourFormat  
            }) 
          }</span>
      </div>
    </div>
  );
}

export default Header;