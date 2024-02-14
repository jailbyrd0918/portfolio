import { useEffect, useState } from "react";

import { useMainContext } from "../context/MainContext";

import "../styles/pages/Settings.css";

const enum navIndices {
  IDX_TIME = 0,
}

const Settings = ({
  handleRouteNavigation,
}: {
  handleRouteNavigation: (nextRoute: string) => void;
}) => {
  /* ---------------------------------------- main context ---------------------------------------- */

  const { context, updateContext } = useMainContext();
  const { is24HourFormat } = context.settings.time;

  const updateTimeSettings = (h24Format: boolean) => {
    updateContext({
      settings: {
        time: {
          is24HourFormat: h24Format,
        },
      },
    });
  };

  const updateHourFormatSetting = () => {
    updateTimeSettings(!is24HourFormat);
  };

  /* ---------------------------------------- state variables ---------------------------------------- */

  const [focusedIndex, setFocusedIndex] = useState(navIndices.IDX_TIME);

  /* ---------------------------------------- functions ---------------------------------------- */

  const handleInteract = () => {
    switch (focusedIndex) {
      case navIndices.IDX_TIME:
        updateHourFormatSetting();
        break;
    }
  };

  const handleKeyDown = (event: KeyboardEvent) => {
    switch (event.key) {
      case "Escape":
        handleRouteNavigation("/");
        break;

      case "Enter":
        handleInteract();
        break;

      default:
        break;
    }
  };

  /* ---------------------------------------- effects ---------------------------------------- */

  useEffect(() => {
    document.addEventListener("keydown", handleKeyDown);

    return () => {
      document.removeEventListener("keydown", handleKeyDown);
    };
  }, [is24HourFormat]);

  /* ---------------------------------------- html ---------------------------------------- */

  return (
    <div className="settings-container">
      <div className="settings-time-container">
        <button
          className={`${
            focusedIndex === navIndices.IDX_TIME
              ? "settings-time-item-focused"
              : "settings-time-item"
          }
          `}
          autoFocus={focusedIndex === navIndices.IDX_TIME}
        >
          <span className="settings-time-item-label">24-Hour Format</span>
          <input
            type="checkbox"
            className="settings-time-item-checkbox"
            checked={is24HourFormat}
            disabled
          />
        </button>
      </div>
    </div>
  );
};

export default Settings;
