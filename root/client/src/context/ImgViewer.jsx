import { createContext, useEffect, useState } from "react";

export const ImgViewerContext = createContext(null);

export const ImgViewProvider = ({ children }) => {
  const [imgViewerIsActive, setImgViewerIsActive] = useState(false);
  const [imgInfos, setImgInfos] = useState({});
  const [imgErr, setImgErr] = useState("");

  const resetImgViewerStates = () => {
    setImgInfos({});
    setImgErr("");
  };

  return (
    <ImgViewerContext.Provider
      value={{
        imgViewerIsActive,
        setImgViewerIsActive,
        imgErr,
        setImgErr,
        imgInfos,
        setImgInfos,
        resetImgViewerStates,
      }}
    >
      {children}
    </ImgViewerContext.Provider>
  );
};
