import {
  doc,
  getDoc,
  serverTimestamp,
  setDoc,
  updateDoc,
} from "firebase/firestore"; // Add 'doc' import
import { useContext } from "react";
import { toast } from "react-hot-toast";
import { AuthContext } from "../context/AuthContext";
import { db } from "../firebase";
import Preloader from "./Preloader";
import "./styles/searchlist.scss";

export default function SearchList({
  results,
  err,
  setErr,
  active,
  loading,
  handleCloseSearchList,
}) {
  const { currentUser } = useContext(AuthContext);

  const handleChatSelect = async (user) => {
    //check whether the group(chats in firestore) exists, if not create
    const combinedId =
      currentUser.uid > user.uid
        ? currentUser.uid + user.uid
        : user.uid + currentUser.uid;
    try {
      const res = await getDoc(doc(db, "chats", combinedId));

      if (!res.exists()) {
        //create a chat in chats collection
        await setDoc(doc(db, "chats", combinedId), { messages: [] });

        //create user chats
        await updateDoc(doc(db, "userChats", currentUser.uid), {
          [combinedId + ".userInfo"]: {
            uid: user.uid,
            displayName: user.displayName,
            photoURL: user.photoURL,
          },
          [combinedId + ".date"]: serverTimestamp(),
        });

        await updateDoc(doc(db, "userChats", user.uid), {
          [combinedId + ".userInfo"]: {
            uid: currentUser.uid,
            displayName: currentUser.displayName,
            photoURL: currentUser.photoURL,
          },
          [combinedId + ".date"]: serverTimestamp(),
        });
      }
      
      toast.success("Started New Conversation")
      handleCloseSearchList();
    } catch (error) {
      setErr(error);
      console.error(err);
      toast.error("Something Went Wrong");
    }}

  const users = results.map((user) => (
    <li key={user.uid} onClick={() => handleChatSelect(user)} className="d-f">
      <img src={user.photoURL} alt={user.displayName} className="pfp" />
      <div className="infos_container">
        <h3>{user.displayName}</h3>
        <p>Start a conversation</p>
      </div>
    </li>
  ));

  return (
    <main className={`searchlist ${active}`}>
      <ul>
        {loading && <Preloader />}
        {!loading && users}
      </ul>
    </main>
  );
}