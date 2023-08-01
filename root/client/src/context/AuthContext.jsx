import { onAuthStateChanged } from "firebase/auth";
import {
  doc,
  getDoc,
  onSnapshot,
  setDoc,
  updateDoc,
} from "firebase/firestore";
import { createContext, useEffect, useState } from "react";
import { toast } from "react-hot-toast";
import { auth, db } from "../firebase";

export const AuthContext = createContext();

export const AuthContextProvider = ({ children }) => {
  const [currentUser, setCurrentUser] = useState(null);
  const [loading, setLoading] = useState(true);
  
  const setUserStatus = async (user, status) => {
    const userRef = doc(db, "users", user.uid);
    await updateDoc(userRef, { status: status });
  }

  useEffect(() => {
    if(!currentUser) return;

    const handleDisconnect = async () => {
      try {
        setUserStatus(currentUser, "offline");
      } catch (error) {
        console.error("Error updating user status:", error);
      }
    };

    window.addEventListener("beforeunload", handleDisconnect);

    return () => {
      window.removeEventListener("beforeunload", handleDisconnect);
    };
  }, [currentUser]);

  useEffect(() => {
    const unsub = onAuthStateChanged(auth, async (user) => {
      if (user) {
        setCurrentUser(user);
        setLoading(false);
        const userRef = doc(db, "users", user.uid);

        try {
          const userDoc = await getDoc(userRef);
          userDoc.exists()
            ? setUserStatus(user, "online")
            : await setDoc(userRef, { status: "online" });
        } catch (error) {
          toast.error("Something Went Wrong: " + error);
        }
      } else {
        const user = currentUser;
        setCurrentUser(null);
        setLoading(false);

        if (user && user.uid) {
          try {
            setUserStatus(user, "offline");
          } catch (error) {
            toast.error("Something Went Wrong: " + error);
          }
        }
      }
    });

    return () => unsub();
  }, [currentUser]);

  return (
    <AuthContext.Provider value={{ currentUser }}>
      {!loading && children}
    </AuthContext.Provider>
  );
};
