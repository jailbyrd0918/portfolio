import { useEffect, useState } from "react";

import { useMainContext } from "../context/MainContext";
import "../styles/screens/SettingsScreen.css";

const SettingsScreen = ({
  isActive,
  onClose,
}: {
  isActive: boolean;
  onClose: () => void;
}) => {
  const { context, updateContext } = useMainContext();
  const { is24HourFormat } = context;

  enum navIndices {
    IDX_TIME = 0,
  }

  const [focusedIndex, setFocusedIndex] = useState(navIndices.IDX_TIME);

  const changeHourFormat = () => {
    updateContext({ is24HourFormat: !is24HourFormat });
  };

  const handleClose = () => {
    const settingsScreen = document.querySelector(".settings-screen");

    settingsScreen!.setAttribute("close", "");

    const animationDuration = 300;
    setTimeout(() => {
      settingsScreen!.removeAttribute("close");
      onClose();
    }, animationDuration);
  };

  const handleInteract = () => {
    switch (focusedIndex) {
      case navIndices.IDX_TIME:
        changeHourFormat();
        break;
    }
  }

  const handleKeyDown = (event: KeyboardEvent) => {
    switch (event.key) {
      case "Escape":
        handleClose();
        break;

      case "Enter":
        handleInteract();
        break;

      default:
        break;
    }
  };

  useEffect(() => {
    const handleKeyDownLocal = (event: KeyboardEvent) => {
      if (isActive) {
        handleKeyDown(event);
      }
    };

    document.addEventListener("keydown", handleKeyDownLocal);

    return () => {
      document.removeEventListener("keydown", handleKeyDownLocal);
    };
  }, [isActive, is24HourFormat]);

  return (
    <dialog className={`settings-screen`} open={isActive}>
      <div className="settings-container">
        <div className="settings-time-container">
          <button 
            className={`${
              (focusedIndex === navIndices.IDX_TIME) ? 
              "settings-time-item-focused" : "settings-time-item"}
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
    </dialog>
  );
};

export default SettingsScreen;
