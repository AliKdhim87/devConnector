import React, { useEffect, useState, match } from "react";
import PropTypes from "prop-types";
import Moment from "react-moment";
import { Link, useHistory, useParams } from "react-router-dom";
import { connect, useSelector } from "react-redux";
import {
  getGroupPost,
  deleteGroupPost,
  addPostComment,
  deletePostComment
} from "../../actions/group";
import Spinner from "../layout/Spinner";

const GroupPosts = ({
  auth,
  getGroupPost,
  deleteGroupPost,
  addPostComment,
  deletePostComment,
  group: { post, loading },
}) => {
  const history = useHistory();
  const { postID, groupID } = useParams();
  useEffect(() => {
    getGroupPost(groupID, postID);
  }, [getGroupPost, postID, groupID]);
  const [formData, setFormData] = useState({
    text: "",
  });
  const { text } = formData;
  const onChangeInputHandler = (e) =>
    setFormData({ ...formData, [e.target.name]: e.target.value });
  const onSubmitHandler = (e) => {
    e.preventDefault();
    addPostComment(groupID, postID, formData);
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
                <img className="round-img" src={post.creator.avatar} alt="" />
                <h4>{post.creator.name}</h4>
              </Link>
            )}
          </div>
          <div>
            <p>{!loading && post && post.text}</p>
            <p className="post-date">{post && post.date}</p>
          </div>
          {!loading && !auth.loading && auth.user._id === post.creator._id && (
            <button type="button" className="btn btn-dark">
              EDIT
            </button>
          )}
          {!loading && !auth.loading && auth.user._id === post.creator._id && (
            <button
              type="button"
              className="btn btn-danger"
              onClick={() => {
                deleteGroupPost(groupID, postID);
                history.push(`/groups/${groupID}`);
              }}
            >
              <i className="fas fa-times"></i>
            </button>
          )}
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
          <div className="post bg-white p-1 my-1">
            <div>
              <a href="profile.html">
                <img
                  className="round-img"
                  src="https://www.gravatar.com/avatar/205e460b479e2e5b48aec07710c08d50?s=200"
                  alt=""
                />
                <h4>John Doe</h4>
              </a>
            </div>
            <div>
              <p className="my-1">{post && JSON.stringify(post.comments)}</p>
              <p className="post-date">Posted on 04/16/2019</p>
            </div>
          </div>
          {!loading &&
            post &&
            post.comments.map((comment) => (
              <div className="post bg-white p-1 my-1" key={comment._id}>
                <div>
                  <Link to={`/profile/${comment.creator._id}`}>
                    <img
                      className="round-img"
                      src={comment.creator.avatar}
                      alt=""
                    />
                    <h4>{comment.creator.name}</h4>-{" "}
                  </Link>
                </div>
                <div>
                  <p className="my-1">{comment.text}</p>
                  <p className="post-date">Posted on {comment.date}</p>
                  <button type="button" className="btn btn-danger">
                    <i className="fas fa-times"></i>
                  </button>
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
  post: PropTypes.object.isRequired,
  group: PropTypes.object.isRequired,
  auth: PropTypes.object.isRequired,
};
const mapStateToProps = (state) => ({
  group: state.group,
  post: state.group.post,
  auth: state.auth,
});

export default connect(mapStateToProps, {
  getGroupPost,
  deleteGroupPost,
  addPostComment,
  deletePostComment,
})(GroupPosts);
