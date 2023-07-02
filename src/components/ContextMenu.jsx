import { useContext, useEffect, useRef } from "react";
import { ChatContext } from "../context/ChatContext";
import "./styles/contextmenu.scss";

export default function ContextMenu({ pos, onClose }) {
  console.log(pos)
  const ref = useRef();
  const { dispatch } = useContext(ChatContext);

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

  const handleCloseChat = () => dispatch({ type: "RESET_CHAT" });

  return (
    <div className="contextmenu" ref={ref}>
      <ul>
        <li>Contact's Infos</li>
        <li onClick={handleCloseChat}>Close conversation</li>
        <li>Block user</li>
      </ul>
    </div>
  );
}
