import React, { useState } from 'react';
import PropTypes from 'prop-types';
import { connect } from 'react-redux';
import { Button } from 'semantic-ui-react';
import { addPost } from '../../actions/post';
import EmojiPicker from '../post/EmojiPicker';

const PostForm = ({ addPost }) => {
  const [formData, setFormData] = useState({
    text: '',
    link: '',
  });
  const [addLink, setAddLink] = useState(false);
  const [textWithEmoji, setTextWithEmoji] = useState('');

  const inputHandler = (e) =>
    setFormData({
      ...formData,
      [e.target.name]: e.target.value,
    });
  const { link } = formData;

  const [hideEmojiPicker, setHideEmojiPicker] = useState(true);

  const showHideEmojiPicker = () => {
    setHideEmojiPicker((prevState) => !prevState);
  };

  const insertEmoji = (emojiObj) => {
    const emoji = emojiObj.native;
    setTextWithEmoji((prevText) => prevText + emoji);
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
          addPost(formData);
          setFormData({ text: '', link: '' });
        }}
      >
        <textarea
          name='text'
          cols='30'
          rows='5'
          placeholder='Create a post'
          value={textWithEmoji}
          onChange={(e) => {
            setTextWithEmoji(e.target.value);
            setFormData({
              ...formData,
              [e.target.name]: textWithEmoji,
            });
          }}
          required
        ></textarea>

        <span
          className=' text-primary m-1 link-button'
          onClick={() => {
            setAddLink(!addLink);
          }}
        >
          <i className='fas fa-paperclip'></i>
        </span>
        <div className={addLink ? `shown` : `hidden`}>
          <input
            type='text'
            name='link'
            value={link}
            placeholder='Add a link'
            onChange={inputHandler}
          />
        </div>
        {/* <input type='submit' className='btn btn-dark my-1' value='Submit' /> */}
        {hideEmojiPicker ? (
          <Button circular onClick={showHideEmojiPicker}>
            <span
              role='img'
              aria-label='smiling face'
              aria-labelledby='smiling face'
            >
              🙂
            </span>
          </Button>
        ) : (
          <EmojiPicker
            onBlur={showHideEmojiPicker}
            onPick={(emojiObj) => {
              showHideEmojiPicker();
              insertEmoji(emojiObj);
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
