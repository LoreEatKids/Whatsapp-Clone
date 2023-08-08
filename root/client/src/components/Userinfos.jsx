import { doc, onSnapshot } from "firebase/firestore";
import { useContext, useEffect, useState } from "react";
import { AuthContext } from "../context/AuthContext";
import { ChatContext } from "../context/ChatContext";
import { ImgViewerContext } from "../context/ImgViewer";
import { db } from "../firebase";
import { MEDIA_PREVIEW_IMG_NUMBER, containsLink, getUserFromFirestore } from "../utilities/const";
import "./styles/userinfos.scss";

export default function Userinfos({ user }) {
  const {
    data,
    chats,
    handleDeleteChat,
    setUseInfosMenuActive,
    userInfosMediaMenuActive,
    setUserInfosMediaMenuActive,
  } = useContext(ChatContext);
  
  const { setImgInfos, setImgViewerIsActive } = useContext(ImgViewerContext);

  const { currentUser } = useContext(AuthContext);
  const [totalMessages, setTotalMessages] = useState([]);
  const [totalMedias, setTotalMedias] = useState([]);
  const [activeTab, setActiveTab] = useState("Medias");

  const [userDesc, setUserDesc] = useState("Loading...");
  
  const handleTabClick = (tabName) => {
    setActiveTab(tabName);
  };

  const handleCloseUserInfos = () => {
    setUseInfosMenuActive(false);
  }

  const handleActiveMediasMenu = () => {
    setUserInfosMediaMenuActive(true);
  }
  
  const handleCloseMediasMenu = () => {
    setUserInfosMediaMenuActive(false);
    setActiveTab("Medias");
  }
  
  useEffect(() => {
    const unsub = async () => {
      const userFromFirestore = await getUserFromFirestore(user);
      setUserDesc(userFromFirestore.desc);
    }

    unsub();
  }, []) // get user desc from firestore

  useEffect(() => {
    const unsub = onSnapshot(doc(db, "chats", data.chatId), (doc) => {
      if(!doc.exists()) return;
      const messages = doc.data().messages;
      setTotalMessages(messages);
      const filteredArray = messages.filter((message) => message.img).reverse();
      setTotalMedias(filteredArray);
    });

    return () => {
      unsub();
    }
  }, []) // get data messages from firebase

  const handleViewImg = (imgUrl) => {
    const user = {
      photoURL: data.user.photoURL,
      displayName: data.user.displayName,
    };

    if (imgUrl !== user.photoURL) {
      setImgInfos({
        user,
        img: { url: imgUrl },
        prevImgs: totalMedias.reverse(),
      });
    } else {
      setImgInfos({
        user,
        img: { url: imgUrl },
      });
    }

    setImgViewerIsActive(true);
  };

  const mediasPreviewEl = totalMedias.slice(0, MEDIA_PREVIEW_IMG_NUMBER).map(media => (
    <img src={media.img} alt={media?.text} key={media.id} onClick={() => handleViewImg(media.img)} />
  ))

  const mediasFilterEl = (mediaType) => {
    switch(mediaType) {
      case "Medias":
        return totalMedias.map((media) => (
          <li key={media.id}>
            <img src={media.img} alt={media?.text} width="128" height="128" onClick={() => handleViewImg(media.img)} />
          </li>
        ))
      case "Links":
        return totalMessages.filter(message => containsLink(message?.text).hasLink).map((message) => {
        const messageOwner = message.senderId === currentUser.uid ? "owner" : "user";
        const messageLink = containsLink(message?.text);
        
        return (
          <div className={`link_container ${messageOwner}`}>
             <div className={`message_svg ${messageOwner}`}>
                <svg
                  viewBox="0 0 8 13"
                  className={messageOwner}
                  height="13"
                  width="8"
                >
                  <path
                    opacity="0.13"
                    d="M5.188,1H0v11.193l6.467-8.625 C7.526,2.156,6.958,1,5.188,1z"
                  ></path>
                  <path
                    fill="currentColor"
                    d="M5.188,0H0v11.193l6.467-8.625C7.526,1.156,6.958,0,5.188,0z"
                  ></path>
                </svg>
              </div>
            <a className={`link_item ${messageOwner}`} key={message.id} href={messageLink.link} target="_blank">
              {(message.text).replace(messageLink.link, "")} &nbsp;
              <span className="link">{messageLink.link}</span>
            </a>
          </div>
        )})
    }
  };

  return (
    <div className="userinfos_container">
      <header>
        <svg
          onClick={handleCloseUserInfos}
          viewBox="0 0 24 24"
          height="24"
          width="24"
          fill="currentColor"
        >
          <path d="M19.6004 17.2L14.3004 11.9L19.6004 6.60005L17.8004 4.80005L12.5004 10.2L7.20039 4.90005L5.40039 6.60005L10.7004 11.9L5.40039 17.2L7.20039 19L12.5004 13.7L17.8004 19L19.6004 17.2Z"></path>
        </svg>
        <h1 className="title">User's Infos</h1>
      </header>

      <div className="user_pfp_container flex">
        <img
          src={user.photoURL}
          alt={user.displayName}
          onClick={() => handleViewImg(data.user.photoURL)}
        />
      </div>

      <div className="user_username flex">
        <h1>{user.displayName}</h1>
      </div>

      <div className="user_infos">
        <h1>Infos</h1>
        <p>{userDesc}</p>
      </div>

      <div className="user_messages">
        <div className="user_messages_container medias d-f">
          <div className="medias_container">
            <div
              className="user_messages_container_svg d-f"
              onClick={handleActiveMediasMenu}
            >
              <p>Media, link and documents</p>
              <div className="d-f">
                <p>{totalMedias.length}</p>
                <svg viewBox="0 0 10 21" height="21" width="10">
                  <path
                    fill="currentColor"
                    d="M1,15.75l5.2-5.2L1,5.35l1.5-1.5l6.5,6.7l-6.6,6.6L1,15.75z"
                  ></path>
                </svg>
              </div>
            </div>
            {totalMedias.length > 0 && (
              <div className="medias_container-imgs d-f">{mediasPreviewEl}</div>
            )}
          </div>
        </div>
        <div className="user_messages_container d-f">
          <p>Total Messages:&nbsp;</p>
          <p>{totalMessages.length}</p>
        </div>
      </div>

      <div className="user_controls">
        <div
          className="user_control d-f"
          onClick={() =>
            handleDeleteChat(
              Object.entries(chats).find((chat) => chat[0] === data.chatId)
            )
          }
        >
          <svg viewBox="0 0 24 24" height="24" width="24">
            <path
              fill="currentColor"
              d="M6,18c0,1.1,0.9,2,2,2h8c1.1,0,2-0.9,2-2V6H6V18z M19,3h-3.5l-1-1h-5l-1,1H5v2h14V3z"
            ></path>
          </svg>
          <h1>Delete Chat</h1>
        </div>
      </div>

      {userInfosMediaMenuActive && (
        <div className="userinfos_media_container">
          <header>
            <svg
              onClick={handleCloseMediasMenu}
              viewBox="0 0 24 24"
              height="24"
              width="24"
            >
              <path
                fill="currentColor"
                d="M12,4l1.4,1.4L7.8,11H20v2H7.8l5.6,5.6L12,20l-8-8L12,4z"
              ></path>
            </svg>
          </header>

          <article className="submenu d-f">
            <div
              className={`tab d-f ${activeTab === "Medias" ? "active" : ""}`}
              onClick={() => handleTabClick("Medias")}
            >
              Medias
            </div>
            <div
              className={`tab d-f ${activeTab === "Documents" ? "active" : ""}`}
              onClick={() => handleTabClick("Documents")}
            >
              Documents
            </div>
            <div
              className={`tab d-f ${activeTab === "Links" ? "active" : ""}`}
              onClick={() => handleTabClick("Links")}
            >
              Link
            </div>
            <div
              className={`tab d-f ${activeTab === "Products" ? "active" : ""}`}
              onClick={() => handleTabClick("Products")}
            >
              Products
            </div>
          </article>

          <main>
            {activeTab === "Medias" ? (
              <ul>{mediasFilterEl(activeTab)}</ul>
            ) : (
              mediasFilterEl(activeTab)
            )}
          </main>

          {totalMedias.length === 0 && (
            <div className="no_medias">
              <h1>No Medias</h1>
            </div>
          )}
        </div>
      )}
    </div>
  );
};