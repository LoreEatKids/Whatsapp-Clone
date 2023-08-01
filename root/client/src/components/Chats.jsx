import { doc, onSnapshot } from "firebase/firestore";
import { useContext, useEffect, useState } from "react";
import { AuthContext } from "../context/AuthContext";
import { ChatContext } from "../context/ChatContext";
import { db } from "../firebase";
import Chat from "./Chat";
import "./styles/chats.scss";

export default function Chats() {
  const { currentUser } = useContext(AuthContext);
  const { dispatch, chats, setChats, filterChatActive } = useContext(ChatContext);

  useEffect(() => {
    const getChats = () => {
      const unsub = onSnapshot(doc(db, "userChats", currentUser.uid), (doc) => {
        const data = doc.data();
        if (data) {
          setChats(data);
        }
      });

      return () => {
        unsub();
      };
    };

    currentUser.uid && getChats();
  }, [currentUser.uid, dispatch]);

  return (
    <div className="chats_container">
      {Object.entries(chats)
        ?.sort((a, b) => filterChatActive ? a[1].date - b[1].date : b[1].date - a[1].date)
        .map((chat) => (
          <Chat key={chat[0]} chat={chat} />
        ))}
    </div>
  );
}
