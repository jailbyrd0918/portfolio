import { useState, useEffect, KeyboardEvent } from "react";
import { RiNotificationBadgeFill } from "react-icons/ri";
import { IoMdSettings } from "react-icons/io";
import { MdOutlineKeyboardArrowLeft } from "react-icons/md";
import { SettingsScreen } from "../screens";

import "../styles/components/Menu.css";

const Menu = () => {
  const contents = [
    "About",
    "Projects",
    "Skills",
    "Contact",
    "Add New Content",
  ];

  enum navIndices {
    NAV_IDX_FUNCTION = 0,
    NAV_IDX_CONTENT,
  }

  enum funcIndices {
    FUNC_IDX_NOTIF = 0,
    FUNC_IDX_PROFILE,
    FUNC_IDX_SETTINGS,
  }

  const [focusedIndex, setFocusedIndex] = useState(0);
  const [storedFocusIndex, setStoredFocusIndex] = useState(focusedIndex);

  const [funcFocusedIndex, setFuncFocusedIndex] = useState(
    funcIndices.FUNC_IDX_NOTIF
  );

  const [content, setContent] = useState({});
  const [navIndex, setNavIndex] = useState(navIndices.NAV_IDX_CONTENT);

  const [isSettingsScreenActive, setIsSettingsScreenActive] = useState(false);

  /* ---------------------------------------- helpers ---------------------------------------- */

  const clamp = (value: number, min: number, max: number) => {
    return Math.max(min, Math.min(value, max));
  };

  const vwToPixels = (vw: number) => {
    const windowWidth = document.documentElement.clientWidth;
    return (vw * windowWidth) / 100;
  };

  const convertRemToPixel = (rem: number) => {
    return (
      rem * parseFloat(getComputedStyle(document.documentElement).fontSize)
    );
  };

  const autoAdjustMenuWidth = (index: number) => {
    const tileW: number = convertRemToPixel(14);
    const gap: number = convertRemToPixel(0.5);
    const expandWidth: number = index * (tileW + gap);

    document.documentElement.style.setProperty(
      "--menu-width",
      `${vwToPixels(250) + expandWidth}px`
    );
  };

  const translate = (index: number) => {
    const tileW: number = convertRemToPixel(14);
    const gap: number = convertRemToPixel(0.5);
    const translateX: number = index * (tileW + gap) * -1;
    document.documentElement.style.setProperty(
      "--translate-x",
      `${translateX}px`
    );

    autoAdjustMenuWidth(index);
  };

  /* ---------------------------------------- functions ---------------------------------------- */

  const toFunctionTransition = () => {
    setStoredFocusIndex(focusedIndex);
    setFocusedIndex(-1);

    const translateY = convertRemToPixel(25);
    document.documentElement.style.setProperty("--content-opacity", ".5");
    document.documentElement.style.setProperty(
      "--content-move-y",
      `${translateY}px`
    );
    document.documentElement.style.setProperty("--function-opacity", "1");
    document.documentElement.style.setProperty("--header-profile-opacity", "0");
  };

  const toContentTransition = () => {
    setFocusedIndex(storedFocusIndex);

    document.documentElement.style.setProperty("--content-opacity", "1");
    document.documentElement.style.setProperty("--content-move-y", `0px`);
    document.documentElement.style.setProperty("--function-opacity", "0");
    document.documentElement.style.setProperty("--header-profile-opacity", "1");
  };

  const handleInteractAtFunction = () => {
    switch (funcFocusedIndex) {
      case funcIndices.FUNC_IDX_NOTIF:
        break;

      case funcIndices.FUNC_IDX_PROFILE:
        break;

      case funcIndices.FUNC_IDX_SETTINGS:
        handleSettingsScreenOpen();
        break;

      default:
        break;
    }
  };

  const handleKeyDownAtFunction = (event: KeyboardEvent) => {
    switch (event.key) {
      case "ArrowLeft":
        setFuncFocusedIndex(
          clamp(
            funcFocusedIndex - 1,
            funcIndices.FUNC_IDX_NOTIF,
            funcIndices.FUNC_IDX_SETTINGS
          )
        );
        break;

      case "ArrowRight":
        setFuncFocusedIndex(
          clamp(
            funcFocusedIndex + 1,
            funcIndices.FUNC_IDX_NOTIF,
            funcIndices.FUNC_IDX_SETTINGS
          )
        );
        break;

      case "ArrowDown":
        setNavIndex(navIndices.NAV_IDX_CONTENT);
        toContentTransition();
        break;

      case "Enter":
        handleInteractAtFunction();
        break;

      default:
        break;
    }
  };

  const handleInteraceAtContent = () => {
  }

  const handleKeyDownAtContent = (event: KeyboardEvent) => {
    switch (event.key) {
      case "ArrowLeft":
        setFocusedIndex(clamp(focusedIndex - 1, 0, contents.length - 1));
        break;

      case "ArrowRight":
        setFocusedIndex(clamp(focusedIndex + 1, 0, contents.length - 1));
        break;

      case "ArrowUp":
        setNavIndex(navIndices.NAV_IDX_FUNCTION);
        toFunctionTransition();
        break;

      case "Enter":
        handleInteraceAtContent();
        break;

      default:
        break;
    }
  };

  const handleKeyDown = (event: KeyboardEvent) => {
    event.preventDefault();

    switch (navIndex) {
      case navIndices.NAV_IDX_FUNCTION:
        handleKeyDownAtFunction(event);
        break;

      case navIndices.NAV_IDX_CONTENT:
        handleKeyDownAtContent(event);
        break;

      default:
        break;
    }
  };

  const handleFocus = (index: number) => {
    setFocusedIndex(index);
  };

  function handleSettingsScreenOpen() {
    setIsSettingsScreenActive(true);
  }

  function handleSettingsScreenClose() {
    setIsSettingsScreenActive(false);
  }

  /* ---------------------------------------- main ---------------------------------------- */

  useEffect(() => {
    const atHome = !isSettingsScreenActive;

    const handleKeyDownWrapper = (event: KeyboardEvent) => {
      if (atHome) {
        handleKeyDown(event);
      }
    };

    document.addEventListener("keydown", handleKeyDownWrapper);

    if (focusedIndex >= 0) {
      translate(focusedIndex);
    }

    fetch("/assets/json/desc.json")
      .then((response) => response.json())
      .then((data) => setContent(data))
      .catch((error) => console.error(error));

    return () => {
      document.removeEventListener("keydown", handleKeyDownWrapper);
    };
  }, [focusedIndex, isSettingsScreenActive, handleKeyDown]);

  return (
    <div className="menu-container">
      {/* function */}
      <div className="function-container">
        <button
          className="function-item-container"
          autoFocus={funcFocusedIndex === funcIndices.FUNC_IDX_NOTIF}
        >
          <RiNotificationBadgeFill
            className={`${
              funcFocusedIndex === funcIndices.FUNC_IDX_NOTIF
                ? "function-item-icon-focused"
                : "function-item-icon"
            }`}
          />
          <span
            className={`${
              funcFocusedIndex === funcIndices.FUNC_IDX_NOTIF
                ? "function-item-label-focused"
                : "function-item-label"
            }`}
          >
            Notifications
          </span>
        </button>

        <button
          className="function-item-container"
          autoFocus={funcFocusedIndex === funcIndices.FUNC_IDX_PROFILE}
        >
          <img
            src="/assets/images/avatar.jpg"
            alt="icon"
            className={`${
              funcFocusedIndex === funcIndices.FUNC_IDX_PROFILE
                ? "function-item-icon-focused"
                : "function-item-icon"
            }`}
          />
          <span
            className={`${
              funcFocusedIndex === funcIndices.FUNC_IDX_PROFILE
                ? "function-item-label-focused"
                : "function-item-label"
            }`}
          >
            Profile
          </span>
        </button>

        <button
          className="function-item-container"
          autoFocus={funcFocusedIndex === funcIndices.FUNC_IDX_SETTINGS}
        >
          <IoMdSettings
            className={`${
              funcFocusedIndex === funcIndices.FUNC_IDX_SETTINGS
                ? "function-item-icon-focused"
                : "function-item-icon"
            }`}
          />
          <span
            className={`${
              funcFocusedIndex === funcIndices.FUNC_IDX_SETTINGS
                ? "function-item-label-focused"
                : "function-item-label"
            }`}
          >
            Settings
          </span>
        </button>
      </div>

      {/* content */}
      <div id="content-container" className="content-container">
        {contents.map((content, index) => (
          <button
            className={`${
              index === focusedIndex ? "content-item-focused" : "content-item"
            }`}
            onFocus={() => handleFocus(index)}
            autoFocus={index === focusedIndex}
          >
            <img
              src={`/assets/images/tile${clamp(index + 1, 0, 4)}.jpg`}
              alt="thumbnail"
              className="content-item-thumbnail"
            />
            <div className="content-item-footer-container">
              <MdOutlineKeyboardArrowLeft className="content-item-footer-icon" />
              <span className="content-item-footer-text">Enter</span>
            </div>
          </button>
        ))}
      </div>

      {/* content-info */}
      <div className="contentinfo-container">
        {contents.map((tile, index) => (
          <div
            className={`${
              index === focusedIndex
                ? "contentinfo-item-focused"
                : "contentinfo-item"
            }`}
          >
            <span className="contentinfo-item-title">{tile}</span>

            <p className="contentinfo-item-desc">
              {/* Lorem ipsum dolor sit amet, consectetur adipiscing elit. Duis sagittis imperdiet ante ut pellentesque. In aliquam orci eu interdum porttitor. Proin vulputate id orci ac viverra. Cras in porttitor eros. Morbi laoreet elementum mollis. In ut erat porta diam ultricies ullamcorper vel ac orci. Nam non urna non erat sollicitudin dictum laoreet vel erat. Phasellus vestibulum sed arcu et viverra. Donec consequat in felis non pellentesque. Nunc quis nisi eget lacus porta convallis et sed quam. Aenean quis magna blandit, tempus odio nec, maximus nulla. Sed velit lorem, ultrices sed sollicitudin nec, mollis id orci. Quisque blandit finibus mollis. Donec malesuada, augue id ultrices tincidunt, nisi quam accumsan mauris, sed tincidunt tortor diam vel libero. Praesent augue massa, varius elementum nisi ut, placerat condimentum nunc. Quisque vel consequat lorem. */}
              {content[`${tile}`]}
            </p>
          </div>
        ))}
      </div>

      {/* screens */}
      <SettingsScreen
        isActive={isSettingsScreenActive}
        onClose={handleSettingsScreenClose}
      />
    </div>
  );
};

export default Menu;
