import { doc, onSnapshot } from "firebase/firestore";
import { useContext, useEffect, useRef, useState } from "react";
import { ChatContext } from "../context/ChatContext";
import { db } from "../firebase";
import ChatInputs from "./ChatInputs";
import ContextMenu from "./ContextMenu";
import ImgModal from "./ImgModal";
import Message from "./Message";
import "./styles/messages.scss";

export default function Messages() {
  const { data, imgModalVisible } = useContext(ChatContext);
  const [messages, setMessages] = useState([]);
  const [showContextMenu, setShowContextMenu] = useState(false);
  const [menuPosition, setMenuPosition] = useState({ x: 0, y: 0 });

  useEffect(() => {
    const unSub = onSnapshot(doc(db, "chats", data.chatId), (doc) => {
      doc.exists() && setMessages(doc.data().messages);
    });

    return () => {
      unSub();
    };
  }, [data.chatId]);

  const handleContextMenu = (e) => {
    e.preventDefault();
    setShowContextMenu(true);
    const menuX = e.clientX - e.currentTarget.getBoundingClientRect().left;
    const menuY = e.clientY - e.currentTarget.getBoundingClientRect().top;
    setMenuPosition({ x: menuX, y: menuY });
  };

  const handleMouseClick = () => {
    setShowContextMenu(false);
  };

  return (
    <>
      <main
        className="messages_container"
        onContextMenu={handleContextMenu}
        onClick={handleMouseClick}
      >
        <div id="messages_container">
          {messages.map((m) => (
            <Message message={m} key={m.id} />
          ))}
        </div>
        <div className="background"></div>
        {imgModalVisible[0] && <ImgModal img={imgModalVisible[1]} />}
      </main>
      <ChatInputs />
      {showContextMenu && (
        <ContextMenu
          pos={menuPosition}
          onClose={() => setShowContextMenu(false)}
        />
      )}
    </>
  );
}
