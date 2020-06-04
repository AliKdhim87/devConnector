import React, { useEffect, Fragment } from 'react';
import { getFriendRequestsList } from '../../actions/friends';
import PropTypes from 'prop-types';
import { connect } from 'react-redux';
import Spinner from '../layout/Spinner';
// import FriendRequestItem from './FriendRequestItem';
import FriendRquestCard from '../layout/FriendRquestCard';

const FriendsRequestslist = ({
  getFriendRequestsList,
  friendsObject: { friendsrquestlist, loading }
}) => {
  useEffect(() => {
    getFriendRequestsList();
  }, [getFriendRequestsList]);
  return (
    <Fragment>
      {loading ? (
        <Spinner />
      ) : (
        <Fragment>
          <h1 className="large text-primary">Friends request List</h1>
          {friendsrquestlist.length > 0 ? (
            friendsrquestlist.map((friend) => (
              <FriendRquestCard key={friend._id} friend={friend} />
            ))
          ) : (
            <h4>No friends found...</h4>
          )}
        </Fragment>
      )}
    </Fragment>
  );
};

FriendsRequestslist.propTypes = {
  getFriendRequestsList: PropTypes.func.isRequired,
  friendsObject: PropTypes.object.isRequired
};

const mapStateToProps = (state) => ({
  friendsObject: state.friendsObject
});

export default connect(mapStateToProps, { getFriendRequestsList })(
  FriendsRequestslist
);
