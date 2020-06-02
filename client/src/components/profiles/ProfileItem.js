import React from 'react';
import { Link } from 'react-router-dom';
import PropTypes from 'prop-types';

const ProfileItem = ({
  profile: {
    user: { _id, name, avatar },
    status,
    company,
    location,
    skills
  },
  me
}) => {
  return (
    <div className="profile bg-light">
      <img src={avatar} className="round-img" alt={name} />
      <div>
        <h2>{name}</h2>
        <p>
          {status} {company && <span> at {company}</span>}
        </p>
        <p className="my-1">{location && <span>{location}</span>}</p>
        <Link to={`/profile/${_id}`} className="btn btn-primary">
          View Profile
        </Link>
        {me.isAuthenticated && me.user._id !== _id && (
          <Link to={`/message/${_id}`} className="btn btn-primary my">
            Send Message
          </Link>
        )}
      </div>
      <ul>
        {skills.slice(0, 4).map((skill, index) => (
          <li key={index} className="text-primary">
            <i className="fas fa-check"></i> {skill}{' '}
          </li>
        ))}
      </ul>
    </div>
  );
};
ProfileItem.propTypes = {
  profile: PropTypes.object.isRequired
};
export default ProfileItem;
