import { useState } from "react";

import { Header, Menu } from "./components";
import { SettingsScreen } from "./screens";

import "./styles/App.css";

const App = () => {
  const [isSettingsScreenActive, setIsSettingsScreenActive] = useState(false);

  const handleSettingsScreen = (isActive: boolean) => {
    setIsSettingsScreenActive(isActive);
  };

  return (
    <div className={`app-screen ${isSettingsScreenActive ? "settings-active" : ""}`}>
      <Header />
      <Menu 
        onSettingsScreen={handleSettingsScreen}
        atHome={!isSettingsScreenActive} 
      />

      {/* screens */}
      <SettingsScreen
        isActive={isSettingsScreenActive}
        onClose={() => handleSettingsScreen(false)}
      />
    </div>
  );
}

export default App;



