import { useContext, useEffect, useRef } from "react";
import { ChatContext } from "../context/ChatContext";
import "./styles/contextmenu.scss";

export default function ContextMenu({ pos, onClose }) {
  const ref = useRef();
  const { dispatch, data, chats, setUseInfosMenuActive, userInfosMenuActive, setGroupInfosMenuActive, groupInfosMenuActive, handleDeleteGroup} = useContext(ChatContext);

  const chatDataLenght = Object.entries(data.user)?.length;
  const groupDataLenght = Object.entries(data.group)?.length;

  const handleDeleteGroupEvent = async () => {
    await handleDeleteGroup(Object.entries(chats).find((chat) => chat[0] === data.chatId));
  }

  useEffect(() => {
    const setContextMenuPos = () => {
      const menuWidth = ref.current.offsetWidth;
      const menuHeight = ref.current.offsetHeight;
      const containerWidth = ref.current.parentNode.offsetWidth;
      const containerHeight = ref.current.parentNode.offsetHeight;

      let left = pos.x + 10;
      let top = pos.y + 70;

      if (left + menuWidth > containerWidth) {
        left = containerWidth - menuWidth;
      }

      // Verifica se il menu supera i limiti del container in verticale
      if (top + menuHeight > containerHeight) {
        top = containerHeight - menuHeight;
      }

      ref.current.style.left = `${left}px`;
      ref.current.style.top = `${top}px`;
    };

    setContextMenuPos();

    const handleContextMenuClose = (e) => {
      if (!ref.current.contains(e.target)) {
        onClose();
      }
    };

    document.addEventListener("click", handleContextMenuClose);
    return () => document.removeEventListener("click", handleContextMenuClose);
  }, [pos]);

  const handleCloseChat = () => {
    dispatch({ type: "RESET_CHAT" });
    onClose();
  }
  const handleActiveUserInfos = () => {
    !userInfosMenuActive && setUseInfosMenuActive(true);
    onClose();
  }

  const handleActiveGroupInfos = () => {
    !groupInfosMenuActive && setGroupInfosMenuActive(true);
    onClose();
  }

  return (
    <div className="contextmenu" ref={ref}>
      <ul>
        <li onClick={groupDataLenght > 0 ? handleActiveGroupInfos : handleActiveUserInfos}>Contact's Infos</li>
        <li onClick={handleCloseChat}>Close conversation</li>
        {groupDataLenght > 0 ? <li onClick={handleDeleteGroupEvent}>Exit Group</li> : <li>Block user</li>}
      </ul>
    </div>
  );
}
