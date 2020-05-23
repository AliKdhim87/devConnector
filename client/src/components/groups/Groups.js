import React, { useEffect, Fragment, useState } from 'react';
import PropTypes from 'prop-types';
import Moment from 'react-moment';
import { getGroups } from '../../actions/group';
import { Link } from 'react-router-dom';
import { connect } from 'react-redux';
import GroupItem from './GroupItem';
import GroupsForm from './GroupsForm';

const Groups = ({ getGroups, group: { groups, loading } }) => {
  useEffect(() => {
    getGroups();
  }, [getGroups]);
  const [createGroupOpen, setCreateGroupOpen] = useState(false);
  return (
    <Fragment>
      <div className="text-center">
        {!createGroupOpen && (
          <button
            className="btn btn-dark"
            onClick={() => {
              setCreateGroupOpen(true);
            }}
          >
            Create a group
          </button>
        )}
        {createGroupOpen && (
          <div className="group-create">
            <GroupsForm setCreateGroupOpen={setCreateGroupOpen} />
            <button
              className="btn btn-dark"
              onClick={() => setCreateGroupOpen(false)}
            >
              CLOSE
            </button>
          </div>
        )}
      </div>
      <GroupItem groups={groups} />
    </Fragment>
  );
};
Groups.propTypes = {
  getGroups: PropTypes.func.isRequired,
  group: PropTypes.object.isRequired
};
const mapStateToProps = (state) => ({
  group: state.group
});
export default connect(mapStateToProps, { getGroups })(Groups);
