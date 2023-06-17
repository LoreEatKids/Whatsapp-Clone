import { doc, onSnapshot } from "firebase/firestore";
import { useContext, useEffect, useState } from "react";
import { ChatContext } from "../context/ChatContext";
import { db } from "../firebase";
import ChatInputs from "./ChatInputs";
import Message from "./Message";
import "./styles/messages.scss";

export default function Messages() {
    const {data} = useContext(ChatContext);
    const [messages, setMessages] = useState([]);

    useEffect(() => {
      const unSub = onSnapshot(doc(db, "chats", data.chatId), (doc) => {
        doc.exists() && setMessages(doc.data().messages);
      });

      return () => {
        unSub();
      };
    }, [data.chatId]);

    return (
      <>
        <main className="messages_container">
          <div id="messages_container">
            {messages.map((m) => (
              <Message message={m} key={m.id} />
            ))}
          </div>
          <div className="background"></div>
        </main>
        <ChatInputs />
      </>
    );
};
