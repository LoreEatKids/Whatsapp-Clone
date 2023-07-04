import { doc, onSnapshot } from "firebase/firestore";
import { useContext, useEffect, useState } from "react";
import { AuthContext } from "../context/AuthContext";
import { ChatContext } from "../context/ChatContext";
import { db } from "../firebase";
import "./styles/chats.scss";

export default function Chats() {
  const { currentUser } = useContext(AuthContext);
  const { dispatch, data, chats, setChats } = useContext(ChatContext);

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

  const handleSelect = (user) => {
    dispatch({ type: "CHANGE_USER", payload: user });
  };

  const handleGroupSelect = (group) => {
    dispatch({ type: "CHANGE_GROUP", payload: group });
  }

  const getDate = (date) => {
    const messageDate = date.toDate();

    const today = new Date();
    today.setHours(0, 0, 0, 0);

    const yesterday = new Date(today);
    yesterday.setDate(yesterday.getDate() - 1)

    if (messageDate >= today) {
      const hours = messageDate.getHours();
      const minutes = messageDate.getMinutes();
      const formattedTime = `${hours.toString().padStart(2, "0")}:${minutes
        .toString()
        .padStart(2, "0")}`;
      return `Today ${formattedTime}`;
    }
    // Se la data dei messaggi è ieri, restituisci "yesterday"
    else if (messageDate >= yesterday) {
      return "Yesterday";
    }
    // Se il messaggio è più vecchio di 7 giorni, restituisci una data formattata
    else {
      const giorno = messageDate.getDate();
      const mese = messageDate.getMonth() + 1;
      const anno = messageDate.getFullYear();
      return `${giorno}/${mese}/${anno}`;
    }
  };

  return (
    <div className="chats_container">
      {Object.entries(chats)
        ?.sort((a, b) => b[1].date - a[1].date)
        .map((chat) => {

          if (chat[1].type === "group") {
            return (
              <div key={chat[0]} className={`chat d-f ${data.chatId === chat[0] ? "selected" : ""}` }onClick={() => handleGroupSelect(chat[1])} >

                <div className="chat__img_container">
                  <img
                    className="pfp"
                    src={chat[1].groupImg !== "" ? chat[1].groupImg : ""} // TODO handle no group img
                    alt="pfp"
                  />
                </div>

                <div className="chat__infos d-f s-b">
                  <div className="chat__preview">

                    <h1>{chat[1].groupName}</h1>
                    <p className={`${chat[1].lastMessage?.text === "Photo" ? "photo" : ""}`}>
                      {chat[1].lastMessage?.text}
                    </p>

                  </div>
                  <div className="chat__time">
                    {chat[1].date !== null && getDate(chat[1].date)}
                  </div>
                </div>
              </div>
            );
          }

            return (
              <div
                className={`chat d-f ${
                  data.chatId === chat[0] ? "selected" : ""
                }`}
                key={chat[0]}
                onClick={() => handleSelect(chat[1].userInfo)}
              >
                <div className="chat__img_container">
                  <img
                    className="pfp"
                    src={chat[1].userInfo.photoURL}
                    alt="pfp"
                  />
                </div>
                <div className="chat__infos d-f s-b">
                  <div className="chat__preview">
                    <h1>{chat[1].userInfo.displayName}</h1>
                    <p
                      className={`${
                        chat[1].lastMessage?.text === "Photo" ? "photo" : ""
                      }`}
                    >
                      {chat[1].lastMessage?.text}
                    </p>
                  </div>
                  <div className="chat__time">
                    {chat[1].date !== null && getDate(chat[1].date)}
                  </div>
                </div>
              </div>
            );
        })}
    </div>
  );
}
