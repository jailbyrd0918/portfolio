import { useState, KeyboardEvent, useEffect } from "react";

import { Header, Menu } from "./components";
import "./styles/App.css";

const App = () => {
  return (
    <div className="app-screen">
      <Header />
      <Menu />
    </div>
  );
}

export default App;



