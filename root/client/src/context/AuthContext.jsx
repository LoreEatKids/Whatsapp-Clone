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

  useEffect(() => {
    if(!currentUser) return;
    const userRef = doc(db, "users", currentUser.uid);

    const handleDisconnect = async () => {
      try {
        await updateDoc(userRef, { status: "offline" });
      } catch (error) {
        console.error("Error updating user status:", error);
      }
    };

    const cleanup = async () => {
      await handleDisconnect();
    };

    window.addEventListener("beforeunload", cleanup);

    return () => {
      window.removeEventListener("beforeunload", cleanup);
    };
  }, [currentUser]);

  useEffect(() => {
    const unsub = onAuthStateChanged(auth, async (user) => {
      if (user) {
        setCurrentUser(user);
        setLoading(false);

        const userRef = doc(db, "users", user.uid);
        const userStatus = "online";

        try {
          const userDoc = await getDoc(userRef);
          if (userDoc.exists()) {
            await updateDoc(userRef, { status: userStatus });
          } else {
            await setDoc(userRef, { status: userStatus });
          }
        } catch (error) {
          toast.error("Something Went Wrong: " + error);
        }
      } else {
        const user = currentUser;
        setCurrentUser(null);
        setLoading(false);

        if (user && user.uid) {
          const userRef = doc(db, "users", user.uid);
          const userStatus = "offline";

          try {
            await updateDoc(userRef, { status: userStatus });
          } catch (error) {
            toast.error("Something Went Wrong: " + error);
          }
        }
      }
    });

    return () => {
      unsub();
    };
  }, [currentUser]);

  return (
    <AuthContext.Provider value={{ currentUser }}>
      {!loading && children}
    </AuthContext.Provider>
  );
};
