import { useContext, useEffect, useRef } from "react";
import { AuthContext } from "../context/AuthContext";
import { ChatContext } from "../context/ChatContext";
import "./styles/message.scss";

export default function Message({ message }) {
  const { currentUser } = useContext(AuthContext);
  const { data } = useContext(ChatContext);
  const ref = useRef();
  const groupContext = Object.entries(data.group)?.length;

  const messageOwner = message.senderId === currentUser.uid ? "owner" : "user";
  const senderUser = data.group.groupUsers?.find((user) => user.uid === message.senderId);
  const noTextClass = message.text === "" ? "noText" : "";

  const getHour = () => {
    const milliseconds =
      message.date.seconds * 1000 + message.date.nanoseconds / 1000000;
    const date = new Date(milliseconds);
    const hours = date.getHours();
    const minutes = date.getMinutes().toString().padStart(2, "0");
    return `${hours}:${minutes}`;
  };

  useEffect(() => {
    ref.current?.scrollIntoView({ behavior: "smooth" });
  }, [message]);

  const renderMessageContent = () => {
    const messageText = message.text;
    const linkRegex = /(https?:\/\/[^\s]+)/g;
    const links = messageText.match(linkRegex);

    if (links) {
      const placeholder = "%%LINK%%";
      let replacedText = messageText;
      const linkElements = [];

      links.forEach((link) => {
        replacedText = replacedText.replace(link, placeholder);
        linkElements.push(
          <a key={`link-${link}`} href={link} className="link">
            {link}
          </a>
        );
      });

      const splittedText = replacedText.split(placeholder);
      const elements = [];

      splittedText.forEach((text, index) => {
        elements.push(<span key={index}>{text}</span>);
        if (index < linkElements.length) {
          elements.push(linkElements[index]);
          elements.push(<span key={`space-${index}`}>&nbsp;</span>);
        }
      });

      return <div className="text_infos flex">{elements}</div>;
    }

    return (
      <div className="text_infos flex">
        <h1>{messageText}</h1>
        <p className="hours">
          <span>{getHour()}</span>
        </p>
      </div>
    );
  };

  return (
    <>
      <div className={`row ${messageOwner} d-f`} ref={ref}>
        <div className="message_container flex">
          {groupContext > 0 && (
            <div className="message_grouptype">
              <div className="message_usergroup_pfg">
                <img src={senderUser?.photoURL} width="28px" height="28px" />
              </div>

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
            </div>
          )}

          {Object.entries(data.user).length > 0 && (
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
          )}

          <div
            className={`message flex ${messageOwner} ${
              groupContext > 0 && "fixed"
            }`}
          >
            <div className={`message_content ${noTextClass} flex`}>
              {renderMessageContent()}

              <div className="message_img_container">
                {message.img && (
                  <img src={message.img} className={noTextClass} alt="img" />
                )}
              </div>
            </div>
          </div>
        </div>
      </div>
    </>
  );
}
