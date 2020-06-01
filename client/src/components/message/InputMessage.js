import React, { useState, useEffect } from 'react';
import PropTypes from 'prop-types';
import { Form, TextArea, Button } from 'semantic-ui-react';
// import io from 'socket.io-client';
let socket;
const InputMessage = ({ corresponderId, sendMessage, me, getMessages }) => {
  const [message, setMessage] = useState('');

  // useEffect(() => {
  //   socket = io('http://localhost:5000');
  //   socket.emit('message', { corresponderId });
  //   socket.on('sendMessage', (msg) => {
  //     if (msg) {
  //       return getMessages(null, msg, true);
  //       // console.log(msg);
  //     }
  //   });
  // }, []);
  return (
    <Form
      style={{ width: '99%' }}
      onSubmit={(event) => {
        event.preventDefault();
        // socket.emit('privateMessage', me && me._id, corresponderId);

        if (message === '' && message === ' ') {
          console.log('Enter somthing');
        } else {
          sendMessage({ message }, corresponderId);
          setMessage('');
        }
      }}
    >
      <TextArea
        onChange={(e) => setMessage(e.target.value)}
        placeholder='Write Your Message'
        value={message}
      />

      <Form.Field control={Button}>Submit</Form.Field>
    </Form>
  );
};

InputMessage.propTypes = {
  sendMessage: PropTypes.func.isRequired,
  corresponderId: PropTypes.string.isRequired,
};

export default InputMessage;
