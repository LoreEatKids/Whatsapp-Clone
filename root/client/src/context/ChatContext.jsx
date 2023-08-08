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
  const [imgModalVisible, setImgModalVisible] = useState([false, ""]); // is active and imgUrl to display
  const [selectedUsers, setSelectedUser] = useState([]);

  const [img, setImg] = useState(null);
  const [chats, setChats] = useState([]);
  const [groupMembersEl, setGroupMemberEl] = useState([]);

  const [active, setActive] = useState(false);

  const [userInfosMenuActive, setUseInfosMenuActive] = useState(false);
  const [userInfosMediaMenuActive, setUserInfosMediaMenuActive] =
    useState(false);

  const [groupInfosMenuActive, setGroupInfosMenuActive] = useState(false);
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
      toast.success("Successfully deleted the chat");
    } catch (error) {
      console.error(error);
      toast.error("Something Went Wrong");
    }
  };

  const handleDeleteGroup = async (group) => {
    const [groupId, groupInfos] = group;
    const groupUsersArr = groupInfos.groupUsers;
    const updatedUsers = groupUsersArr.filter(
      (user) => user.uid !== currentUser.uid
    );

    const currUserRef = doc(db, "userChats", currentUser.uid);
    const groupChatRef = doc(db, "chats", groupId);

    try {
      if (groupUsersArr.length === 1) {
        try {
          await deleteDoc(groupChatRef);

          const groupUserRef = doc(db, "userChats", groupUsersArr[0].uid);
          await updateDoc(groupUserRef, {
            [groupId]: deleteField(),
          });
        } catch (error) {
          throw new Error(error);
        }
        
        dispatch({ type: "RESET_CHAT" });
        toast.success("Successfully left the group");
        return;
      }

      groupUsersArr.forEach(async (user) => {
        const userRef = doc(db, "userChats", user.uid);

        if (user.uid === currentUser.uid) {
          try {
            await updateDoc(currUserRef, {
              [groupId]: deleteField(),
            });
          } catch (error) {
            throw new Error(error);
          }

          dispatch({ type: "RESET_CHAT" });
          return;
        }

        try {
          await updateDoc(userRef, {
            [groupId + ".groupUsers"]: updatedUsers,
          });

          dispatch({ type: "RESET_CHAT" });
        } catch (error) {
          throw new Error(error);
        }
      });
    } catch (error) {
      console.error(error);
      toast.error("Something went wrong, please try again.");
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
        chats,
        setChats,
        handleDeleteChat,
        handleDeleteGroup,
        userInfosMenuActive,
        setUseInfosMenuActive,
        userInfosMediaMenuActive,
        setUserInfosMediaMenuActive,
        groupInfosMenuActive,
        setGroupInfosMenuActive,
        filterChatActive,
        setFilterChatActive,
        groupMembersEl,
        setGroupMemberEl,
      }}
    >
      {children}
    </ChatContext.Provider>
  );
};
