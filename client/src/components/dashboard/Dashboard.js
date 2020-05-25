import React, { Fragment, useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
import PropTypes from 'prop-types';
import Moment from 'react-moment';
import { loadUser } from '../../actions/auth';
import { getPosts } from '../../actions/post';
import { getGroups } from '../../actions/group';
import { connect } from 'react-redux';
import Spinner from '../layout/Spinner';
import GroupsFeed from './GroupsFeed';
import FriendsFeed from './FriendsFeed';
import CommunityFeed from './CommunityFeed';
import { Card } from 'semantic-ui-react';

const Dashboard = ({
  loadUser,
  auth: { user, loading },
  getPosts,
  post: { posts },
  getGroups,
  group: { groups }
}) => {
  useEffect(() => {
    loadUser();
  }, []);
  useEffect(() => {
    getPosts();
  }, []);
  useEffect(() => {
    getGroups();
  }, []);

  const [isGroupsOpen, setGroupsOpen] = useState(false);

  const dateChecker = (postDate) => {
    const d = new Date();
    const s = new Date(d).getTime();
    const difference = s - postDate;
    return difference;
  };
  let myGroupPosts = [];
  if (user) {
    user.myGroups.map((group) => {
      group._id.posts.map((post) => {
        const postDate = new Date(post.date).getTime();
        const difference = dateChecker(postDate);
        if (difference < 172800000) {
          post.groupName = group._id.name
          post.groupId = group._id._id;
          myGroupPosts.push(post);
        }
      });
    });
  }

  let filteredGroups = [];
  if (groups) {
    groups.map((group) => {
      const groupDate = new Date(group.createdAt).getTime();
      const difference = dateChecker(groupDate);
      if (difference < 172800000) {
        filteredGroups.push(group);
      }
    });
  }

  let filteredGroupPosts = [];
  if (groups) {
    groups.map((group) => {
      group.posts.map((groupPost) => {
        const postDate = new Date(groupPost.date).getTime();
        const difference = dateChecker(postDate);
        if (difference < 172800000) {
          groupPost.groupName = group.name
          groupPost.groupId = group._id
          filteredGroupPosts.push(groupPost);
        }
      });
    });
  }
  console.log(myGroupPosts)

  let filteredPosts = [];
  if (posts) {
    posts.map((post) => {
      const postDate = new Date(post.date).getTime();
      const difference = dateChecker(postDate);
      if (difference < 172800000) {
        filteredPosts.push(post);
      }
    });
  }

  if (loading) return <Spinner />;
  return (
    <section className="container">
      {user && (
        <Fragment>
          <div className="flex-r dashboard-container">
            <div className="flex-c dashboard-profile">
              <Card fluid>
                <div className="flex-c">
                  <img src={user.avatar} />
                  <span className="text-primary p-1" style={{fontSize:"1.5rem"}}>{user.name}</span>
                  <span className="text-dark">
                    Member since: <Moment format="YY/MM/DD">{user.date}</Moment>
                  </span>
                </div>
                <div className="m-1">
                  <h4
                    onClick={() => {
                      setGroupsOpen(!isGroupsOpen);
                    }}
                  >
                    My Groups
                  </h4>
                  <div className={isGroupsOpen ? `shown` : `mobile-hidden`}>
                    {user &&
                      user.myGroups.map((group) => {
                        return (
                          <div>
                            <Link to={`/groups/${group._id._id}`}>
                              {group._id.name}
                            </Link>
                          </div>
                        );
                      })}
                  </div>
                </div>
                <div className="m-1">
                  <h4
                    onClick={() => {
                      setGroupsOpen(true);
                    }}
                  >
                    My Friends
                  </h4>
                  <div className="flex-c">
                    <Link>Bla Bla</Link>
                    <Link>Bla Bla</Link>
                    <Link>Bla Bla</Link>
                  </div>
                </div>
                <Link to={`/settings`}>
                  {' '}
                  <button className="btn btn-light">
                    <i className="fas fa-users-cog settings-icon"></i>SETTINGS
                  </button>
                </Link>
              </Card>
            </div>
            <div className="flex-c newsfeed-container">
              <div className="flex-r newsfeed flex-center">
                <Card.Group>
                  <FriendsFeed />
                  {myGroupPosts && filteredGroups && (
                    <GroupsFeed
                      myGroupPosts={myGroupPosts}
                      filteredGroups={filteredGroups}
                    />
                  )}
                  {filteredPosts && filteredGroupPosts && (
                    <CommunityFeed
                      filteredPosts={filteredPosts}
                      filteredGroupPosts={filteredGroupPosts}
                    />
                  )}
                </Card.Group>
              </div>
            </div>
          </div>
        </Fragment>
      )}
    </section>
  );
};

Dashboard.propTypes = {
  loadUser: PropTypes.func.isRequired,
  getPosts: PropTypes.func.isRequired,
  getGroups: PropTypes.func.isRequired,
  group: PropTypes.object.isRequired,
  post: PropTypes.object.isRequired,
  auth: PropTypes.object.isRequired
};
const mapStateToProps = (state) => ({
  auth: state.auth,
  post: state.post,
  group: state.group
});

export default connect(mapStateToProps, { loadUser, getPosts, getGroups })(
  Dashboard
);
