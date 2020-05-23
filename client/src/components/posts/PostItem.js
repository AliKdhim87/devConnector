import React, { Fragment, useState, useEffect } from 'react';
import PropTypes from 'prop-types';
import { Link } from 'react-router-dom';
import Moment from 'react-moment';
import { connect } from 'react-redux';
import EmojiPicker from '../post/EmojiPicker';
import {
  addLike,
  removeLike,
  deletePost,
  addEmoji,
  removeEmoji,
} from '../../actions/post';
const PostItem = ({
  addLike,
  removeLike,
  deletePost,
  auth,
  post: { _id, text, name, avatar, user, likes, comments, date, emojis },
  showActions,
  addEmoji,
  removeEmoji,
}) => {
  const [hideEmojiPicker, setHideEmojiPicker] = useState(false);

  const handleEmojiPicker = (e) => {
    addEmoji(_id, e);
  };

  return (
    <div className='post bg-white p-1 my-1'>
      <div>
        <Link to={`/profile/${user}`}>
          <img className='round-img' src={avatar} alt='' />
          <h4>{name}</h4>
        </Link>
      </div>
      <div>
        <p className='my-1'>{text}</p>
        <p className='post-date'>
          Posted on <Moment format='YYYY/MM/DD'>{date}</Moment>
        </p>
        {showActions && (
          <Fragment>
            <button
              onClick={(e) => addLike(_id)}
              type='button'
              className='btn btn-light'
            >
              <i className='fas fa-thumbs-up'></i>{' '}
              {likes.length > 0 && <span>{likes.length}</span>}
            </button>
            <button
              onClick={(e) => removeLike(_id)}
              type='button'
              className='btn btn-light'
            >
              <i className='fas fa-thumbs-down'></i>
            </button>
            <Link to={`/posts/${_id}`} className='btn btn-primary'>
              Discussion{' '}
              {comments.length > 0 && (
                <span className='comment-count'>{comments.length}</span>
              )}
            </Link>
            {!auth.loading && user === auth.user._id && (
              <button
                onClick={(e) => deletePost(_id)}
                type='button'
                className='btn btn-danger'
              >
                <i className='fas fa-times'></i>
              </button>
            )}
          </Fragment>
        )}{' '}
        {hideEmojiPicker ? (
          <i onClick={handleEmojiPicker}>Pick an emoji</i>
        ) : (
          <EmojiPicker onPick={handleEmojiPicker} />
        )}
        {emojis.length > 0 && (
          <ul style={{ display: 'flex' }}>
            {emojis.map((emo, index) => (
              <li key={index}>
                <span onClick={() => removeEmoji(_id, emo._id)}>
                  {emo.emoji.native}
                </span>
              </li>
            ))}
          </ul>
        )}
      </div>
    </div>
  );
};

PostItem.defaultProps = {
  showActions: true,
};

PostItem.propTypes = {
  post: PropTypes.object.isRequired,
  auth: PropTypes.object.isRequired,
  addLike: PropTypes.func.isRequired,
  removeLike: PropTypes.func.isRequired,
  deletePost: PropTypes.func.isRequired,
  addEmoji: PropTypes.func.isRequired,
  removeEmoji: PropTypes.func.isRequired,
};
const mapStateToProps = (state) => ({
  auth: state.auth,
});
export default connect(mapStateToProps, {
  addLike,
  removeLike,
  deletePost,
  addEmoji,
  removeEmoji,
})(PostItem);
