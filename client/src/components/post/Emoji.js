import React from 'react';
import 'emoji-mart/css/emoji-mart.css';
import { Picker } from 'emoji-mart';

const Emoji = ({ postId, addEmoji }) => {
  const addEmojiToPost = (e) => {
    console.log(e);
    addEmoji(postId, e);
  };

  return <Picker onSelect={addEmojiToPost} />;
};

export default Emoji;
