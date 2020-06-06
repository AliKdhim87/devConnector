import React, { useEffect, Fragment } from 'react';
import { getFriendsList } from '../../actions/friends';
import { Link } from 'react-router-dom';
import PropTypes from 'prop-types';
import { connect } from 'react-redux';
import Spinner from '../layout/Spinner';
import FriendItem from './FriendItem';

const FriendsList = ({
  getFriendsList,
  friendsObject: { friends, loading }
}) => {
  useEffect(() => {
    getFriendsList();
  }, [getFriendsList]);
  return (
    <Fragment>
      {loading ? (
        <Spinner />
      ) : (
        <Fragment>
          <Link to="/requests" className="btn btn-light">
            See Friend Requests
          </Link>
          <h1 className="large text-primary">Friends List</h1>
          <div className="profiles">
            {friends.length > 0 ? (
              friends.map((friend) => (
                <FriendItem key={friend.id} friend={friend} />
              ))
            ) : (
              <h4>No friends found...</h4>
            )}
          </div>
        </Fragment>
      )}
    </Fragment>
  );
};

FriendsList.propTypes = {
  getFriendsList: PropTypes.func.isRequired,
  friendsObject: PropTypes.object.isRequired
};

const mapStateToProps = (state) => ({
  friendsObject: state.friendsObject
});

export default connect(mapStateToProps, { getFriendsList })(FriendsList);
