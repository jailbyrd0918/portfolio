import { ReactNode, createContext, useContext, useState } from "react";

interface Context {
  is24HourFormat: boolean;
}

interface ContextProps {
  context: Context;

  updateContext: (newContext: Partial<Context>) => void;
}

const MainContext = createContext<ContextProps | null>(null);

export const MainContextProvider = ({children} : {children: ReactNode}) => {
  const storedContext = JSON.parse(localStorage.getItem("jailbyrd918_portfolio")!) || {
    is24HourFormat: true,
  };

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

