import axios from 'axios';
import { setAlert } from './alert';
import {
  GET_GROUPS,
  ADD_GROUP,
  GET_GROUP,
  DELETE_GROUP,
  UPDATE_GROUP,
  GET_GROUPPOST,
  ADD_GROUPPOST,
  UPDATE_GROUPPOST,
  DELETE_GROUPPOST,
  ADD_POSTCOMMENT,
  DELETE_POSTCOMMENT,
  JOIN_GROUP,
  LEAVE_GROUP,
  POST_ERROR
} from './types';

// Get all groups
export const getGroups = () => async (dispatch) => {
  try {
    const res = await axios.get('/api/groups');
    dispatch({
      type: GET_GROUPS,
      payload: res.data
    });
  } catch (error) {
    dispatch({
      type: POST_ERROR,
      payload: {
        msg: error.response.statusText,
        status: error.response.status
      }
    });
  }
};

// create a group
export const addGroup = (formData) => async (dispatch) => {
  const config = {
    headers: {
      'Content-Type': 'application/json'
    }
  };
  try {
    const res = await axios.post(`/api/groups`, formData, config);
    dispatch({
      type: ADD_GROUP,
      payload: res.data
    });
  } catch (error) {
    dispatch({
      type: POST_ERROR,
      payload: {
        msg: error.response.data.msg,
        status: error.response.status
      }
    });
  }
};

// Get one group
export const getGroup = (groupID) => async (dispatch) => {
  try {
    const res = await axios.get(`/api/groups/${groupID}`);
    dispatch({
      type: GET_GROUP,
      payload: res.data
    });
  } catch (error) {
    dispatch({
      type: POST_ERROR,
      payload: {
        msg: error
      }
    });
  }
};

// Delete Group
export const deleteGroup = (groupID) => async (dispatch) => {
  try {
    await axios.delete(`/api/groups/${groupID}`);
    dispatch({
      type: DELETE_GROUP,
      payload: groupID
    });
    dispatch(setAlert('Group deleted', 'success'));
  } catch (error) {
    dispatch({
      type: POST_ERROR,
      payload: {
        msg: error.response.data.msg,
        status: error.response.status
      }
    });
  }
};

// Update Group
export const updateGroup = (groupID, formData) => async (dispatch) => {
  const config = {
    headers: {
      'Content-Type': 'application/json'
    }
  };
  try {
    await axios.put(`/api/groups/${groupID}`, formData, config);
    dispatch({
      type: UPDATE_GROUP,
      payload: groupID
    });
    dispatch(setAlert('Group info updated', 'success'));
  } catch (error) {
    dispatch({
      type: POST_ERROR,
      payload: {
        msg: error.msg,
        status: error.status
      }
    });
  }
};

// // Add a member
export const addMember = (groupId) => async (dispatch) => {
  try {
    const res = await axios.put(`/api/groups/join/${groupId}`);
    dispatch({
      type: JOIN_GROUP,
      payload: res.data
    });
    dispatch(setAlert('Member added', 'success'));
  } catch (error) {
    dispatch({
      type: POST_ERROR,
      payload: {
        msg: error.msg
      }
    });
  }
};
// Remove a member
export const removeMember = (groupId) => async (dispatch) => {
  try {
    const res = await axios.put(`/api/groups/leave/${groupId}`);
    dispatch({
      type: LEAVE_GROUP,
      payload: res.data
    });
    dispatch(setAlert('Member removed', 'success'));
  } catch (error) {
    dispatch({
      type: POST_ERROR,
      payload: {
        msg: error.msg,
        status: error.status
      }
    });
  }
};
// // Get a post
export const getGroupPost = (groupID, postID) => async (dispatch) => {
  try {
    const res = await axios.get(`/api/groups/${groupID}/posts/${postID}`);
    dispatch({
      type: GET_GROUPPOST,
      payload: res.data
    });
  } catch (error) {
    dispatch({
      type: POST_ERROR,
      payload: {
        msg: error,
        status: 500
      }
    });
  }
};

//Add Group post
export const addGroupPost = (groupID, formData) => async (dispatch) => {
  const config = {
    headers: {
      'Content-Type': 'application/json'
    }
  };
  try {
    const res = await axios.post(
      `/api/groups/${groupID}/posts`,
      formData,
      config
    );
    dispatch({
      type: ADD_GROUPPOST,
      payload: res.data
    });
    dispatch(setAlert('Post Added', 'success'));
  } catch (error) {
    const errors = error.response.data.errors;
    if (errors) {
      errors.forEach((error) => dispatch(setAlert(error.msg, 'danger')));
    }
    dispatch({
      type: POST_ERROR
    });
  }
};

// // Update a post
export const updateGroupPost = (groupID, postId, formData) => async (
  dispatch
) => {
  const config = {
    headers: {
      'Content-Type': 'application/json'
    }
  };
  try {
    const res = await axios.put(
      `/api/groups/${groupID}/posts/${postId}`,
      formData,
      config
    );
    dispatch({
      type: UPDATE_GROUPPOST,
      payload: res.data
    });
    dispatch(setAlert('Comment Updated', 'success'));
  } catch (error) {
    const errors = error.response.data.errors;
    if (errors) {
      errors.forEach((error) => dispatch(setAlert(error.msg, 'danger')));
    }
    dispatch({
      type: POST_ERROR
    });
  }
};

// Delete a post
export const deleteGroupPost = (groupID, postID) => async (dispatch) => {
  try {
    const res = await axios.delete(`/api/groups/${groupID}/posts/${postID}`);
    dispatch({
      type: DELETE_GROUPPOST,
      payload: res.data
    });
    dispatch(setAlert('Post removed', 'success'));
  } catch (error) {
    dispatch({
      type: POST_ERROR,
      payload: {
        msg: error.msg,
        status: error.status
      }
    });
  }
};

// Add a comment to the post
export const addPostComment = (groupID, postID, formData) => async (
  dispatch
) => {
  const config = {
    headers: {
      'Content-Type': 'application/json'
    }
  };
  try {
    const res = await axios.put(
      `/api/groups/${groupID}/posts/${postID}/comments`,
      formData,
      config
    );
    dispatch({
      type: ADD_POSTCOMMENT,
      payload: res.data
    });
  } catch (error) {
    dispatch({
      type: POST_ERROR,
      payload: {
        msg: error.msg,
        status: error.status
      }
    });
  }
};

// Add a comment to the post
export const deletePostComment = (groupID, postID, commentID) => async (
  dispatch
) => {
  try {
    const res = await axios.put(
      `/api/groups/${groupID}/posts/${postID}/comments/${commentID}`
    );
    dispatch({
      type: DELETE_POSTCOMMENT,
      payload: res.data
    });
  } catch (error) {
    dispatch({
      type: POST_ERROR,
      payload: {
        msg: error.msg,
        status: error.status
      }
    });
  }
};
