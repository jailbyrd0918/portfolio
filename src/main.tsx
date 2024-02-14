import ReactDOM from "react-dom/client";
import { BrowserRouter } from "react-router-dom";

import { MainContextProvider } from "./context/MainContext";
import App from "./App";

ReactDOM.createRoot(document.getElementById("root")!).render(
  <BrowserRouter>
    <MainContextProvider>
      <App />
    </MainContextProvider>
  </BrowserRouter>
);
