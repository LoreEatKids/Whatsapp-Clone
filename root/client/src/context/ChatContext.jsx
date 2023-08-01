import { deleteDoc, deleteField, doc, updateDoc } from "firebase/firestore";
import {
  createContext,
  useContext,
  useEffect,
  useReducer,
  useState,
} from "react";
import { toast } from "react-hot-toast";
import { db } from "../firebase";
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
  const [userInfosMenuActive, setUseInfosMenuActive] = useState(false);
  const [userInfosMediaMenuActive, setUserInfosMediaMenuActive] = useState(false);
  const [filterChatActive, setFilterChatActive] = useState(false);

  const handleDeleteChat = async (selectedChat) => {
    const selectedChatId = selectedChat[0];
    const currUserRef = doc(db, "userChats", currentUser.uid);
    const userRef = doc(db, "userChats", selectedChat[1].userInfo.uid);

    try {
      await deleteDoc(doc(db, "chats", selectedChatId));
      await updateDoc(currUserRef, {
        [selectedChatId]: deleteField(),
      });
      await updateDoc(userRef, {
        [selectedChatId]: deleteField(),
      });

      dispatch({ type: "RESET_CHAT" });
    } catch (error) {
      console.error(error);
      toast.error("Something Went Wrong");
    }
  };

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
        chats, setChats,
        handleDeleteChat,
        userInfosMenuActive, setUseInfosMenuActive,
        userInfosMediaMenuActive, setUserInfosMediaMenuActive,
        filterChatActive, setFilterChatActive
      }}>
      {children}
    </ChatContext.Provider>
  );
};
