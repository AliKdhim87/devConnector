import React, { useEffect, Fragment, useState } from 'react';
import PropTypes from 'prop-types';
import Moment from 'react-moment';
import { Link, useParams } from 'react-router-dom';
import { connect } from 'react-redux';
import Microlink from '@microlink/react';
import {
  getGroup,
  addEvent,
  deleteEvent,
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
  addEvent,
  deleteEvent,
  group: { group, loading },
  match,
  auth
}) => {
  const { groupID } = useParams();
  useEffect(() => {
    getGroup(match.params.groupID);
  }, [getGroup, match]);
  const [settingsOpen, setSettingsOpen] = useState(false);
  const [editOpen, setEditOpen] = useState(false);
  const [addEventOpen, setAddEventOpen] = useState(false)

  const toggleEdit = () => {
    setEditOpen(!editOpen);
  };
  const toggleSettings = () => {
    setSettingsOpen(!settingsOpen);
  };
  const [addLink, setAddLink] = useState(false);
  const [formData, setFormData] = useState({
    title: '',
    text: '',
    link: ''
  });
  const [eventData, setEventData] = useState({
    title:'',
    description:'',
    start:{},
    end:{}
  })
  const onChangeEvent = (e)=>{
    setEventData({...eventData, [e.target.name]: e.target.value})
  }
  const { title, text, link } = formData;
  const onChangeInputHandler = (e) =>
    setFormData({ ...formData, [e.target.name]: e.target.value });
  const onSubmitHandler = (e, groupID, formData) => {
    e.preventDefault();
    addGroupPost(groupID, formData);
    setFormData({
      title: '',
      text: '',
      link: ''
    });
  };
  const isMember = (group, userID) => {
    if (
      group.members.filter((member) => member.user === userID).length !== 0 ||
      group.members.filter((member) => member.user._id === userID).length !== 0
    ) {
      return true;
    } else return false;
  };
  if (loading) return <Spinner />;
  return (
    <section className="container">
      {/* Container including group info */}
      <div
        className="post bg-white p-3 my-1 flex-r group-info-container"
        style={{ justifyContent: 'space-between' }}
      >
        <div className="flex-c group-info">
          <span className="text-primary large">{group && group.name}</span>
          <span>
            <strong>Description:</strong> {group && group.description}
          </span>
          <span>
            <strong>Active since:</strong>{' '}
            {group && <Moment format="YYYY/MM/DD">{group.createdAt}</Moment>}
          </span>
          <span>
            <strong>Creator:</strong>{' '}
            <a href="!#">
              {!loading && group && group.creator && group.creator.name}
            </a>
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
          {group && group.creator &&
            auth &&
            !auth.loading &&
            auth.user._id === group.creator._id && (
              <button
                className="btn btn-success m-1 mobile-button-m0"
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
      <div>
        <button className="btn btn-light">
          <a href="#discussions">Discussions</a>
        </button>
        <button className="btn btn-light">
          <a href="#member-list">Members</a>
        </button>
        <button className="btn btn-light">
          <a href="#events">Events</a>
        </button>
      </div>
      <div id="member-list text-center">
        <strong>Members:</strong>{' '}
        {group &&
          group.members.map((member) => (
            <div key={member.user._id}>
              <Link
                to={`/profile/${member.user._id}`}
                className="flex-r"
                style={{ justifyContent: 'flex-start', alignItems: 'center' }}
              >
                <img
                  src={member.user.avatar || member.avatar}
                  style={{ width: '10%' }}
                  className="round-img m-1"
                />
                <p>{member.user.name || member.name} </p>
              </Link>
            </div>
          ))}
      </div>
      {/* Group Posts(form and previous posts) */}

      {group &&
        auth &&
        !auth.loading &&
        (group.isPublic || isMember(group, auth.user._id)) && (
          <Fragment>
            <h2 className="text-primary text-center m-2" id="discussions">
              Group Discussions
            </h2>
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
                <span
                  className=" text-primary m-1 link-button"
                  onClick={() => {
                    setAddLink(!addLink);
                  }}
                >
                  <i className="fas fa-paperclip"></i>
                </span>
                <div className={addLink ? `shown` : `hidden`}>
                  <input
                    type="text"
                    name="link"
                    value={link}
                    placeholder="Add a link"
                    onChange={onChangeInputHandler}
                  />
                </div>
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
                        <div className="m-2" key={post._id}>
                          <h3>{post.title}</h3>
                          <p>{post.text}</p>
                          {post.link && post.link !== '' && !loading && (
                            <Microlink
                              media={['video', 'audio', 'image', 'logo']}
                              autoplay
                              controls
                              size="large"
                              url={post.link}
                            />
                          )}{' '}
                          <p className="post-date m-1">
                            Posted on{' '}
                            <Moment format="YYYY/MM/DD">{post.date}</Moment>
                          </p>
                          <Link to={`/groups/${groupID}/posts/${post._id}`}>
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
            <div id="events">
              <button className="btn btn-primary" onClick={()=>setAddEventOpen(!addEventOpen)}>{ addEventOpen ? 'CLOSE' : 'ADD AN EVENT'}</button>
              <div className={addEventOpen ? `add-event` : `hidden`}>
                <h3>Add an event</h3>
                <form className="form">
                <input onChange={onChangeEvent} type="text" name="title" placeholder="Title" value={eventData.title}></input>
                <textarea onChange={onChangeEvent} type="text" name="description" placeholder="Please provide a description" value={eventData.description}></textarea>
                <small className="form-text" value={eventData.start}>Start of the event</small>
                <input onChange={onChangeEvent} type="date" name="start"/>
                <small className="form-text">End of the event</small>
                <input onChange={onChangeEvent} type="date" name="end" value={eventData.end}/>
                <button onClick={()=>{addEvent(groupID, eventData)}} className="btn btn-dark">ADD</button>
                </form>
              
              </div>
              <div className="events-list">
               {group && auth && !loading && group.events.map(event=>{
                 return(
                   <Fragment key={event._id}>
                     <h4>{event.title}</h4>
                     <p>{event.description}</p>
                     <p>{event.start}</p>
                     {event.creator === auth.user._id && <button className="btn btn-danger" onClick={()=>deleteEvent(groupID, event._id)}>DELETE EVENT</button>}
                   </Fragment>
                 )
               })}
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
  addGroupPost: PropTypes.func.isRequired,
  addEvent: PropTypes.func.isRequired,
  deleteEvent: PropTypes.func.isRequired
};
const mapStateToProps = (state) => ({
  group: state.group,
  members: state.group.members,
  events: state.group.events,
  auth: state.auth
});

export default connect(mapStateToProps, {
  getGroup,
  addEvent,
  deleteEvent,
  addMember,
  removeMember,
  addGroupPost
})(GroupDetails);
