import {
  collection,
  getDocs,
  orderBy,
  query,
  where,
} from "firebase/firestore";
import { useEffect, useRef, useState } from "react";
import { toast } from "react-hot-toast";
import { db } from "../firebase";
import SearchList from "./SearchList";
import "./styles/navbar.scss";

export default function Navbar() {
    const [username, setUsername] = useState("");
    const [searchResults, setSearchResults] = useState([]);
    const [active, setActive] = useState("");
    const [err, settErr] = useState("");
    const inputRef = useRef(null);

    const handleInputChange = (e) => {
      setUsername(e.target.value.toLowerCase());
      setActive("active");
    }

    const handleKeyDown = (e) => {
      if(e.keyCode !== 13) return;
      
      if (searchResults.length >= 1) {
        const usernames = searchResults.map((user) => user.username).join(", ");
        toast.success(`Users found: ${usernames}`);
      } else {
        toast.error("No User Found");
      }
    };

    const handleCloseSearchList = () => {
      setUsername("");
      setActive("");
      inputRef.current.value = "";
    }

    useEffect(() => {
      const searchUsers = async () => {
        if (username === "") {
          setSearchResults([]);
          return;
        }
        
        const usersCollection = collection(db, "users");
        const q = query(
          usersCollection,
          where("usernameToLowerCase", ">=", username),
          where("usernameToLowerCase", "<=", username + "\uf8ff"),
          orderBy("usernameToLowerCase")
        );

        try {
          const snapshot = await getDocs(q);
          
          const results = [];
          snapshot.forEach( (doc) => results.push(doc.data()) );

          setSearchResults(results);
        } catch (error) {
          settErr(error);
          
          toast.error("Something Went Wrong");
          console.warn(error);
        }
      };

      searchUsers();
    }, [username]);

    return (
        <div className="navbar d-f s-b">
            <nav className="d-f">
                <svg viewBox="0 0 24 24" height="24" width="24"><path fill="currentColor" d="M15.009,13.805h-0.636l-0.22-0.219c0.781-0.911,1.256-2.092,1.256-3.386 c0-2.876-2.332-5.207-5.207-5.207c-2.876,0-5.208,2.331-5.208,5.207s2.331,5.208,5.208,5.208c1.293,0,2.474-0.474,3.385-1.255 l0.221,0.22v0.635l4.004,3.999l1.194-1.195L15.009,13.805z M10.201,13.805c-1.991,0-3.605-1.614-3.605-3.605 s1.614-3.605,3.605-3.605s3.605,1.614,3.605,3.605S12.192,13.805,10.201,13.805z"></path></svg>
                <div className="input_container d-f s-b">
                  <input type="text" id="search" placeholder="Search a user by username..." onKeyDown={handleKeyDown}  onChange={handleInputChange} ref={inputRef} />
                  {active && <svg viewBox="0 0 24 24" height="24" width="24" onClick={handleCloseSearchList}><path fill="currentColor" d="M17.25,7.8L16.2,6.75l-4.2,4.2l-4.2-4.2L6.75,7.8l4.2,4.2l-4.2,4.2l1.05,1.05l4.2-4.2l4.2,4.2l1.05-1.05 l-4.2-4.2L17.25,7.8z"></path></svg>}
                </div>
            </nav>
            <svg className="filter" viewBox="0 0 24 24" height="20" width="20"><path fill="currentColor" d="M10,18.1h4v-2h-4V18.1z M3,6.1v2h18v-2H3z M6,13.1h12v-2H6V13.1z"></path></svg>
            <SearchList results={searchResults} err={err} active={active} />
        </div>
    )
};
