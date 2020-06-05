import axios from 'axios';
import { GET_NOTIFICATIONS, GET_NOTIFICATIONS_ERROR } from './types';

export const getNotifications = () => async (dispatch) => {
  try {
    const res = await axios.get('/api/notification/');
    dispatch({ type: GET_NOTIFICATIONS, payload: res.data });
  } catch (error) {
    dispatch({
      type: GET_NOTIFICATIONS_ERROR,
      payload: error.response.data
    });
  }
};
