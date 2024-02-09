import ReactDOM from "react-dom/client";

import { SettingsProvider } from "./contexts/SettingsContext";
import App from "./App";

ReactDOM.createRoot(document.getElementById("root")!).render(
  <App />
);

