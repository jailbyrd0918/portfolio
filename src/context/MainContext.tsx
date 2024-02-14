import { ReactNode, createContext, useContext, useState } from "react";

interface Context {
  settings: {
    time: {
      is24HourFormat: boolean,
    },
  },
  navigation: {
    home: {
      navIndex: number,
      functionIndex: number,
      contentIndex: number
    },
  },
  data: {
    notifications: string[],
    profile: {
      username: string,
    },
  },
}

interface ContextProps {
  context: Context;
  updateContext: (newContext: Partial<Context>) => void;
}

const MainContext = createContext<ContextProps | null>(null);

const INIT_CONTEXT_VALUE = {
  settings: {
    time: {
      is24HourFormat: false,
    },
  },
  navigation: {
    home: {
      navIndex: 1,
      functionIndex: 0,
      contentIndex: 0,
    },
  },
  data: {
    notifications: [],
    profile: {
      username: "",
    },
  },
};

export const MainContextProvider = ({children} : {children: ReactNode}) => {
  const storedContext = JSON.parse(localStorage.getItem("jailbyrd918_portfolio")!) || INIT_CONTEXT_VALUE;

  const [context, setContext] = useState(storedContext);

  const updateContext = (newContext: Partial<Context>) => {
    const updatedContext = { ...context, ...newContext };
    setContext(updatedContext);
    
    localStorage.setItem("jailbyrd918_portfolio", JSON.stringify(updatedContext));
  }

  return (
    <MainContext.Provider value={{ context, updateContext }}>
      {children}
    </MainContext.Provider>
  );
};

export const useMainContext = () => {
  const context = useContext(MainContext);
  if (!context) {
    throw new Error('useMainContext must be used within MainContextProvider');
  }

  return context;
};

