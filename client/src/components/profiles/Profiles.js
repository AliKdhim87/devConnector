import React, { Fragment, useEffect } from 'react';
import PropTypes from 'prop-types';
import { connect } from 'react-redux';
import Spinner from '../layout/Spinner';
import { getAllProfiles } from '../../actions/profile';
import ProfileItem from './ProfileItem';
const Profiles = ({ getAllProfiles, profile: { profiles, loading }, auth, isAuthenticated }) => {
  useEffect(() => {
    getAllProfiles(isAuthenticated);
  }, [getAllProfiles, isAuthenticated]);

  return (
    <Fragment>
      {loading ? (
        <Spinner />
      ) : (
        <Fragment>
          <h1 className="large text-primary">Developers</h1>
          <p className="lead">
            <i className="fab fa-connectdevelop"></i> Browse and connect with
            developers
          </p>
          <div className="profiles">
            {profiles.length > 0 ? (
              profiles.map((profile) => (
                <ProfileItem key={profile._id} profile={profile} me={auth} />
              ))
            ) : (
              <h4 className="text-center"> No Profiles found...</h4>
            )}
          </div>
        </Fragment>
      )}
    </Fragment>
  );
};

Profiles.propTypes = {
  getAllProfiles: PropTypes.func.isRequired,
  profile: PropTypes.object.isRequired
};
const mapStateToProps = (state) => ({
  profile: state.profile,
  auth: state.auth,
  isAuthenticated: state.auth.isAuthenticated
});
export default connect(mapStateToProps, { getAllProfiles })(Profiles);
