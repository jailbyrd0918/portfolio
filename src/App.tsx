import { useState } from "react";
import { Route, Routes, useLocation, useNavigate } from "react-router-dom";
import { CSSTransition, SwitchTransition } from "react-transition-group";

import {
  About,
  Contact,
  Home,
  Notifications,
  Profile,
  Settings,
  Skills,
  Works,
} from "./pages";

import "./styles/App.css";

const App = () => {
  const location = useLocation();
  const navigate = useNavigate();
  
  const [transitionClass, setTransitionClass] = useState("");
  
  const getRouteTransitionClass = (currLoc: string, nextLoc: string) => {
    const pathSegments = currLoc.split("/");
    const nextPathSegments = nextLoc.split("/");
    
    const numSegments = pathSegments.length;
    const nextNumSegments = nextPathSegments.length;

    if (numSegments > nextNumSegments) {
      return "page-transition-outer";
    }
    else if (numSegments < nextNumSegments) {
      return "page-transition-inner";
    }
    else {
      if (pathSegments[pathSegments.length - 1].length < nextPathSegments[pathSegments.length - 1].length) {
        return "page-transition-inner";
      }
      else {
        return "page-transition-outer";
      }
    }
  };

  const handleRouteNavigation = (nextRoute: string) => {
    setTransitionClass(getRouteTransitionClass(location.pathname, nextRoute));
    navigate(nextRoute);
  }

  return (
    <div className="container">
      <SwitchTransition>
        <CSSTransition
          key={location.pathname}
          timeout={200}
          classNames={transitionClass}
          unmountOnExit
        >
          <Routes location={location}>
            <Route path="/" element={<Home handleRouteNavigation={handleRouteNavigation} />} />

            {/* functions */}
            <Route path="/notifications" element={<Notifications handleRouteNavigation={handleRouteNavigation} />} />
            <Route path="/profile" element={<Profile />} />
            <Route path="/settings" element={<Settings handleRouteNavigation={handleRouteNavigation} />} />

            {/* contents */}
            <Route path="/about" element={<About />} />
            <Route path="/works" element={<Works />} />
            <Route path="/skills" element={<Skills />} />
            <Route path="/contact" element={<Contact />} />
        </Routes>
        </CSSTransition>
      </SwitchTransition>
    </div>
  );
};

export default App;
