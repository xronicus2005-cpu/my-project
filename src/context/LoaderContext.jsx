import { createContext, useContext, useState } from "react";

const LoaderContext = createContext();

export const LoaderProvider = ({ children }) => {
  const [count, setCount] = useState(0);

  const start = () => setCount((c) => c + 1);
  const stop = () => setCount((c) => Math.max(c - 1, 0));

  return (
    <LoaderContext.Provider
      value={{ loading: count > 0, start, stop }}
    >
      {children}
    </LoaderContext.Provider>
  );
};

export const useLoaderContext = () => useContext(LoaderContext);
