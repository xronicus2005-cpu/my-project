import { useEffect } from "react";
import { injectLoader } from "../api/axios";
import { useLoaderContext } from "../context/LoaderContext";

export const useInitLoader = () => {
  const { start, stop } = useLoaderContext();

  useEffect(() => {
    injectLoader(start, stop);
  }, [start, stop]);
};
