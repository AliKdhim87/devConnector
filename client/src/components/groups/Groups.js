import React, { useEffect } from "react";
import PropTypes from "prop-types";
import Moment from "react-moment";
import { getGroups } from "../../actions/group";
import { Link } from "react-router-dom";
import { connect } from "react-redux";
import GroupItem from "./GroupItem";

const Groups = ({ getGroups, group: { groups, loading } }) => {
  useEffect(() => {
    getGroups();
  }, [getGroups]);
  return <GroupItem groups={groups} />;
};
Groups.propTypes = {
  getGroups: PropTypes.func.isRequired,
  group: PropTypes.object.isRequired,
};
const mapStateToProps = (state) => ({
  group: state.group,
});
export default connect(mapStateToProps, { getGroups })(Groups);
