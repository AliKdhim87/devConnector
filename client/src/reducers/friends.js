import {
  GET_FRIENDSLIST,
  GET_FRIENDREQUESTSLIST,
  SEND_FRIENDREQUEST,
  ACCEPT_FRIENDREQUEST,
  REJECT_FRIENDREQUEST,
  FRIENDS_ERROR,
  UNFRIEND,
  CANCEL_REQUEST
} from '../actions/types';

const initialState = {
  friends: [],
  friendsrquestlist: [],
  firendrequest: null,
  isSent: null,
  loading: true,
  error: {}
};

export default function (state = initialState, action) {
  const { type, payload } = action;

  switch (type) {
    case GET_FRIENDSLIST:
      return {
        ...state,
        friends: payload,
        loading: false
      };

    case GET_FRIENDREQUESTSLIST:
      return {
        ...state,
        friendsrquestlist: payload,
        loading: false
      };
    case SEND_FRIENDREQUEST:
      return {
        ...state,
        friendsrquestlist: { ...state.friendsrquestlist, payload },
        isSent: payload.sentRequest.isSent,
        loading: false
      };
    case ACCEPT_FRIENDREQUEST:
      return {
        ...state,
        friendsrquestlist: state.friendsrquestlist.filter(
          (item) => item._id !== payload.requestInfo.friendRequest._id
        ),
        friends: { ...state.friends, payload },
        loading: false
      };

    case REJECT_FRIENDREQUEST:
    case CANCEL_REQUEST:  
      return {
        ...state,
        friendsrquestlist: state.friendsrquestlist.filter(
          (item) => item._id !== payload.requestInfo.friendRequest._id
        ),
        loading: false
      };
    case UNFRIEND:
      return {
        ...state,
        friends: state.friends.filter(
          (item) => item.id !== payload.friendInfo.deletedFriend._id
        ),
        loading: false
      };
    case FRIENDS_ERROR:
      return {
        ...state,
        error: payload,
        loading: false
      };

    default:
      return state;
  }
}
