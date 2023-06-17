import { useContext } from "react";
import { AuthContext } from "../context/AuthContext";
import "./styles/message.scss";

export default function Message({ message }) {
    const {currentUser} = useContext(AuthContext);
    
    const messageOwner = message.senderId === currentUser.uid ? "owner" : "user";
    
    return (
        <>
            <div className={`row ${messageOwner}`}>
                <div className={`message_svg ${messageOwner}`}>
                    <svg viewBox="0 0 8 13" className={messageOwner} height="13" width="8"><path opacity="0.13" d="M5.188,1H0v11.193l6.467-8.625 C7.526,2.156,6.958,1,5.188,1z"></path><path fill="currentColor" d="M5.188,0H0v11.193l6.467-8.625C7.526,1.156,6.958,0,5.188,0z"></path></svg>
                </div>
                <div className={`message ${messageOwner}`}>{message.text}</div>
            </div>
        </>
    )
};
