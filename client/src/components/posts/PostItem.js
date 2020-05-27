import React, { Fragment } from 'react';
import PropTypes from 'prop-types';
import { Link } from 'react-router-dom';
import Moment from 'react-moment';
import Microlink from '@microlink/react';
import { connect } from 'react-redux';
import { addLike, removeLike, deletePost } from '../../actions/post';
import Spinner from '../layout/Spinner';
const PostItem = ({
  addLike,
  removeLike,
  deletePost,
  auth,
  post: { _id, text, name, link, avatar, user, likes, comments, date, loading },
  showActions
}) => {
  if (loading) return <Spinner />;
  return (
    <div className="post bg-white p-1 my-1">
      <div>
        <Link to={`/profile/${user._id}`}>
          <img className="round-img" src={user.avatar || avatar} alt="" />
          <h4>{user.name || name}</h4>
        </Link>
      </div>
      <div>
        <p className="my-1">{text}</p>
        {link && link !== '' && !loading && (
          <Microlink
            media={['video', 'audio', 'image', 'logo']}
            autoplay
            controls
            size="large"
            url={link}
          />
        )}
        <p className="post-date">
          Posted on <Moment format="YYYY/MM/DD">{date}</Moment>
        </p>

        {showActions && (
          <Fragment>
            <button
              onClick={(e) => addLike(_id)}
              type="button"
              className="btn btn-light"
            >
              <i className="fas fa-thumbs-up"></i>{' '}
              {likes.length > 0 && <span>{likes.length}</span>}
            </button>
            <button
              onClick={(e) => removeLike(_id)}
              type="button"
              className="btn btn-light"
            >
              <i className="fas fa-thumbs-down"></i>
            </button>
            <Link to={`/posts/${_id}`} className="btn btn-primary">
              Discussion{' '}
              {comments.length > 0 && (
                <span className="comment-count">{comments.length}</span>
              )}
            </Link>
            {!auth.loading &&
              auth &&
              (user._id === auth.user._id || user === auth.user._id) && (
                <button
                  onClick={(e) => deletePost(_id)}
                  type="button"
                  className="btn btn-danger"
                >
                  <i className="fas fa-times"></i>
                </button>
              )}
          </Fragment>
        )}
      </div>
    </div>
  );
};
PostItem.defaultProps = {
  showActions: true
};

PostItem.propTypes = {
  post: PropTypes.object.isRequired,
  auth: PropTypes.object.isRequired,
  addLike: PropTypes.func.isRequired,
  removeLike: PropTypes.func.isRequired,
  deletePost: PropTypes.func.isRequired
};
const mapStateToProps = (state) => ({
  auth: state.auth
});
export default connect(mapStateToProps, { addLike, removeLike, deletePost })(
  PostItem
);
