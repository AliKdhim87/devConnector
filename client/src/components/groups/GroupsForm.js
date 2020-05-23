import React, { Fragment, useState } from 'react';
import { withRouter, Link, useHistory} from 'react-router-dom';
import PropTypes from 'prop-types';
import { connect } from 'react-redux';
import { addGroup } from '../../actions/group';

const GroupsForm = ({addGroup}) => {
  const history = useHistory();
  const [formData, setFormData] = useState({
    name : "",
    description : "",
    isPublic : false
  });
  const {
    name,
    description,
    isPublic
  } = formData;
  const onChangeInputHandler = (e) =>
    setFormData({ ...formData, [e.target.name]: e.target.value });
  const onSubmitHandler = (e) => {
    e.preventDefault();
    addGroup(formData);
    history.push('/groups')
  };
  return (
    <section className="container">
      <h1 className="large text-primary">Create A New Group</h1>

      <small>* = required field</small>
      <form className="form" onSubmit= {onSubmitHandler}>
        <div className="form-group">
          <select name="isPublic" value={isPublic} onChange = {onChangeInputHandler}>
            <option value={true} >Public(everyone)</option>
            <option value={false}>Private(only members)</option>
          </select>
          <small className="form-text">
            Choose who can see posts in your group
          </small>
        </div>
        <div className="form-group">
          <input type="text" onChange={onChangeInputHandler} placeholder="Name" name="name" value={name} />
          <small className="form-text">
            Choose an appropriate name for your group.
          </small>
        </div>
        <div className="form-group">
          <textarea
            placeholder="A short description about the group"
            name="description"
            value={description}
            onChange = {onChangeInputHandler}
          ></textarea>
          <small className="form-text">
            Tell us what the purpose of the group is.
          </small>
        </div>
        <div>
          <button className="btn btn-primary">CREATE GROUP</button>
        </div>
      </form>
    </section>
  );
};

GroupsForm.propTypes = {
  addGroup: PropTypes.func.isRequired,
};

export default connect(null, { addGroup })(GroupsForm);


