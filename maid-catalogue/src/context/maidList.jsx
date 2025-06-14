import { createContext, useContext, useState } from 'react';

// 1️⃣ Create the context
export const MaidContext = createContext();

// 2️⃣ Create the provider component
export const MaidContextProvider = ({ children }) => {
  const [maidList, setMaidList] = useState([]);

  return (
    <MaidContext.Provider value={{ maidList, setMaidList }}>
      {children}
    </MaidContext.Provider>
  );
};

// 3️⃣ Hook for easy access
export const useMaidContext = () => useContext(MaidContext);

