import { useNavigate } from "react-router-dom";
import { useState, useEffect, KeyboardEvent } from "react";

import { RiNotificationBadgeFill } from "react-icons/ri";
import { IoMdSettings } from "react-icons/io";
import { MdOutlineKeyboardArrowLeft } from "react-icons/md";

import { useMainContext } from "../context/MainContext";

import "../styles/pages/Home.css";

const contentIDs = ["About", "Projects", "Skills", "Contact"];

const enum navIndices {
  NAV_IDX_FUNCTION = 0,
  NAV_IDX_CONTENT,
}

const enum funcIndices {
  FUNC_IDX_NOTIF = 0,
  FUNC_IDX_PROFILE,
  FUNC_IDX_SETTINGS,
}

const enum contents {
  CONTENT_ABOUT = 0,
  CONTENT_WORKS,
  CONTENT_SKILLS,
  CONTENT_CONTACT,
}

const DEFAULT_USERNAME = "John Ly";
const NO_NOTIF = "There are no notifications.";

const Home = ({
  handleRouteNavigation,
}: {
  handleRouteNavigation: (nextRoute: string) => void;
}) => {
  /* ---------------------------------------- main context ---------------------------------------- */

  const { context, updateContext } = useMainContext();
  const { is24HourFormat } = context.settings.time;
  const { navIndex, functionIndex, contentIndex } = context.navigation.home;
  const { notifications } = context.data;
  const { username } = context.data.profile;

  const updateHomeNavigation = (
    navIndex: number,
    funcIndex: number,
    contentIndex: number
  ) => {
    updateContext({
      navigation: {
        home: {
          navIndex: navIndex,
          functionIndex: funcIndex,
          contentIndex: contentIndex,
        },
      },
    });
  };

  const updateNavIndex = (index: number) => {
    updateHomeNavigation(index, functionIndex, contentIndex);
  };

  const updateFunctionIndex = (index: number) => {
    updateHomeNavigation(navIndex, index, contentIndex);
  };

  const updateContentIndex = (index: number) => {
    updateHomeNavigation(navIndex, functionIndex, index);
  };

  /* ---------------------------------------- state variables ---------------------------------------- */

  const [descriptions, setDescriptions] = useState({});
  const [currentTime, setCurrentTime] = useState(new Date());
  const [displayNotif, setDisplayNotif] = useState("");
  const [displayUsername, setDisplayUsername] = useState("");

  /* ---------------------------------------- helpers ---------------------------------------- */

  const clamp = (value: number, min: number, max: number) => {
    return Math.max(min, Math.min(value, max));
  };

  const vwToPixels = (vw: number) => {
    const windowWidth = document.documentElement.clientWidth;
    return (vw * windowWidth) / 100;
  };

  const remToPixels = (rem: number) => {
    return (
      rem * parseFloat(getComputedStyle(document.documentElement).fontSize)
    );
  };

  const adjustContentListWidth = (
    itemIndex: number,
    itemWidthRem: number,
    gapRem: number
  ) => {
    const tileW: number = remToPixels(itemWidthRem);
    const gap: number = remToPixels(gapRem);
    const expandWidth: number = itemIndex * (tileW + gap);

    document.documentElement.style.setProperty(
      "--content-list-width",
      `${vwToPixels(250) + expandWidth}px`
    );
  };

  const moveContentList = (
    itemIndex: number,
    itemWidthRem: number,
    gapRem: number
  ) => {
    const tileW: number = remToPixels(itemWidthRem);
    const gap: number = remToPixels(gapRem);
    const translateX: number = itemIndex * (tileW + gap) * -1;
    document.documentElement.style.setProperty(
      "--content-list-move-x",
      `${translateX}px`
    );

    adjustContentListWidth(itemIndex, itemWidthRem, gapRem);
  };

  /* ---------------------------------------- functions ---------------------------------------- */

  const toFunctionTransition = () => {
    const translateY = remToPixels(10);
    document.documentElement.style.setProperty("--function-list-opacity", "1");
    document.documentElement.style.setProperty("--header-profile-opacity", "0");

    document.documentElement.style.setProperty("--content-list-opacity", ".5");
    document.documentElement.style.setProperty(
      "--content-list-move-y",
      `${translateY}px`
    );
  };

  const toContentTransition = () => {
    document.documentElement.style.setProperty("--function-list-opacity", "0");
    document.documentElement.style.setProperty("--header-profile-opacity", "1");

    document.documentElement.style.setProperty("--content-list-opacity", "1");
    document.documentElement.style.setProperty("--content-list-move-y", "0px");
  };

  const handleInteractAtFunction = () => {
    switch (functionIndex) {
      case funcIndices.FUNC_IDX_NOTIF:
        handleRouteNavigation("/notifications");
        break;

      case funcIndices.FUNC_IDX_PROFILE:
        handleRouteNavigation("/profile");
        break;

      case funcIndices.FUNC_IDX_SETTINGS:
        handleRouteNavigation("/settings");
        break;

      default:
        break;
    }
  };

  const handleKeyDownAtFunction = (event: KeyboardEvent) => {
    switch (event.key) {
      case "ArrowLeft":
        updateFunctionIndex(
          clamp(
            functionIndex - 1,
            funcIndices.FUNC_IDX_NOTIF,
            funcIndices.FUNC_IDX_SETTINGS
          )
        );
        break;

      case "ArrowRight":
        updateFunctionIndex(
          clamp(
            functionIndex + 1,
            funcIndices.FUNC_IDX_NOTIF,
            funcIndices.FUNC_IDX_SETTINGS
          )
        );
        break;

      case "ArrowDown":
        updateNavIndex(navIndices.NAV_IDX_CONTENT);
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
    switch (contentIndex) {
      case contents.CONTENT_ABOUT:
        handleRouteNavigation("/about");
        break;

      case contents.CONTENT_WORKS:
        handleRouteNavigation("/works");
        break;

      case contents.CONTENT_SKILLS:
        handleRouteNavigation("/skills");
        break;

      case contents.CONTENT_CONTACT:
        handleRouteNavigation("/contact");
        break;

      default:
        break;
    }
  };

  const handleKeyDownAtContent = (event: KeyboardEvent) => {
    switch (event.key) {
      case "ArrowLeft":
        updateContentIndex(
          clamp(
            contentIndex - 1,
            contents.CONTENT_ABOUT,
            contents.CONTENT_CONTACT
          )
        );
        break;

      case "ArrowRight":
        updateContentIndex(
          clamp(
            contentIndex + 1,
            contents.CONTENT_ABOUT,
            contents.CONTENT_CONTACT
          )
        );
        break;

      case "ArrowUp":
        updateNavIndex(navIndices.NAV_IDX_FUNCTION);
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

  /* ---------------------------------------- effects ---------------------------------------- */

  // time
  useEffect(() => {
    const timeRefreshIntervalId = setInterval(() => {
      setCurrentTime(new Date());
    }, 1000);

    return () => {
      clearInterval(timeRefreshIntervalId);
    };
  }, []);

  // handles page reload, which client should not do (at least not frequently)
  useEffect(() => {
    // reinstate navigation index
    switch (navIndex) {
      case navIndices.NAV_IDX_FUNCTION:
        toFunctionTransition();
        break;

      case navIndices.NAV_IDX_CONTENT:
        toContentTransition();
        break;

      default:
        break;
    }

    // reinstate content index
    moveContentList(contentIndex, 12, 0.5);
  }, [navIndex, toFunctionTransition, toContentTransition]);

  // display informations
  useEffect(() => {
    setDisplayUsername(username !== "" ? username : DEFAULT_USERNAME);
    setDisplayNotif(
      notifications.length !== 0
        ? notifications[notifications.length - 1]
        : NO_NOTIF
    );
  }, [username, notifications]);

  // main
  useEffect(() => {
    document.addEventListener("keydown", handleKeyDown);

    if (navIndex === navIndices.NAV_IDX_CONTENT) {
      moveContentList(contentIndex, 12, 0.5);
    }

    // fetch content descriptions
    fetch("/assets/json/desc.json")
      .then((response) => response.json())
      .then((data) => setDescriptions(data))
      .catch((error) => console.error(error));

    return () => {
      document.removeEventListener("keydown", handleKeyDown);
    };
  }, [handleKeyDown]);

  /* ---------------------------------------- html ---------------------------------------- */

  return (
    <div className="home-container">
      {/* function header */}
      <div className="header-container">
        <div className="header-notif-container">
          <RiNotificationBadgeFill className="header-notif-icon" />
          <span className="header-notif-text">{displayNotif}</span>
        </div>

        <div className="header-profile-container">
          <img
            src="/assets/images/avatar.jpg"
            alt="avatar"
            className="header-profile-avatar"
          />
          <span className="header-profile-username">{displayUsername}</span>
        </div>

        <div className="header-time-container">
          <span className="header-time-text">
            {currentTime.toLocaleString([], {
              hour: "numeric",
              minute: "numeric",
              hour12: !is24HourFormat,
            })}
          </span>
        </div>
      </div>

      {/* function */}
      <div className="function-container">
        <button
          className="function-item-container"
          autoFocus={functionIndex === funcIndices.FUNC_IDX_NOTIF}
        >
          <RiNotificationBadgeFill
            className={`${
              functionIndex === funcIndices.FUNC_IDX_NOTIF
                ? "function-item-icon-focused"
                : "function-item-icon"
            }`}
          />
          <span
            className={`${
              functionIndex === funcIndices.FUNC_IDX_NOTIF
                ? "function-item-label-focused"
                : "function-item-label"
            }`}
          >
            Notifications
          </span>
        </button>

        <button
          className="function-item-container"
          autoFocus={functionIndex === funcIndices.FUNC_IDX_PROFILE}
        >
          <img
            src="/assets/images/avatar.jpg"
            alt="icon"
            className={`${
              functionIndex === funcIndices.FUNC_IDX_PROFILE
                ? "function-item-icon-focused"
                : "function-item-icon"
            }`}
          />
          <span
            className={`${
              functionIndex === funcIndices.FUNC_IDX_PROFILE
                ? "function-item-label-focused"
                : "function-item-label"
            }`}
          >
            Profile
          </span>
        </button>

        <button
          className="function-item-container"
          autoFocus={functionIndex === funcIndices.FUNC_IDX_SETTINGS}
        >
          <IoMdSettings
            className={`${
              functionIndex === funcIndices.FUNC_IDX_SETTINGS
                ? "function-item-icon-focused"
                : "function-item-icon"
            }`}
          />
          <span
            className={`${
              functionIndex === funcIndices.FUNC_IDX_SETTINGS
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
        {contentIDs.map((contentID, index) => (
          <button
            className={`${
              navIndex === navIndices.NAV_IDX_CONTENT && index === contentIndex
                ? "content-item-focused"
                : "content-item"
            }`}
            autoFocus={
              navIndex === navIndices.NAV_IDX_CONTENT && index === contentIndex
            }
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

      {/* content info */}
      <div className="contentinfo-container">
        {contentIDs.map((contentID, index) => (
          <div
            className={`${
              ((index === contentIndex) && (navIndex === navIndices.NAV_IDX_CONTENT))
                ? "contentinfo-item-focused"
                : "contentinfo-item"
            }`}
          >
            <span className="contentinfo-item-title">{contentID}</span>

            <p className="contentinfo-item-desc">
              {/* Lorem ipsum dolor sit amet, consectetur adipiscing elit. Duis sagittis imperdiet ante ut pellentesque. In aliquam orci eu interdum porttitor. Proin vulputate id orci ac viverra. Cras in porttitor eros. Morbi laoreet elementum mollis. In ut erat porta diam ultricies ullamcorper vel ac orci. Nam non urna non erat sollicitudin dictum laoreet vel erat. Phasellus vestibulum sed arcu et viverra. Donec consequat in felis non pellentesque. Nunc quis nisi eget lacus porta convallis et sed quam. Aenean quis magna blandit, tempus odio nec, maximus nulla. Sed velit lorem, ultrices sed sollicitudin nec, mollis id orci. Quisque blandit finibus mollis. Donec malesuada, augue id ultrices tincidunt, nisi quam accumsan mauris, sed tincidunt tortor diam vel libero. Praesent augue massa, varius elementum nisi ut, placerat condimentum nunc. Quisque vel consequat lorem. */}
              {descriptions[`${contentID}`]}
            </p>
          </div>
        ))}
      </div>
    </div>
  );
};

export default Home;
