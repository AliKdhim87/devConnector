import React from 'react';
import { Link } from 'react-router-dom';
import { Card } from 'semantic-ui-react';

// each group item in all groups page
const GroupItem = ({ groups }) => {
  return (
    <section className="container">
      {groups.map((group) => {
        return (
          <div className="all-groups flex-c text-center" key={group._id}>
            <Card fluid color="teal" style={{ marginBottom: '1rem' }}>
              <Link to={`/groups/${group._id}`} className="group-link">
                <div className="group-item flex-c">
                  <h2 className="text">{group.name}</h2>
                  <p>{group.description}</p>
                </div>
                <p className="group-access" style={{width:"15%"}}>
                  {group.isPublic ? 'Public' : 'Private'}
                </p>
                <p>{group && group.members.length} member(s)</p>
              </Link>
            </Card>
          </div>
        );
      })}
    </section>
  );
};

export default GroupItem;
