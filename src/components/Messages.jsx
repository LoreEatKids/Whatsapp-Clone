import { doc, onSnapshot } from "firebase/firestore";
import { useContext, useEffect, useRef, useState } from "react";
import { ChatContext } from "../context/ChatContext";
import { db } from "../firebase";
import ChatInputs from "./ChatInputs";
import ContextMenu from "./ContextMenu";
import Message from "./Message";
import "./styles/messages.scss";

export default function Messages() {
  const { data } = useContext(ChatContext);
  const [messages, setMessages] = useState([]);
  const [showContextMenu, setShowContextMenu] = useState(false);
  const [x, setX] = useState(0);
  const [y, setY] = useState(0);

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
    setX(e.clientX); setY(e.clientY);
  };

  return (
    <>
      <main className="messages_container" onContextMenu={handleContextMenu}>
        <div id="messages_container">
          {messages.map((m) => (
            <Message message={m} key={m.id} />
          ))}
        </div>
        <div className="background"></div>
      </main>
      <ChatInputs />
      {showContextMenu && <ContextMenu pos={{ x, y }} onClose={() => setShowContextMenu(false)} />}
    </>
  );
};
