import { createContext, useContext, useEffect, useReducer, useState } from "react";
import { INITIAL_STATE, chatReducer } from "../hooks/chatReducer";
import { ACTION_TYPES } from "../hooks/postActionTypes";
import { AuthContext } from "./AuthContext";

export const ChatContext = createContext();

export const ChatContextProvider = ({ children }) => {
  const { currentUser } = useContext(AuthContext);
  const [imgModalVisible, setImgModalVisible] = useState([false, ""]);
  const [img, setImg] = useState(null);

  useEffect(() => {
    dispatch({ type: ACTION_TYPES.RESET_CHAT });
  }, [currentUser]);

  const [state, dispatch] = useReducer(
    (state, action) => chatReducer(state, action, currentUser),
    INITIAL_STATE
  );

  return (
    <ChatContext.Provider value={{ data: state, dispatch, imgModalVisible, setImgModalVisible, img, setImg }}>
      {children}
    </ChatContext.Provider>
  );
};