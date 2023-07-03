import { useContext } from "react";
import { AuthContext } from "../context/AuthContext";
import { ACTION_TYPES } from "./postActionTypes";


export const INITIAL_STATE = {
  chatId: "null",
  user: {},
  group: {},
};

const getGroupCombinedIds = (users) => {
  const userIds = users.map((user) => user.uid);
  const combinedId = userIds.sort().join("");

  return combinedId;
};

export const chatReducer = (state, action, currentUser) => {
  switch (action.type) {
    case ACTION_TYPES.CHANGE_USER:
      return {
        user: action.payload,
        group: {},
        chatId:
          currentUser.uid > action.payload.uid
            ? currentUser.uid + action.payload.uid
            : action.payload.uid + currentUser.uid,
      };
    case ACTION_TYPES.CHANGE_GROUP:
      return {
        user: {},
        // chatId: getGroupCombinedIds([...action.payload.groupUsers, currentUser]),
        chatId: getGroupCombinedIds([...action.payload.groupUsers]),
        group: action.payload,
      };
    case ACTION_TYPES.RESET_CHAT:
      return INITIAL_STATE;
    default:
      return state;
  }
};