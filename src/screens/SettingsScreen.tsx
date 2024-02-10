import { useEffect } from "react";

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

  const changeHourFormat = () => {
    updateContext({ is24HourFormat: !is24HourFormat });
  };

  const handleClose = () => {
    const settingsScreen = document.querySelector(".settings-screen");

    settingsScreen!.setAttribute("close", "");

    const animationDuration = 200;
    setTimeout(() => {
      settingsScreen!.removeAttribute("close");
      onClose();
    }, animationDuration);
  };

  const handleKeyDown = (event: KeyboardEvent) => {
    switch (event.key) {
      case "Escape":
        handleClose();
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
  }, [isActive]);

  return (
    <dialog className={`settings-screen`} open={isActive}>
      <div className="settings-container">
        <div className="settings-time-container">
          <button className="settings-time-item" onClick={changeHourFormat}>
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
