import React from 'react';
import { Link } from 'react-router-dom';

// each group item in all groups page
const GroupItem = ({ groups }) => {
  return (
    <section className="container">
      {groups.map((group) => {
        return (
          <div className="all-groups flex-c text-center" key={group._id}>
            <Link to={`/groups/${group._id}`} className="group-link">
              <div className="group-item flex-c bg-primary">
                <h2 className="text">{group.name}</h2>
                <p>{group.description}</p>
                <p className="group-access">
                  {group.isPublic ? 'Public' : 'Private'}
                </p>
                <p>{group && group.members.length} member(s)</p>
              </div>
            </Link>
          </div>
        );
      })}
    </section>
  );
};

export default GroupItem;
