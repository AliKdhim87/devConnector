import React, { useState } from 'react';
import PropTypes from 'prop-types';
import { connect } from 'react-redux';
import { updateUser } from '../../actions/profile';
import { useHistory } from 'react-router-dom';
import { Form, Input, Image, Header, Icon } from 'semantic-ui-react';
const EditUserInfo = ({ updateUser, auth }) => {
  const history = useHistory();
  const [userInfo, setUserInfo] = useState({
    avatar: '',
    name: auth.user && auth.user.name,
  });
  const [mediaPreview, setMediaPreview] = useState('');
  const { avatar, name } = userInfo;
  const onChangeHandler = (e) => {
    if (e.target.name === 'avatar') {
      setUserInfo({ ...userInfo, avatar: e.target.files[0] });
      setMediaPreview(window.URL.createObjectURL(e.target.files[0]));
    } else {
      setUserInfo({ ...userInfo, [e.target.name]: e.target.value });
    }
  };
  const onSubmitHandler = (e) => {
    e.preventDefault();
    updateUser(avatar, name);
    history.push('/dashboard');
  };

  return (
    <Form onSubmit={onSubmitHandler}>
      <Header as='h2' block>
        <Icon name='edit' color='grey' />
        Update User
      </Header>
      <Form.Group>
        <Form.Field
          control={Input}
          type='text'
          name='name'
          label='Name'
          placeholder='Name'
          onChange={onChangeHandler}
          value={name}
        />
        <Form.Field
          control={Input}
          type='file'
          content='Select Image'
          onChange={onChangeHandler}
          name='avatar'
          label='Avatar'
          accept='image/*'
        />
      </Form.Group>
      {mediaPreview && (
        <Image src={mediaPreview} rounded centered size='medium' />
      )}
      <input
        class='btn btn-primary my-1'
        color='teal'
        icon='pencil alternate'
        content='Submit'
        type='submit'
      />
    </Form>
  );
};

EditUserInfo.propTypes = {
  updateUser: PropTypes.func.isRequired,
};
const mapStateToProps = (state) => ({
  auth: state.auth,
});
export default connect(mapStateToProps, { updateUser })(EditUserInfo);
