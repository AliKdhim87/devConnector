import React, { useEffect, Fragment, useState } from 'react';
import PropTypes from 'prop-types';
import Moment from 'react-moment';
import { Link, useParams } from 'react-router-dom';
import { connect } from 'react-redux';
import {
  getGroup,
  addMember,
  removeMember,
  addGroupPost
} from '../../actions/group';
import GroupOwnerDashboard from './GroupOwnerDashboard';
import Spinner from '../layout/Spinner';

// detailed view of single group

const GroupDetails = ({
  getGroup,
  addMember,
  removeMember,
  addGroupPost,
  group: { group, loading },
  match,
  auth
}) => {
  const { groupID } = useParams();
  useEffect(() => {
    getGroup(match.params.groupID);
  }, [getGroup, match]);
  const [settingsOpen, setSettingsOpen] = useState(false);
  const toggleSettings = () => {
    setSettingsOpen(!settingsOpen);
  };
  const [formData, setFormData] = useState({
    title: '',
    text: ''
  });
  const { title, text } = formData;
  const onChangeInputHandler = (e) =>
    setFormData({ ...formData, [e.target.name]: e.target.value });
  const onSubmitHandler = (e, groupID, formData) => {
    e.preventDefault();
    addGroupPost(groupID, formData);
    setFormData({
      title: '',
      text: ''
    });
  };
  const isMember = (group, userID) => {
    if (group.members.filter((member) => member.user._id === userID).length !== 0) {
      return true;
    } else return false;
  };
  if (loading) return <Spinner />;
  return (
    <section className="container">
      {/* Container including group info */}
      <div className="post bg-white p-3 my-1 flex-r group-info-container">
        <div className="flex-c group-info">
          <span className="text-primary large">{group && group.name}</span>
          <span>
            <strong>Description:</strong> {group && group.description}
          </span>
          <span>
            <strong>Active since:</strong>{' '}
            {group && <Moment format="YYYY/MM/DD">{group.createdAt}</Moment>}
          </span>
        </div>
        <div className="flex-c group-members">
          <span>
            <strong>Creator:</strong>{' '}
            <a href="!#">
              {!loading && group && group.creator && group.creator.name}
            </a>
          </span>
          <span>
            <strong>Members:</strong>{' '}
            {group &&
              group.members.map((member) => (
                <Link to={`/profile/${member.user._id}`} key={member.user._id}>
                  {member.name}{' '}
                </Link>
              ))}
          </span>
        </div>
        <div className="group-buttons">
          {group &&
          auth &&
          !auth.loading &&
          group.members &&
          isMember(group, auth.user._id) ? (
            <button
              className="btn btn-primary m-1 mobile-button-m0"
              onClick={() => removeMember(groupID)}
            >
              LEAVE
            </button>
          ) : (
            <button
              className="btn btn-primary m-1 mobile-button-m0"
              onClick={() => addMember(groupID)}
            >
              JOIN
            </button>
          )}
          {/* Button that toggle between settings for the creator of the group */}
          {group &&
            auth &&
            !auth.loading &&
            auth.user._id === group.creator._id && (
              <button
                className="btn btn-success m-1"
                onClick={() => toggleSettings()}
              >
                {settingsOpen ? 'CLOSE' : 'SETTINGS'}
              </button>
            )}
        </div>
      </div>
      {/* Settings component for authorized user(toggle) */}
      <div className={settingsOpen ? `shown` : `hidden`}>
        {group && <GroupOwnerDashboard isPublic={group.isPublic} />}
      </div>
      <p className="lead text-center">
        <i className="fas fa-user"></i> Welcome to {group && group.name}
      </p>
      {group &&
        !group.isPublic &&
        auth &&
        !auth.loading &&
        !isMember(group, auth.user._id) && (
          <div className="bg-white">
            <h2 className="bg-light text-center p-3">
              If you want to see the posts, join the group
            </h2>
          </div>
        )}
      {/* Group Posts(form and previous posts) */}

      {group &&
        auth &&
        !auth.loading &&
        (group.isPublic || isMember(group, auth.user._id)) && (
          <Fragment>
            <h2 className="text-primary text-center m-2">Group Discussions</h2>
            <div className="post-form">
              <div className="bg-primary p">
                <h3>Start a discussion</h3>
              </div>
              <form
                className="form my-1"
                onSubmit={(e) =>
                  onSubmitHandler(e, match.params.groupID, formData)
                }
              >
                <input
                  style={{ margin: '1rem 0' }}
                  name="title"
                  value={title}
                  type="text"
                  onChange={onChangeInputHandler}
                  placeholder="Please provide a title"
                ></input>
                <textarea
                  name="text"
                  value={text}
                  cols="30"
                  rows="5"
                  placeholder="Create a post"
                  onChange={onChangeInputHandler}
                  required
                ></textarea>
                <input
                  type="submit"
                  className="btn btn-dark my-1"
                  value="Submit"
                />
              </form>
            </div>
            <div className="posts">
              <div className="post bg-white p-1 my-1 flex-c">
                {group && group.posts.length === 0 ? (
                  <div>
                    <h3 className="text-dark">NO POSTS SHARED</h3>
                  </div>
                ) : (
                  <div>
                    {group &&
                      group.posts.map((post) => (
                        <div className="discussion-item">
                          <h3 className="m-0">{post.title}</h3>
                          <p className="post-date" style={{ margin: '0' }}>
                            Posted on{' '}
                            <Moment format="YYYY/MM/DD">{post.date}</Moment>
                          </p>
                          <Link
                            to={`/groups/${groupID}/posts/${post._id}`}
                            key={post._id}
                          >
                            <span className="btn btn-primary">
                              Discussion{' '}
                              <span className="comment-count">
                                {post.comments.length}
                              </span>
                            </span>
                          </Link>
                        </div>
                      ))}
                  </div>
                )}
              </div>
            </div>
          </Fragment>
        )}
    </section>
  );
};
GroupDetails.propTypes = {
  getGroup: PropTypes.func.isRequired,
  addMember: PropTypes.func.isRequired,
  removeMember: PropTypes.func.isRequired,
  group: PropTypes.object.isRequired,
  members: PropTypes.array,
  auth: PropTypes.object.isRequired,
  addGroupPost: PropTypes.func.isRequired
};
const mapStateToProps = (state) => ({
  group: state.group,
  members: state.group.members,
  auth: state.auth
});

export default connect(mapStateToProps, {
  getGroup,
  addMember,
  removeMember,
  addGroupPost
})(GroupDetails);
