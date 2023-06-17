import { ACTION_TYPES } from "./postActionTypes";

export const INITIAL_STATE = {
  chatId: "null",
  user: {},
};

export const chatReducer = (state, action, currentUser) => {
  switch (action.type) {
    case ACTION_TYPES.CHANGE_USER:
      return {
        user: action.payload,
        chatId:
          currentUser.uid > action.payload.uid
            ? currentUser.uid + action.payload.uid
            : action.payload.uid + currentUser.uid,
      };
    case ACTION_TYPES.RESET_CHAT:
      return INITIAL_STATE;
    default:
      return state;
  }
};