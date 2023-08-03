import { faTrash } from "@fortawesome/free-solid-svg-icons";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { collection, getDocs, onSnapshot, query, where } from "firebase/firestore";
import { useContext, useEffect, useState } from "react";
import { ChatContext } from "../context/ChatContext";
import { db } from "../firebase";

export default function Chat({ chat }) {
  const [userStatus, setUserStatus] = useState("");
  const { dispatch, data, handleDeleteChat } = useContext(ChatContext);

  useEffect(() => {
    const getUserStatus = async () => {
      try {
        if (chat[1]?.userInfo) {
          const usersCollection = collection(db, "users");
          const statusQuery = query(
            usersCollection,
            where("uid", "==", chat[1].userInfo.uid)
          );

          const unsubscribe = onSnapshot(statusQuery, (querySnapshot) => {
            querySnapshot.forEach((doc) => {
              setUserStatus(doc.data().status);
            });
          });

          return () => {
            unsubscribe();
          };
        }
      } catch (error) {
        console.error(error);
        setUserStatus("");
      }
    };

    const unsubscribe = getUserStatus();

    return () => {
      if (unsubscribe && typeof unsubscribe === "function") {
        unsubscribe();
      }
    };
  }, []);

  const handleSelect = (user) => {
    dispatch({ type: "CHANGE_USER", payload: user });
  };

  const handleGroupSelect = (group) => {
    dispatch({ type: "CHANGE_GROUP", payload: group });
  };

  const handleDeleteGroup = async (selectedGroup) => {
    console.log(selectedGroup);
  };

  const getDate = (date) => {
    const messageDate = date.toDate();

    const today = new Date();
    today.setHours(0, 0, 0, 0);

    const yesterday = new Date(today);
    yesterday.setDate(yesterday.getDate() - 1);

    if (messageDate >= today) {
      const hours = messageDate.getHours();
      const minutes = messageDate.getMinutes();
      const formattedTime = `${hours.toString().padStart(2, "0")}:${minutes
        .toString()
        .padStart(2, "0")}`;
      return `Today ${formattedTime}`;
    } else if (messageDate >= yesterday) {
      return "Yesterday";
    } else {
      const giorno = messageDate.getDate();
      const mese = messageDate.getMonth() + 1;
      const anno = messageDate.getFullYear();
      return `${giorno}/${mese}/${anno}`;
    }
  };

  return (
    <div
      className={`chat d-f ${data.chatId === chat[0] ? "selected" : ""}`}
      key={chat[0]}
      onClick={() => {
        chat[1].type === "group"
          ? handleGroupSelect(chat[1])
          : handleSelect(chat[1].userInfo);
      }}
    >
      <div className="chat__img_container">
        {chat[1].type !== "group" && (
          <img className="pfp" src={chat[1].userInfo.photoURL} alt="pfp" />
        )}
        {chat[1].type === "group" ? (
          chat[1].groupImg ? (
            <img className="pfp" src={chat[1].groupImg} alt="pfp" />
          ) : (
            <svg viewBox="0 0 212 212" height="50" width="50">
              <path
                d="M105.946 0.25C164.318 0.25 211.64 47.596 211.64 106C211.64 164.404 164.318 211.75 105.945 211.75C47.571 211.75 0.25 164.404 0.25 106C0.25 47.596 47.571 0.25 105.946 0.25Z"
                fill="#6a7175"
              ></path>
              <path
                fill="#cfd4d6"
                d="M102.282 77.2856C102.282 87.957 93.8569 96.5713 83.3419 96.5713C72.827 96.5713 64.339 87.957 64.339 77.2856C64.339 66.6143 72.827 58 83.3419 58C93.8569 58 102.282 66.6143 102.282 77.2856ZM150.35 80.1427C150.35 89.9446 142.612 97.857 132.954 97.857C123.296 97.857 115.5 89.9446 115.5 80.1427C115.5 70.3409 123.296 62.4285 132.954 62.4285C142.612 62.4285 150.35 70.3409 150.35 80.1427ZM83.3402 109.428C68.5812 109.428 39 116.95 39 131.928V143.714C39 147.25 41.8504 148 45.3343 148H121.346C124.83 148 127.68 147.25 127.68 143.714V131.928C127.68 116.95 98.0991 109.428 83.3402 109.428ZM126.804 110.853C127.707 110.871 128.485 110.886 129 110.886C143.759 110.886 174 116.95 174 131.929V141.571C174 145.107 171.15 148 167.666 148H134.854C135.551 146.007 135.995 143.821 135.995 141.571L135.75 131.071C135.75 121.51 130.136 117.858 124.162 113.971C122.772 113.067 121.363 112.15 120 111.143C119.981 111.123 119.962 111.098 119.941 111.07C119.893 111.007 119.835 110.931 119.747 110.886C121.343 110.747 124.485 110.808 126.804 110.853Z"
              ></path>
            </svg>
          )
        ) : null}
      </div>

      <div className="chat__infos d-f s-b">
        <div className="chat__preview">
          <h1>
            {chat[1].type === "group"
              ? chat[1].groupName
              : chat[1].userInfo.displayName}
          </h1>
          {chat[1].type !== "group" && (
            <div className="chat_status">
              {userStatus === "online" ? (
                <div className="status_online"></div>
              ) : (
                <div className="status_offline"></div>
              )}
            </div>
          )}
          <p className={`${chat[1].lastMessage?.text === "Photo" ? "photo" : ""}`}>
            {chat[1].type !== "group" ? chat[1].lastMessage?.text: chat[1].lastMessage?.sender + ": " + chat[1].lastMessage?.text}
          </p>
        </div>

        <div className="chat__menage">
          <div className="chat__time">
            {chat[1].date && chat[1].date !== null && getDate(chat[1].date)}
          </div>
          <div className="chat__remove">
            <FontAwesomeIcon
              icon={faTrash}
              onClick={() => {
                if (chat[1].type === "group") {
                  handleDeleteGroup(chat);
                } else {
                  handleDeleteChat(chat);
                }
              }}
            />
          </div>
        </div>
      </div>
    </div>
  );
}
