import { useContext, useEffect, useRef, useState } from "react";
import { AuthContext } from "../context/AuthContext";
import { ChatContext } from "../context/ChatContext";
import Messages from "./Messages";
import NoOpenChat from "./NoOpenChat";
import Userinfos from "./Userinfos";
import "./styles/OpenChat.scss";

export default function Chat() {
    const {
      data,
      setImgModalVisible,
      setImg,
      userInfosMenuActive,
      setUseInfosMenuActive,
      setUserInfosMediaMenuActive,
    } = useContext(ChatContext);
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
        setUserInfosMediaMenuActive(false);
      }, 2000);

      return () => {
        clearTimeout(timer);
        setUseInfosMenuActive(false);
      }
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

    const handleToggleUserInfos = () => {
      setUseInfosMenuActive(true);
    }
    
    return (
      <>
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
                <div
                  className="pfp_container d-f"
                  onClick={handleToggleUserInfos}
                >
                  <img src={data.user.photoURL} alt="" className="pfp"></img>
                  <div className="user_infos">
                    <h1>{data.user?.displayName}</h1>
                    {showContactInfo && (
                      <p className="infos">Click here to get this chat's infos</p>
                    )}
                  </div>
                </div>
              )}

              {groupDataLenght !== 0 && (
                <div className="pfp_container d-f">
                  {data.group.groupImg ? (
                    <img className="pfp" src={data.group.groupImg} alt="pfp" />
                  ) : (
                    <svg viewBox="0 0 212 212" height="40" width="40">
                      <path
                        d="M105.946 0.25C164.318 0.25 211.64 47.596 211.64 106C211.64 164.404 164.318 211.75 105.945 211.75C47.571 211.75 0.25 164.404 0.25 106C0.25 47.596 47.571 0.25 105.946 0.25Z"
                        fill="#6a7175"
                      ></path>
                      <path
                        fill="#cfd4d6"
                        d="M102.282 77.2856C102.282 87.957 93.8569 96.5713 83.3419 96.5713C72.827 96.5713 64.339 87.957 64.339 77.2856C64.339 66.6143 72.827 58 83.3419 58C93.8569 58 102.282 66.6143 102.282 77.2856ZM150.35 80.1427C150.35 89.9446 142.612 97.857 132.954 97.857C123.296 97.857 115.5 89.9446 115.5 80.1427C115.5 70.3409 123.296 62.4285 132.954 62.4285C142.612 62.4285 150.35 70.3409 150.35 80.1427ZM83.3402 109.428C68.5812 109.428 39 116.95 39 131.928V143.714C39 147.25 41.8504 148 45.3343 148H121.346C124.83 148 127.68 147.25 127.68 143.714V131.928C127.68 116.95 98.0991 109.428 83.3402 109.428ZM126.804 110.853C127.707 110.871 128.485 110.886 129 110.886C143.759 110.886 174 116.95 174 131.929V141.571C174 145.107 171.15 148 167.666 148H134.854C135.551 146.007 135.995 143.821 135.995 141.571L135.75 131.071C135.75 121.51 130.136 117.858 124.162 113.971C122.772 113.067 121.363 112.15 120 111.143C119.981 111.123 119.962 111.098 119.941 111.07C119.893 111.007 119.835 110.931 119.747 110.886C121.343 110.747 124.485 110.808 126.804 110.853Z"
                      ></path>
                    </svg>
                  )}
                  <div className="user_infos">
                    <h1>{data.group.groupName}</h1>
                    {showContactInfo && (
                      <p className="infos">Click here to get group chat infos</p>
                    )}
                    {!showContactInfo && (
                      <p className="infos">
                        {data.group.groupUsers.map((user, index) => (
                          <span key={user.uid}>
                            {user.displayName !== currentUser.displayName
                              ? user.displayName
                              : "you"}
                            {index !== data.group.groupUsers.length - 1
                              ? ", "
                              : ""}
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

        {userInfosMenuActive && <Userinfos user={data.user} setUseInfosMenuActive={setUseInfosMenuActive} />}
      </>
    );
};
