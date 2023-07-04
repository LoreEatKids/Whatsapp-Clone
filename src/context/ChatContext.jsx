import {
  createContext,
  useContext,
  useEffect,
  useReducer,
  useState,
} from "react";
import { INITIAL_STATE, chatReducer } from "../hooks/chatReducer";
import { ACTION_TYPES } from "../hooks/postActionTypes";
import { AuthContext } from "./AuthContext";

export const ChatContext = createContext();

export const ChatContextProvider = ({ children }) => {
  const { currentUser } = useContext(AuthContext);
  const [imgModalVisible, setImgModalVisible] = useState([false, ""]);
  const [active, setActive] = useState(false);
  const [selectedUsers, setSelectedUser] = useState([]);
  const [img, setImg] = useState(null);
  const [chats, setChats] = useState([]);

  useEffect(() => {
    dispatch({ type: ACTION_TYPES.RESET_CHAT });
  }, [currentUser]);

  const [state, dispatch] = useReducer(
    (state, action) => chatReducer(state, action, currentUser),
    INITIAL_STATE
  );

  return (
    <ChatContext.Provider
      value={{
        data: state,
        dispatch,
        imgModalVisible,
        setImgModalVisible,
        img,
        setImg,
        active,
        setActive,
        selectedUsers,
        setSelectedUser,
        chats, setChats
      }}
    >
      {children}
    </ChatContext.Provider>
  );
};
