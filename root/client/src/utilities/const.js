import { collection, getDocs, query, where } from "firebase/firestore";
import { db } from "../firebase";

export const MEDIA_PREVIEW_IMG_NUMBER = 3

export function containsLink(str) {
  const urlPattern = /(https?:\/\/[^\s]+)/g;
  const match = str.match(urlPattern);
  return {
    hasLink: match !== null,
    link: match ? match[0] : null
  };
}

export async function getUserFromFirestore(user) {
  const q = query(collection(db, "users"), where("uid", "==", user?.uid));
  const querySnapshot = await getDocs(q);
  const userData = querySnapshot.docs[0]?.data() || null;

  return userData;
}

export async function isDisplayNameUnique(newDisplayName) {
  try {
    const q = query(
      collection(db, "users"),
      where("displayName", "==", newDisplayName)
    );
    const querySnapshot = await getDocs(q);

    return querySnapshot.empty;
  } catch (error) {
    console.error(error);
    throw error; // Rilancia l'errore per gestirlo in un punto superiore
  }
}