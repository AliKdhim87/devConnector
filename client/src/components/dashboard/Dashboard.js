import React, { useEffect, Fragment, useState } from 'react';
import { Button, Header, Icon, Modal } from 'semantic-ui-react';

import PropTypes from 'prop-types';
import { Link } from 'react-router-dom';
import { getCurrentProfile, deleteAccount } from '../../actions/profile';
import { loadUser } from '../../actions/auth';
import { connect } from 'react-redux';
import Spinner from '../layout/Spinner';
import DashboardActios from './DashboardActions';
import Experience from './Experience';
import Education from './Education';
const Dashboard = ({
  getCurrentProfile,
  deleteAccount,
  loadUser,
  profile: { profile, loading },
  auth: { user },
}) => {
  useEffect(() => {
    getCurrentProfile();
    loadUser();
  }, [getCurrentProfile, loadUser]);
  const [open, setOpen] = useState(false);

  return loading && profile === null ? (
    <Spinner />
  ) : (
    <Fragment>
      <h1 className='large text-primary'>Dashboard</h1>
      <p className='lead'>
        <i className='fas fa-user'></i>
        Welcome {user && user.name}
      </p>
      {profile !== null ? (
        <Fragment>
          <DashboardActios />
          <Experience experience={profile.experience} />
          <Education education={profile.education} />
          <div className='my-2'></div>
          <Modal
            open={open}
            trigger={
              <Button color='red' onClick={() => setOpen(true)}>
                Delete My Account
              </Button>
            }
          >
            <Header icon='user' content='Dangerous zone' />
            <Modal.Content>
              <p>Are you sure? this can NOT be undone!</p>
            </Modal.Content>
            <Modal.Actions>
              <Button color='grey' onClick={() => setOpen(false)}>
                <Icon name='remove' /> No
              </Button>
              <Button color='red' onClick={() => deleteAccount()}>
                <Icon name='checkmark' /> Yes
              </Button>
            </Modal.Actions>
          </Modal>
        </Fragment>
      ) : (
        <Fragment>
          <p>You have not yet setup a profile, please add some info.</p>
          <Link to='/create-profile' className='btn btn-primary my-1'>
            Create Profile
          </Link>
        </Fragment>
      )}
    </Fragment>
  );
};

Dashboard.propTypes = {
  getCurrentProfile: PropTypes.func.isRequired,
  deleteAccount: PropTypes.func.isRequired,
  auth: PropTypes.object.isRequired,
  profile: PropTypes.object.isRequired,
};
const mapStateToProps = (state) => ({
  auth: state.auth,
  profile: state.profile,
});
export default connect(mapStateToProps, {
  getCurrentProfile,
  deleteAccount,
  loadUser,
})(Dashboard);
