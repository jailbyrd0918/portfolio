import { useEffect, useState } from "react";

import { useMainContext } from "../context/MainContext";
import "../styles/pages/Notifications.css";

const temp_notifs = [
  "This is the first notification.",
  "This is the second notification.",
  "This is the third notification.",
  "This is the fourth notification.",
  "This is the fifth notification.",
  "This is the sixth notification.",
  "This is the seventh notification.",
  "This is the eighth notification.",
  "This is the ninth notification.",
  "This is the tenth notification.",
  "This is the eleventh notification.",
  "This is the twelfth notification.",
  "This is the notification 13.",
  "This is the notification 14.",
  "This is the notification 16.",
  "This is the notification 17.",
  "This is the notification 18.",
  "This is the notification 19.",
  "This is the notification 20.",
  "This is the notification 21.",
];

const time = "Yesterday, 7:14 PM";

const enum optionIndices {
  OPTION_DELETE,
  OPTION_CANCEL,
}

const Notifications = ({
  handleRouteNavigation,
}: {
  handleRouteNavigation: (nextRoute: string) => void;
}) => {
  /* ---------------------------------------- main context ---------------------------------------- */

  const { context, updateContext } = useMainContext();
  const { notifications } = context.data;

  /* ---------------------------------------- state variables ---------------------------------------- */

  const [focusedIndex, setFocusedIndex] = useState(0);
  const [optionIndex, setOptionIndex] = useState(0);
  const [sidebarActive, setSidebarActive] = useState(false);

  /* ---------------------------------------- helpers ---------------------------------------- */

  const clamp = (value: number, min: number, max: number) => {
    return Math.max(min, Math.min(value, max));
  };

  /* ---------------------------------------- functions ---------------------------------------- */

  const handleOpenSidebar = () => {
    setSidebarActive(true);
    document.documentElement.style.setProperty("--notif-sidebar-move-x", "0%");
    document.documentElement.style.setProperty("--notif-visibility", "visible");
  }
  
  const handleCloseSidebar = () => {
    setSidebarActive(false);
    document.documentElement.style.setProperty("--notif-sidebar-move-x", "100%");
    document.documentElement.style.setProperty("--notif-visibility", "collapse");
    
    // reset the option index after closing the sidebar
    setTimeout(() => {
      setOptionIndex(0);
    }, 300);
  }

  const handleDelete = () => {
    temp_notifs.splice(focusedIndex, 1);
    handleCloseSidebar();
  }

  const handleInteractOptions = () => {
    switch (optionIndex) {
      case optionIndices.OPTION_DELETE:
        handleDelete();
        break;

      case optionIndices.OPTION_CANCEL:
        handleCloseSidebar();
        break;

      default:
        break;
    }
  }

  const handleInteract = () => {
    handleOpenSidebar();
  };

  const handleFocus = (index: number) => {
    setFocusedIndex(clamp(index, 0, temp_notifs.length - 1));
  }

  const handleKeyDownSidebar = (event: KeyboardEvent) => {
    event.preventDefault();

    switch (event.key) {
      case "Escape":
        handleCloseSidebar();
        break;

      case "ArrowUp":
        setOptionIndex(clamp(optionIndex - 1, optionIndices.OPTION_DELETE, optionIndices.OPTION_CANCEL));
        break;

      case "ArrowDown":
        setOptionIndex(clamp(optionIndex + 1, optionIndices.OPTION_DELETE, optionIndices.OPTION_CANCEL));
        break;

      case "Enter":
        handleInteractOptions();
        break;

      default:
        break;
    }
  }

  const handleKeyDownMain = (event: KeyboardEvent) => {
    switch (event.key) {
      case "Escape":
        handleRouteNavigation("/");
        break;

      case "ArrowUp":
        setFocusedIndex(clamp(focusedIndex - 1, 0, temp_notifs.length - 1));
        break;

      case "ArrowDown":
        setFocusedIndex(clamp(focusedIndex + 1, 0, temp_notifs.length - 1));
        break;

      case "Enter":
        handleInteract();
        break;

      default:
        break;
    }
  }

  useEffect(() => {
    const handleKeyDown = (event: KeyboardEvent) => {
      if (sidebarActive) handleKeyDownSidebar(event);
      else handleKeyDownMain(event);
    };
    
    document.addEventListener("keydown", handleKeyDown);

    return () => {
      document.removeEventListener("keydown", handleKeyDown);
    };
  }, [focusedIndex, optionIndex, sidebarActive, handleRouteNavigation]);

  return (
    <div className="notif-container">
      <div className="notif-header">
        <h1 className="notif-title">Notifications</h1>
      </div>

      <div className="notif-list">
        {temp_notifs.map((notif, index) => (
          <button 
            className={`${(index === focusedIndex) ? "notif-item-focused" : "notif-item"}`} 
            autoFocus={index === focusedIndex}
            onFocus={() => handleFocus(index)}
          >
            <div className="notif-message-container">
              <span className="notif-message">{notif}</span>
            </div>
            <div className="notif-datetime-container">
              <span className="notif-datetime">{time}</span>
            </div>
          </button>
        ))}
      </div>

      <div className="notif-sidebar-container">
        <button 
          className={`${(optionIndex === optionIndices.OPTION_DELETE) ? "notif-sidebar-option-focused" : "notif-sidebar-option"}`}
          autoFocus={optionIndex === optionIndices.OPTION_DELETE}
        >
          Delete Notification
        </button>
        
        <button 
          className={`${(optionIndex === optionIndices.OPTION_CANCEL) ? "notif-sidebar-option-focused" : "notif-sidebar-option"}`}
          autoFocus={optionIndex === optionIndices.OPTION_CANCEL}
        >
          Cancel
        </button>
      </div>
    </div>
  );
};

export default Notifications;
