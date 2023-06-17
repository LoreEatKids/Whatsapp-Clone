import { doc, onSnapshot } from "firebase/firestore";
import { useContext, useEffect, useState } from "react";
import { AuthContext } from "../context/AuthContext";
import { ChatContext } from "../context/ChatContext";
import { db } from "../firebase";
import "./styles/chats.scss";

export default function Chats() {
  const { currentUser } = useContext(AuthContext);
  const { dispatch } = useContext(ChatContext);
  const [chats, setChats] = useState([]);

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

  const handleSelect = user => {
    dispatch({ type: "CHANGE_USER", payload: user });
  }

  Object.entries(chats)?.sort((a, b) => b[1].date - a[1].date).map((chat) => {
    console.log(chat[1])
  })

  return (
    <div className="chats_container">
      {Object.entries(chats)?.sort((a,b) => b[1].date - a[1].date).map((chat) => (
        <div className="chat d-f" key={chat[0]} onClick={() => handleSelect(chat[1].userInfo)}>
          <div className="chat__img_container">
            <img className="pfp" src={chat[1].userInfo.photoURL} alt="pfp" />
          </div>
          <div className="chat__infos d-f s-b">
            <div className="chat__preview">
              <h1>{chat[1].userInfo.username}</h1>
              <p>{chat[1].lastMessage?.text}</p>
            </div>
            <div className="chat__time">12:00</div>
          </div>
        </div>
      ))}
    </div>
  );
}