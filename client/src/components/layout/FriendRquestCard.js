import React from 'react';
import { Button, Card, Image } from 'semantic-ui-react';
import PropTypes from 'prop-types';
import { connect } from 'react-redux';
import {
  AcceptFriendRequest,
  RejectFriendRequest
} from '../../actions/friends';

const CardExampleGroups = ({
  auth,
  friend: {
    _id,
    user: { name, avatar, email }
  },
  AcceptFriendRequest,
  RejectFriendRequest
}) => (
  <Card.Group>
    <Card>
      <Card.Content>
        <Image floated="right" size="mini" src={avatar} />
        <Card.Header>{name}</Card.Header>
        <Card.Header>{email}</Card.Header>
        <Card.Meta>Friends of Elliot</Card.Meta>
        <Card.Description>
          Steve wants to add you to the group <strong>best friends</strong>
        </Card.Description>
      </Card.Content>
      <Card.Content extra>
        <div className="ui two buttons">
          <Button basic color="green" onClick={() => AcceptFriendRequest(_id)}>
            Approve
          </Button>
          <Button basic color="red" onClick={() => RejectFriendRequest(_id)}>
            Decline
          </Button>
        </div>
      </Card.Content>
    </Card>
  </Card.Group>
);
CardExampleGroups.propTypes = {
  AcceptFriendRequest: PropTypes.func.isRequired,
  RejectFriendRequest: PropTypes.func.isRequired
};
const mapStateToProps = (state) => ({
  auth: state.auth
});
export default connect(mapStateToProps, {
  AcceptFriendRequest,
  RejectFriendRequest
})(CardExampleGroups);
