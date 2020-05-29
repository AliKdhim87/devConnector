import { combineReducers } from 'redux';
import alert from './alert';
import auth from './auth';
import profile from './profile';
import post from './post';
import message from './message';
import group from './group';
export default combineReducers({ alert, auth, profile, post, group, message });
