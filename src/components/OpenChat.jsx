import { useContext, useEffect, useState } from "react";
import { ChatContext } from "../context/ChatContext";
import Messages from "./Messages";
import "./styles/OpenChat.scss";

export default function Chat() {
    const {data} = useContext(ChatContext);
    const [showContactInfo, setShowContactInfo] = useState(false);
    const [isLoading, setIsLoading] = useState(true);
    const dataLenght = Object.entries(data.user)?.length;

    useEffect(() => {
      setShowContactInfo(true);
      const timer = setTimeout(() => {
        setShowContactInfo(false);
      }, 2000);

      return () => clearTimeout(timer);
    }, [data.user]);

    useEffect(() => {
      if (Object.entries(data.user).length !== 0) {
        setIsLoading(false);
      }
    }, [data.user]);
    
    // TODO hamdle no open chat
    return (
      <main className="chat">
        {dataLenght !== 0 && !isLoading ? <header className="d-f s-b">
          <div className="pfp_container d-f">
            <img src={data.user.photoURL} alt="" className="pfp"></img>
            <div className="user_infos">
                <h1>{data.user?.username}</h1>
                {showContactInfo && (<p className="infos">clicca qui per info contatto</p>)}
            </div>
          </div>

          <div className="icons_container d-f">
            <svg viewBox="0 0 24 24" height="24" width="24"><path fill="currentColor" d="M15.9,14.3H15L14.7,14c1-1.1,1.6-2.7,1.6-4.3c0-3.7-3-6.7-6.7-6.7S3,6,3,9.7 s3,6.7,6.7,6.7c1.6,0,3.2-0.6,4.3-1.6l0.3,0.3v0.8l5.1,5.1l1.5-1.5L15.9,14.3z M9.7,14.3c-2.6,0-4.6-2.1-4.6-4.6s2.1-4.6,4.6-4.6 s4.6,2.1,4.6,4.6S12.3,14.3,9.7,14.3z"></path></svg>
            <svg viewBox="0 0 24 24" height="24" width="24"><path fill="currentColor" d="M12,7c1.104,0,2-0.896,2-2c0-1.105-0.895-2-2-2c-1.104,0-2,0.894-2,2 C10,6.105,10.895,7,12,7z M12,9c-1.104,0-2,0.894-2,2c0,1.104,0.895,2,2,2c1.104,0,2-0.896,2-2C13.999,9.895,13.104,9,12,9z M12,15 c-1.104,0-2,0.894-2,2c0,1.104,0.895,2,2,2c1.104,0,2-0.896,2-2C13.999,15.894,13.104,15,12,15z"></path></svg>
          </div>
        </header> : <h1>No Open Chat</h1>}
        {dataLenght !== 0 && !isLoading && <Messages />}
      </main>
    );
};
