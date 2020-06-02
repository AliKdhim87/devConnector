import React, { useEffect, Fragment } from 'react';
import { getFriendRequestsList } from '../../actions/friends';
// import { Link } from 'react-router-dom';
import PropTypes from 'prop-types';
import { connect } from 'react-redux';
import Spinner from '../layout/Spinner';
// import FriendRequestItem from './FriendRequestItem';
import CardExampleGroups from '../layout/FriendRquestCard';

const FriendsRequestslist = ({
  getFriendRequestsList,
  friendsObject: { friendsrquestlist, loading }
}) => {
  //   console.log('from Friends', friendrquest);
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
          {/* <ul className="profiles">
            {friendsrquestlist.length > 0 ? (
              friendsrquestlist.map((friend) => (
                <FriendRequestItem key={friend._id} friend={friend} />
              ))
            ) : (
              <h4>No friends found...</h4>
            )}
          </ul> */}
          {friendsrquestlist.length > 0 ? (
              friendsrquestlist.map((friend) => (
                <CardExampleGroups key={friend._id} friend={friend} />
              ))
            ) : (
              <h4>No friends found...</h4>
            )}
          {/* <CardExampleGroups /> */}
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
