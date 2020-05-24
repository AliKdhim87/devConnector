import React, { useEffect, useState } from 'react';
import PropTypes from 'prop-types';
import Moment from 'react-moment';
import { Link, useHistory, useParams } from 'react-router-dom';
import { connect, useSelector } from 'react-redux';
import {
  getGroupPost,
  deleteGroupPost,
  addPostComment,
  deletePostComment,
  updateGroupPost
} from '../../actions/group';
import Spinner from '../layout/Spinner';

const GroupPosts = ({
  auth,
  getGroupPost,
  deleteGroupPost,
  updateGroupPost,
  addPostComment,
  deletePostComment,
  group: { post, comments, loading }
}) => {
  const history = useHistory();
  const [openDeletePost, setOpenDeletePost] = useState(false);
  const [openEditPost, setOpenEditPost] = useState(false);
  const { postID, groupID } = useParams();
  useEffect(() => {
    getGroupPost(groupID, postID);
  }, [getGroupPost, postID, groupID]);
  const [formData, setFormData] = useState({
    text: ''
  });
  const [editData, setEditData] = useState({
    text: '',
    title: ''
  });
  const { text } = formData;
  const onChangeInputHandler = (e) =>
    setFormData({ ...formData, [e.target.name]: e.target.value });
  const onSubmitHandler = (e) => {
    e.preventDefault();
    addPostComment(groupID, postID, formData);
    setFormData({
      text: ''
    });
  };

  const onChangeEdit = (e) => {
    setEditData({ ...editData, [e.target.name]: e.target.value });
  };
  const onSubmitEdit = (e) => {
    e.preventDefault();
    updateGroupPost(groupID, postID, editData);
    setEditData({
      text: '',
      title: ''
    });
  };

  if (!loading && post && post.creator && auth)
    return (
      <section className="container">
        <span
          className="btn"
          onClick={() => {
            history.push(`/groups/${groupID}`);
          }}
        >
          Back to the Group
        </span>
        <div className="post bg-white p-1 my-1">
          <div>
            {!loading && (
              <Link to={`/profile/${post.creator._id}`}>
                <img className="round-img" src={post.avatar} alt="" />
                <h4>{post.name}</h4>
              </Link>
            )}
          </div>
          <div>
            <p className="group-post-text-and-date">
              {!loading && post && post.text}
            </p>
            <p className="post-date group-post-text-and-date">
              {post && <Moment format="YYYY/MM/DD">{post.date}</Moment>}
            </p>
          </div>
          <div className="flex-r group-post-owner-buttons">
            {!loading && !auth.loading && auth.user._id === post.creator._id && (
              <button
                type="button"
                className={
                  openEditPost || openDeletePost ? `hidden` : `btn btn-dark`
                }
                onClick={() => {
                  setOpenEditPost(true);
                }}
              >
                EDIT
              </button>
            )}
            {!loading && !auth.loading && auth.user._id === post.creator._id && (
              <button
                type="button"
                className={
                  openDeletePost || openEditPost ? `hidden` : `btn btn-danger`
                }
                onClick={() => {
                  setOpenDeletePost(true);
                }}
              >
                <i className="fas fa-times"></i>
              </button>
            )}
          </div>
          <div>
            <div className={openEditPost ? `shown` : `hidden`}>
              <form className="form my-1" onSubmit={onSubmitEdit}>
                <input
                  name="title"
                  style={{ margin: '1rem 0' }}
                  value={editData.title}
                  type="text"
                  onChange={onChangeEdit}
                  placeholder="Update the title"
                  required
                ></input>
                <textarea
                  name="text"
                  value={editData.text}
                  cols="30"
                  rows="5"
                  placeholder="Update the post"
                  onChange={onChangeEdit}
                  required
                ></textarea>
                <input
                  type="submit"
                  className="btn btn-dark my-1"
                  value="Submit"
                />
                <button
                  className="btn btn-primary"
                  onClick={() => {
                    setOpenEditPost(false);
                  }}
                >
                  CANCEL
                </button>
              </form>
            </div>

            <div className={openDeletePost ? `shown` : `hidden`}>
              <small>
                {' '}
                Do you want to proceed and delete the post with all the
                comments?
              </small>
              <div>
                <button
                  className="btn btn-danger"
                  onClick={() => {
                    deleteGroupPost(groupID, postID);
                    history.push(`/groups/${groupID}`);
                  }}
                >
                  DELETE
                </button>
                <button
                  className="btn btn-primary"
                  onClick={() => {
                    setOpenDeletePost(false);
                  }}
                >
                  CANCEL
                </button>
              </div>
            </div>
          </div>
        </div>

        <div className="post-form">
          <div className="bg-primary p">
            <h3>Leave A Comment</h3>
          </div>
          <form className="form my-1" onSubmit={onSubmitHandler}>
            <textarea
              name="text"
              value={text}
              type="text"
              cols="30"
              rows="5"
              onChange={onChangeInputHandler}
              placeholder="Comment on this post"
              required
            ></textarea>
            <input type="submit" className="btn btn-dark my-1" value="Submit" />
          </form>
        </div>

        <div className="comments">
          {!loading &&
            post &&
            post.comments.map((comment) => (
              <div className="post bg-white p-1 my-1" key={comment._id}>
                <div>
                  <Link to={`/profile/${comment.userId}`}>
                    <img className="round-img" src={comment.avatar} alt="" />
                    <h4>{comment.name}</h4>-{' '}
                  </Link>
                </div>
                <div>
                  <p className="my-1">{comment.text}</p>
                  <p className="post-date">
                    Posted on{' '}
                    <Moment format="YYYY/MM/DD">{comment.date}</Moment>
                  </p>
                  {comment && comment.userId === auth.user._id && (
                    <button
                      type="button"
                      className="btn btn-danger"
                      onClick={() => {
                        deletePostComment(groupID, postID, comment._id);
                      }}
                    >
                      <i className="fas fa-times"></i>
                    </button>
                  )}
                </div>
              </div>
            ))}
        </div>
      </section>
    );
  return <Spinner />;
};

GroupPosts.propTypes = {
  getGroupPost: PropTypes.func.isRequired,
  deleteGroupPost: PropTypes.func.isRequired,
  addPostComment: PropTypes.func.isRequired,
  deletePostComment: PropTypes.func.isRequired,
  updateGroupPost: PropTypes.func.isRequired,
  post: PropTypes.object.isRequired,
  group: PropTypes.object.isRequired,
  auth: PropTypes.object.isRequired,
  comments: PropTypes.array
};
const mapStateToProps = (state) => ({
  group: state.group,
  post: state.group.post,
  auth: state.auth,
  comments: state.group.post.comments
});

export default connect(mapStateToProps, {
  getGroupPost,
  updateGroupPost,
  deleteGroupPost,
  addPostComment,
  deletePostComment
})(GroupPosts);
