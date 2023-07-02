import { collection, getDocs, orderBy, query, where } from "firebase/firestore";
import { useContext, useEffect, useMemo, useState } from "react";
import { toast } from "react-hot-toast";
import { AuthContext } from "../context/AuthContext";
import { ChatContext } from "../context/ChatContext";
import { db } from "../firebase";
import Preloader from "./Preloader";
import "./styles/newgroup.scss";

export default function NewGroup(props) {
  const [username, setUsername] = useState("");
  const [loading, setLoading] = useState(false);
  const [err, setErr] = useState("");
  const {groupSearchResults, setGroupSearchResults} = props;
  const { currentUser } = useContext(AuthContext);
  const { selectedUsers, setSelectedUser } = useContext(ChatContext);

  const handleCloseNewGroup = () => {
    props.setActive(false);
    setGroupSearchResults([]);
    setSelectedUser([]);
  };

  const handleGroupSettings = () => {
    props.setSettingsActive(true);
  }

  const handleSearchInput = (e) => {
    setUsername(e.target.value);
  };

  useEffect(() => {
    const handleSearch = async () => {
      const userQuery = username.trim();

      if (userQuery === "") {
        setGroupSearchResults([]);
        return;
      }

      const usersCollection = collection(db, "users");
      const q = query(
        usersCollection,
        where("usernameToLowerCase", ">=", userQuery),
        where("usernameToLowerCase", "<=", userQuery + "\uf8ff"),
        orderBy("usernameToLowerCase")
      );

      try {
        setLoading(true);
        const snapshot = await getDocs(q);

        const results = [];
        snapshot.forEach((doc) => {
          const userData = doc.data();
          if (userData.uid !== currentUser.uid) {
            const isUserSelected = selectedUsers.some(
              (selectedUser) => selectedUser.displayName === userData.displayName
            );
            if (!isUserSelected) {
              results.push(userData);
            }
          }
        });

        setGroupSearchResults(results);
        setErr("");
      } catch (error) {
        setErr(error);
        setGroupSearchResults([]);
        toast.error("Something Went Wrong");
        console.error(err);
      } finally {
        setLoading(false);
      }
    };

    const timeoutId = setTimeout(handleSearch, 200);
    return () => clearTimeout(timeoutId);
  }, [username]);

  const handleUserSelect = (user) => {
    setSelectedUser((prevSelectedUsers) => [...prevSelectedUsers, user]);
    setGroupSearchResults((prevResults) =>
      prevResults.filter((currUser) => currUser.uid !== user.uid)
    );
    setUsername("");
  };

  const handleRemoveUser = (user) => {
    setSelectedUser((prevUsers) =>
      prevUsers.filter((currUser) => currUser.uid !== user.uid)
    );

    console.log(groupSearchResults)
  }

  const users = groupSearchResults.map((user) => (
    <li key={user.uid} onClick={() => handleUserSelect(user)} className="d-f">
      <img src={user.photoURL} alt={user.displayName} className="pfp" />
      <div className="infos_container">
        <h3>{user.displayName}</h3>
        <p>Add user to the group</p>
      </div>
    </li>
  ));

  const selectedUserEl = selectedUsers.map((user) => (
      <div key={user.uid} className="d-f selected_user">
        <img src={user.photoURL} alt={user.displayName} />
        <div className="d-f user_info">
           <h1>{user.displayName}</h1>
           <svg viewBox="0 0 16 16" onClick={() => handleRemoveUser(user)} height="16" width="16"><path fill="currentColor" d="M12.174,4.661l-0.836-0.835L8,7.165L4.661,3.826L3.826,4.661 L7.165,8l-3.339,3.339l0.835,0.835L8,8.835l3.338,3.339l0.836-0.835L8.835,8L12.174,4.661z"></path></svg>
        </div>
      </div>
  ));


  return (
    <div className="group_container">

      <div className="group_infos d-f">
        <div className="group_infos-wrapper d-f">

          <div className="d-f">
            <svg onClick={handleCloseNewGroup} viewBox="0 0 24 24"height="24" width="24">
                <path fill="currentColor" d="M12,4l1.4,1.4L7.8,11H20v2H7.8l5.6,5.6L12,20l-8-8L12,4z"></path>
            </svg>
          </div>
          <h1>Add Group Members</h1>

        </div>
      </div>

      {selectedUsers.length > 0 && <div className="group_selected_users d-f">
        {selectedUserEl}
      </div>}

      <div className="group_users">
        <input
          type="text"
          value={username}
          placeholder="Type the user you want to add"
          onChange={handleSearchInput}
          className="group settings"
        />
        {!loading && <ul>{users}</ul>}
      </div>

      <div className="group_results">{loading && <Preloader />}</div>

      {selectedUsers.length > 1 && <div className="group_create d-f" onClick={handleGroupSettings}>
        <svg viewBox="0 0 30 30" height="30" width="30"><path fill="currentColor" d="M15,7l-1.4,1.4l5.6,5.6H7v2h12.2l-5.6,5.6L15,23l8-8L15,7z"></path></svg>
      </div>}
    </div>
  );
}
