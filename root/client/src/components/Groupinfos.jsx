import { useContext, useEffect, useState } from "react";
import { toast } from "react-hot-toast";
import { ChatContext } from "../context/ChatContext";
import { getUserFromFirestore } from "../utilities/const";
import Preloader from "./Preloader";
import "./styles/Groupinfos.scss";

export default function Groupinfos({ group, setGroupInfosMenuActive }) {
  const { data, groupMembersEl, setGroupMemberEl } = useContext(ChatContext);
  const [groupMembersIsLoading, setGroupMembersIsLoading] = useState(false);

  const handleCloseGroupInfos = () => {
    setGroupInfosMenuActive(false);
    setGroupMemberEl([]);
  };
  const handleViewImg = () => {};

  const getUserDesc = async (user) => {
    const userFromFirestore = await getUserFromFirestore(user);
    return userFromFirestore.desc;
  };

  const getGroupMembers = async () => {
    const groupMembers = await Promise.all(
      group.groupUsers.map(async (user) => {
        const userDesc = await getUserDesc(user);
        
        return (
          <div className="group_member d-f" key={user.uid}>
            <img src={user.photoURL} alt={user.displayName} />
            <div className="group_member_infos">
                <h1>{user.displayName}</h1>
                <p>{userDesc}</p>
            </div>
          </div>
        );
      })
    );
    
    return groupMembers;
  };

  useEffect(() => {
    const fetchGroupMembers = async () => {
      try {
        setGroupMembersIsLoading(true);
        const groupMembers = await getGroupMembers();
        setGroupMemberEl((prevMembers) => [...prevMembers, ...groupMembers]);
      } catch(error) {
        console.error(error);
        toast.error("Something went wrong while loading group members.");
      } finally {
        setGroupMembersIsLoading(false);
      }
    };
    
    fetchGroupMembers();
  }, []);


  return (
    <div className="userinfos_container" id="group_infos_container">
      <header>
        <svg
          onClick={handleCloseGroupInfos}
          viewBox="0 0 24 24"
          height="24"
          width="24"
          fill="currentColor"
        >
          <path d="M19.6004 17.2L14.3004 11.9L19.6004 6.60005L17.8004 4.80005L12.5004 10.2L7.20039 4.90005L5.40039 6.60005L10.7004 11.9L5.40039 17.2L7.20039 19L12.5004 13.7L17.8004 19L19.6004 17.2Z"></path>
        </svg>
        <h1 className="title">User's Infos</h1>
      </header>

      <div className="user_pfp_container flex">
        <img
          src={group.groupImg}
          alt={group.groupName}
          onClick={handleViewImg}
        />
      </div>

      <div className="group_infos d-f">
        <h1>{group.groupName}</h1>
        <p>Group, {group.groupUsers?.length} members</p>
      </div>

      <div className="user_infos">
        <h1>Infos</h1>
        <p>{group.groupDesc}</p>
      </div>

      <div className="user_messages">
        <div className="user_messages_container medias d-f">
          <div className="medias_container">
            <div className="user_messages_container_svg d-f">
              <p>Media, link and documents</p>
              <div className="d-f">
                <p>{""}</p>
                <svg viewBox="0 0 10 21" height="21" width="10">
                  <path
                    fill="currentColor"
                    d="M1,15.75l5.2-5.2L1,5.35l1.5-1.5l6.5,6.7l-6.6,6.6L1,15.75z"
                  ></path>
                </svg>
              </div>
            </div>
            {"" > 0 && <div className="medias_container-imgs d-f">{""}</div>}
          </div>
        </div>
        <div className="user_messages_container d-f">
          <p>Total Messages:&nbsp;</p>
          <p>{""}</p>
        </div>
      </div>

      <div className="group_members">
        <h1 className="group_members_count">{group.groupUsers.length} members</h1>
        {!groupMembersIsLoading ? groupMembersEl : <Preloader />}
      </div>

      <div className="user_controls">
        <div className="user_control d-f">
          <svg viewBox="0 0 24 24" height="24" width="24"><path fill="currentColor" d="M16.6,8.1l1.2-1.2l5.1,5.1l-5.1,5.1l-1.2-1.2l3-3H8.7v-1.8h10.9L16.6,8.1z M3.8,19.9h9.1 c1,0,1.8-0.8,1.8-1.8v-1.4h-1.8v1.4H3.8V5.8h9.1v1.4h1.8V5.8c0-1-0.8-1.8-1.8-1.8H3.8C2.8,4,2,4.8,2,5.8v12.4 C2,19.1,2.8,19.9,3.8,19.9z"></path></svg>
          <h1>Exit Group</h1>
        </div>
      </div>

      {/* {userInfosMediaMenuActive && (
            <div className="userinfos_media_container">
              <header>
                <svg
                  onClick={handleCloseMediasMenu}
                  viewBox="0 0 24 24"
                  height="24"
                  width="24"
                >
                  <path
                    fill="currentColor"
                    d="M12,4l1.4,1.4L7.8,11H20v2H7.8l5.6,5.6L12,20l-8-8L12,4z"
                  ></path>
                </svg>
              </header>

              <article className="submenu d-f">
                <div
                  className={`tab d-f ${
                    activeTab === "Medias" ? "active" : ""
                  }`}
                  onClick={() => handleTabClick("Medias")}
                >
                  Medias
                </div>
                <div
                  className={`tab d-f ${
                    activeTab === "Documents" ? "active" : ""
                  }`}
                  onClick={() => handleTabClick("Documents")}
                >
                  Documents
                </div>
                <div
                  className={`tab d-f ${activeTab === "Links" ? "active" : ""}`}
                  onClick={() => handleTabClick("Links")}
                >
                  Link
                </div>
                <div
                  className={`tab d-f ${
                    activeTab === "Products" ? "active" : ""
                  }`}
                  onClick={() => handleTabClick("Products")}
                >
                  Products
                </div>
              </article>

              <main>
                {activeTab === "Medias" ? (
                  <ul>{mediasFilterEl(activeTab)}</ul>
                ) : (
                  mediasFilterEl(activeTab)
                )}
              </main>

              {totalMedias.length === 0 && (
                <div className="no_medias">
                  <h1>No Medias</h1>
                </div>
              )}
            </div>
          )} */}
    </div>
  );
}
