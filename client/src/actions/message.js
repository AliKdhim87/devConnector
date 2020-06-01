import axios from 'axios';

import { setAlert } from './alert';
import {
  SEND_MESSAGE,
  GET_USERS,
  GET_MESSAGES,
  DELETE_MESSAGE,
  DELETE_ALL_MESSAGES,
  SEND_MESSAGE_ERROR,
} from './types';

export const sendMessage = (formData, corresponderId) => async (dispatch) => {
  const config = {
    headers: {
      'Content-Type': 'application/json',
    },
  };

  try {
    const res = await axios.post(
      `/api/users/message/${corresponderId}`,
      formData,
      config
    );

    dispatch({ type: SEND_MESSAGE, payload: res.data });
  } catch (error) {
    const errors = error.response.data.errors;

    if (errors) {
      errors.forEach((error) => dispatch(setAlert(error.msg, 'danger')));
    }

    dispatch({
      type: SEND_MESSAGE_ERROR,
      payload: {
        msg: error.response.data.statusText,
        status: error.response.status,
      },
    });
  }
};

export const getMessages = (
  corresponderId,
  formData,
  socketMsg = false
) => async (dispatch) => {
  if (socketMsg) {
    console.log(formData);
    return dispatch({ type: GET_MESSAGES, payload: formData });
  }
  try {
    const res = await axios.get(`/api/users/message/${corresponderId}`);

    dispatch({ type: GET_MESSAGES, payload: res.data.messages });
  } catch (error) {
    dispatch({
      type: SEND_MESSAGE_ERROR,
      payload: {
        msg: error.response.data.statusText,
        status: error.response.status,
      },
    });
  }
};

export const fetchContacts = () => async (dispatch) => {
  try {
    const res = await axios.get('/api/users/message');

    dispatch({ type: GET_USERS, payload: res.data.corresponders });
  } catch (error) {
    dispatch({
      type: SEND_MESSAGE_ERROR,
      payload: {
        msg: error.response.data.statusText,
        status: error.response.status,
      },
    });
  }
};

export const deleteMesage = (corresponderId, messageId) => async (dispatch) => {
  try {
    const res = await axios.delete(
      `/api/users/message/${corresponderId}/${messageId}`
    );
    dispatch({ type: DELETE_MESSAGE, payload: res.data });
  } catch (error) {
    dispatch({
      type: SEND_MESSAGE_ERROR,
      payload: {
        msg: error.response.data.statusText,
        status: error.response.status,
      },
    });
  }
};
export const deleteAllMessages = (corresponderId) => async (dispatch) => {
  try {
    await axios.patch(`/api/users/message/${corresponderId}`);
    dispatch({ type: DELETE_ALL_MESSAGES, payload: corresponderId });
  } catch (error) {
    dispatch({
      type: SEND_MESSAGE_ERROR,
      payload: {
        msg: error.response.data.statusText,
        status: error.response.status,
      },
    });
  }
};
