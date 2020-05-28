import React, { useState } from 'react';
import PropTypes from 'prop-types';
import { connect } from 'react-redux';
import { Button } from 'semantic-ui-react';
import { addPost } from '../../actions/post';
import EmojiPicker from '../post/EmojiPicker';

const PostForm = ({ addPost }) => {
  const [text, setText] = useState('');
  const [emojiStr, setEmojiStr] = useState('');
  const [hideEmojiPicker, setHideEmojiPicker] = useState(true);

  const showHideEmojiPicker = () => {
    setHideEmojiPicker((prevState) => !prevState);
  };

  const insertEmoji = (e) => {
    const emoji = e.native;
    console.log(emoji);
    setEmojiStr(emoji);
    console.log({ emojiStr });

    setText((prevText) => prevText + emojiStr);

    console.log({ text });
  };

  return (
    <div className='post-form'>
      <div className='bg-primary p'>
        <h3>Say Something...</h3>
      </div>
      <form
        className='form my-1'
        onSubmit={(e) => {
          e.preventDefault();
          addPost({ text });
          setText('');
        }}
      >
        <textarea
          name='text'
          cols='30'
          rows='5'
          placeholder='Create a post'
          value={text}
          onChange={(e) => setText(e.target.value)}
          required
        ></textarea>
        {hideEmojiPicker ? (
          <Button circular onClick={showHideEmojiPicker}>
            🙂
          </Button>
        ) : (
          <EmojiPicker
            onBlur={showHideEmojiPicker}
            onPick={(e) => {
              showHideEmojiPicker();
              insertEmoji(e);
            }}
          />
        )}
        <input type='submit' className='btn btn-dark my-1' value='Submit' />
      </form>
    </div>
  );
};

PostForm.propTypes = {
  addPost: PropTypes.func.isRequired,
};

export default connect(null, { addPost })(PostForm);
