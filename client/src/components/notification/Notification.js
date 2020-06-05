import React, { useEffect, Fragment } from 'react';
import PropTypes from 'prop-types';
import { connect } from 'react-redux';
import { Dropdown, List } from 'semantic-ui-react';
import { getNotifications } from '../../actions/notification';
import NotificationItem from './NotificationItem';
const Notification = ({
  getNotifications,
  notification: { notifications, loading }
}) => {
  useEffect(() => {
    getNotifications();
  }, [getNotifications]);
  return (
    <Fragment>
      <Dropdown icon="mail">
        <Dropdown.Menu>
          <List relaxed>
            {notifications &&
              !loading &&
              notifications.map((notification) => (
                <NotificationItem
                  key={notification._id}
                  notification={notification}
                />
              ))}
          </List>
        </Dropdown.Menu>
      </Dropdown>
    </Fragment>
  );
};

Notification.propTypes = {
  getNotifications: PropTypes.func.isRequired
};
const mapStateToProps = (state) => ({
  notification: state.notification
});
export default connect(mapStateToProps, { getNotifications })(Notification);
