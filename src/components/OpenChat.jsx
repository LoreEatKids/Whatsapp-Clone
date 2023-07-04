import { useContext, useEffect, useRef, useState } from "react";
import { AuthContext } from "../context/AuthContext";
import { ChatContext } from "../context/ChatContext";
import Messages from "./Messages";
import NoOpenChat from "./NoOpenChat";
import "./styles/OpenChat.scss";

export default function Chat() {
    const {data, setImgModalVisible, setImg} = useContext(ChatContext);
    const {currentUser} = useContext(AuthContext);
    
    const [showContactInfo, setShowContactInfo] = useState(false);
    const [isLoading, setIsLoading] = useState(true);
    const [imgDragModal, setImgDragModal] = useState(false);

    const lastMessageRef = useRef(null);
    const mainRef = useRef(null);

    const chatDataLenght = Object.entries(data.user)?.length;
    const groupDataLenght = Object.entries(data.group)?.length;

    useEffect(() => {
      setShowContactInfo(true);
      const timer = setTimeout(() => {
        setShowContactInfo(false);
      }, 2000);

      return () => clearTimeout(timer);
    }, [data.chatId]);

    useEffect(() => {
      if (chatDataLenght !== 0 || groupDataLenght) {
        setIsLoading(false);

        if (lastMessageRef.current) {
          lastMessageRef.current.scrollIntoView({ behavior: "smooth" });
        }
      }
    }, [data.chatId]);

    const handleDrop = (event) => {
      event.preventDefault();
      setImgDragModal(false);
      const dataTransfer = event.dataTransfer;

      if (dataTransfer.files && dataTransfer.files.length > 0) {
        const file = dataTransfer.files[0];
        setImg(file);
        setImgModalVisible([true, URL.createObjectURL(file)]);
      }
    };

    const handleDragOver = (event) => {
      event.preventDefault();
      if (
        event.dataTransfer.items &&
        event.dataTransfer.items.length > 0 &&
        event.dataTransfer.items[0].type.startsWith("image/")
      ) {
        setImgDragModal(true);
      }
    };

    const handleDragLeave = () => {
      setImgDragModal(false);
    } 
    
    return (
      <main
        className="chat"
        ref={mainRef}
        onDrop={handleDrop}
        onDragOver={handleDragOver}
        onDragLeave={handleDragLeave}
      >
        {(chatDataLenght !== 0 || groupDataLenght !== 0) && !isLoading ? (
          <header className="d-f s-b">
            {chatDataLenght !== 0 && (
              <div className="pfp_container d-f">
                <img src={data.user.photoURL} alt="" className="pfp"></img>
                <div className="user_infos">
                  <h1>{data.user?.displayName}</h1>
                  {showContactInfo && (
                    <p className="infos">clicca qui per info contatto</p>
                  )}
                </div>
              </div>
            )}

            {groupDataLenght !== 0 && (
              <div className="pfp_container d-f">
                <img src={data.group.groupImg} className="pfp" />
                <div className="user_infos">
                  <h1>{data.group.groupName}</h1>
                  {showContactInfo && (
                    <p className="infos">clicca qui per info contatto</p>
                  )}
                  {!showContactInfo && (
                    <p className="infos">
                      {data.group.groupUsers.map((user, index) => (
                        <span key={user.uid}>
                          {user.displayName !== currentUser.displayName ? user.displayName : "you"}
                          {index !== data.group.groupUsers.length - 1 ? ", " : ""}
                        </span>
                      ))}
                    </p>
                  )}
                </div>
              </div>
            )}

            <div className="icons_container d-f">
              <svg viewBox="0 0 24 24" height="24" width="24">
                <path
                  fill="currentColor"
                  d="M15.9,14.3H15L14.7,14c1-1.1,1.6-2.7,1.6-4.3c0-3.7-3-6.7-6.7-6.7S3,6,3,9.7 s3,6.7,6.7,6.7c1.6,0,3.2-0.6,4.3-1.6l0.3,0.3v0.8l5.1,5.1l1.5-1.5L15.9,14.3z M9.7,14.3c-2.6,0-4.6-2.1-4.6-4.6s2.1-4.6,4.6-4.6 s4.6,2.1,4.6,4.6S12.3,14.3,9.7,14.3z"
                ></path>
              </svg>
              <svg viewBox="0 0 24 24" height="24" width="24">
                <path
                  fill="currentColor"
                  d="M12,7c1.104,0,2-0.896,2-2c0-1.105-0.895-2-2-2c-1.104,0-2,0.894-2,2 C10,6.105,10.895,7,12,7z M12,9c-1.104,0-2,0.894-2,2c0,1.104,0.895,2,2,2c1.104,0,2-0.896,2-2C13.999,9.895,13.104,9,12,9z M12,15 c-1.104,0-2,0.894-2,2c0,1.104,0.895,2,2,2c1.104,0,2-0.896,2-2C13.999,15.894,13.104,15,12,15z"
                ></path>
              </svg>
            </div>
          </header>
        ) : (
          <NoOpenChat />
        )}

        <div className={`drag_menu d-f ${imgDragModal ? "active" : ""}`}>
          <h1>Drag Your File Here</h1>
        </div>

        {(chatDataLenght !== 0 || groupDataLenght !== 0) &&
          !isLoading &&
          !imgDragModal && <Messages lastMessageRef={lastMessageRef} />}
      </main>
    );
};
