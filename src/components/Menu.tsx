import { useState, useEffect, KeyboardEvent, WheelEvent } from "react";
import { RiNotificationBadgeFill } from "react-icons/ri";
import { IoMdSettings  } from "react-icons/io";
import { MdOutlineKeyboardArrowLeft } from "react-icons/md";
import { SettingsScreen } from "../screens";

import "../styles/components/Menu.css";

const Menu = () => {

  const tiles = [
    "About",
    "Projects",
    "Skills",
    "Contact",
    "Add New Content"
  ];

  const [ focusedIndex, setFocusedIndex ] = useState(0);
  const [ content, setContent ] = useState({});

  const [ isSettingsScreenActive, setIsSettingsScreenActive ] = useState(false);

  const clamp = (value: number, min: number, max: number) => {
    return Math.max(min, Math.min(value, max));
  }

  const vwToPixels = (vw: number) => {
    const windowWidth = document.documentElement.clientWidth;
    return (vw * windowWidth) / 100;
  };

  const handleKeyDown = (event: KeyboardEvent) => {    
    switch (event.key) {
      case "ArrowLeft":
        event.preventDefault();
        setFocusedIndex(clamp(focusedIndex - 1, 0, tiles.length - 1));
        break;
        
      case "ArrowRight":
        event.preventDefault();
        setFocusedIndex(clamp(focusedIndex + 1, 0, tiles.length - 1));
        break;
        
      case "a":
        event.preventDefault();
         
        if (!isSettingsScreenActive) {
          handleSettingsScreenOpen();
        }

        break;

      default:
        break;
    }
  }

  const autoAdjustMenuWidth = (index: number) => {
    const tileW: number = convertRemToPixel(14);
    const gap: number = convertRemToPixel(.5);
    const expandWidth: number = (index * (tileW + gap));
    
    document.documentElement.style.setProperty("--menu-width", `${vwToPixels(250) + expandWidth}px`);
  }

  const translate = (index: number) => {
    const tileW: number = convertRemToPixel(14);
    const gap: number = convertRemToPixel(.5);
    const translateX: number = (index * (tileW + gap)) * -1;
    document.documentElement.style.setProperty("--translate-x", `${translateX}px`);
  
    autoAdjustMenuWidth(index);
  }

  const handleFocus = (index: number) => {
    setFocusedIndex(index);
  }

  const convertRemToPixel = (rem: number) => {
    return rem * parseFloat(getComputedStyle(document.documentElement).fontSize);
  }
  
  function handleSettingsScreenOpen () {
    setIsSettingsScreenActive(true);
  }

  function handleSettingsScreenClose () {
    setIsSettingsScreenActive(false);
  }

  useEffect(() => {
    const atHome = !isSettingsScreenActive;
    
    const handleKeyDownWrapper = (event: KeyboardEvent) => {
      if (atHome) {
        handleKeyDown(event);
      }
    }

    document.addEventListener("keydown", handleKeyDownWrapper);

    if (focusedIndex >= 0) {
      translate(focusedIndex);
    }   

    fetch("/assets/json/desc.json")
    .then((response) => response.json())
    .then((data) => setContent(data))
    .catch(error => console.error(error));

    return () => {
      document.removeEventListener("keydown", handleKeyDownWrapper);
    }
  }, [focusedIndex, isSettingsScreenActive]);
  
  return (
    <div className="menu-container">
      {/* function */}
      <div className="function-container">
        <button className="function-item-container">
          <RiNotificationBadgeFill className="function-item-icon" />
          <span className="function-item-label">Notifications</span>
        </button>
        <button className="function-item-container">
          <img src="/assets/images/avatar.jpg" alt="icon" className="function-item-icon" /> 
          <span className="function-item-label">Profile</span>
        </button>
        <button className="function-item-container">
          <IoMdSettings className="function-item-icon" />
          <span className="function-item-label">Settings</span>
        </button>
      </div>

      {/* content */}
      <div 
        id="content-container"
        className="content-container" 
      >
        { tiles.map((tile, index) => (
          <button 
            className={`${(index === focusedIndex) ? "content-item-focused" : "content-item"}`} 
            onFocus={() => handleFocus(index)}
            autoFocus={index === focusedIndex}
          >
            <img 
              src={`/assets/images/tile${clamp(index + 1, 0, 4)}.jpg`} 
              alt="thumbnail" className="content-item-thumbnail" 
            />
            <div className="content-item-footer-container">
              <MdOutlineKeyboardArrowLeft className="content-item-footer-icon" />
              <span className="content-item-footer-text">Enter</span>
            </div>
          </button>
        )) }
      </div>

      {/* content-info */}
      <div className="contentinfo-container">
        { tiles.map((tile, index) => (
          <div 
            className={`${(index === focusedIndex) ? "contentinfo-item-focused" : "contentinfo-item"}`} 
          >
            <span className="contentinfo-item-title">{tile}</span>

            <p className="contentinfo-item-desc">
              {/* Lorem ipsum dolor sit amet, consectetur adipiscing elit. Duis sagittis imperdiet ante ut pellentesque. In aliquam orci eu interdum porttitor. Proin vulputate id orci ac viverra. Cras in porttitor eros. Morbi laoreet elementum mollis. In ut erat porta diam ultricies ullamcorper vel ac orci. Nam non urna non erat sollicitudin dictum laoreet vel erat. Phasellus vestibulum sed arcu et viverra. Donec consequat in felis non pellentesque. Nunc quis nisi eget lacus porta convallis et sed quam. Aenean quis magna blandit, tempus odio nec, maximus nulla. Sed velit lorem, ultrices sed sollicitudin nec, mollis id orci. Quisque blandit finibus mollis. Donec malesuada, augue id ultrices tincidunt, nisi quam accumsan mauris, sed tincidunt tortor diam vel libero. Praesent augue massa, varius elementum nisi ut, placerat condimentum nunc. Quisque vel consequat lorem. */}
              { content[`${tile}`] }
            </p>
          </div>
        )) }
      </div>

      {/* screens */}
      <SettingsScreen isActive={isSettingsScreenActive} onClose={handleSettingsScreenClose} />

    </div>
  );
}

export default Menu;