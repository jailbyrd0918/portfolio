import ReactDOM from "react-dom/client";

import { MainContextProvider } from "./context/MainContext";
import App from "./App";

ReactDOM.createRoot(document.getElementById("root")!).render(
  <MainContextProvider>
    <App />
  </MainContextProvider>
);

