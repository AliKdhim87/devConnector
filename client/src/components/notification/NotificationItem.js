import React from 'react';

import { Image, List } from 'semantic-ui-react';
const NotificationItem = ({ notification }) => {
  console.log(notification);
  return (
    <List.Item>
      <Image avatar src={notification.sender.avatar} />
      <List.Content>
        <List.Header as="a" href={`/message/${notification.sender._id}`}>
          {notification.sender.name}
        </List.Header>

        <List.Description>{notification.message}</List.Description>
      </List.Content>
    </List.Item>
  );
};

export default NotificationItem;
