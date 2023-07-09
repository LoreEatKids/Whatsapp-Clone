import { doc, onSnapshot } from "firebase/firestore";
import { useContext, useEffect, useState } from "react";
import { ChatContext } from "../context/ChatContext";
import { db } from "../firebase";
import "./styles/userinfos.scss";

export default function Userinfos({ user }) {
  const { data, chats, handleDeleteChat, setUseInfosMenuActive } = useContext(ChatContext);
  const [totalMessages, setTotalMessages] = useState([]);
  const [totalMedias, setTotalMedias] = useState([]);

  console.log(totalMedias)
  
  const handleCloseUserInfos = () => {
    setUseInfosMenuActive(false);
  }

  const handleViewMedias = () => {
    console.log(totalMedias);
  }

  useEffect(() => {
    const unSub = onSnapshot(doc(db, "chats", data.chatId), (doc) => {
      if(!doc.exists()) return;
      
      const messages = doc.data().messages;
      setTotalMessages(messages);
      const filteredArray = messages.filter((message) => message.img);
      setTotalMedias(filteredArray);
    });

    return () => unSub();
  }, []) // get data from firebase

  const handleViewImg = () => {}

  const mediasPreviewEl = totalMedias.slice(0, 3).map(media => {
    return (
      <img src={media.img} alt={media?.text} key={media.id} />
    )
  })

  return (
    <div className="userinfos_container">

        <header>
            <svg onClick={handleCloseUserInfos} viewBox="0 0 24 24" height="24" width="24" fill="currentColor"><path d="M19.6004 17.2L14.3004 11.9L19.6004 6.60005L17.8004 4.80005L12.5004 10.2L7.20039 4.90005L5.40039 6.60005L10.7004 11.9L5.40039 17.2L7.20039 19L12.5004 13.7L17.8004 19L19.6004 17.2Z"></path></svg>
            <h1 className="title">User's Infos</h1>
        </header>

        <div className="user_pfp_container flex">
            <img src={user.photoURL} alt={user.displayName} onClick={handleViewImg} />
        </div>

        <div className="user_username flex">
            <h1>{user.displayName}</h1>
        </div>
        
        <div className="user_messages">
          <div className="user_messages_container medias d-f" onClick={handleViewMedias}>

            <div className="medias_container">
              <div className="user_messages_container_svg d-f">
                <p>Media, link and documents</p>
                <div className="d-f">
                  <p>{totalMedias.length}</p>
                  <svg viewBox="0 0 10 21" height="21" width="10"><path fill="currentColor" d="M1,15.75l5.2-5.2L1,5.35l1.5-1.5l6.5,6.7l-6.6,6.6L1,15.75z"></path></svg>
                </div>
              </div>
             {totalMedias.length > 0 && <div className="medias_container-imgs d-f">
                {mediasPreviewEl}
              </div>}
            </div>

          </div>
          <div className="user_messages_container d-f">
            <p>Total Messages:</p>
            <p>{totalMessages.length}</p>
          </div>
        </div>

        <div className="user_controls">

          <div className="user_control d-f" onClick={() => handleDeleteChat(Object.entries(chats).find((chat) => chat[0] === data.chatId))}>
            <svg viewBox="0 0 24 24" height="24" width="24"><path fill="currentColor" d="M6,18c0,1.1,0.9,2,2,2h8c1.1,0,2-0.9,2-2V6H6V18z M19,3h-3.5l-1-1h-5l-1,1H5v2h14V3z"></path></svg>
            <h1>Delete Chat</h1>
          </div>

        </div>
    </div>
  );
};
