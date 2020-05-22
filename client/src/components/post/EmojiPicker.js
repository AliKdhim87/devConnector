import React from 'react';
import 'emoji-mart/css/emoji-mart.css';
import { Picker } from 'emoji-mart';

const EmojiPicker = ({ onPick }) => {
  return <Picker onClick={onPick} />;
};

export default EmojiPicker;
