import React, { Component } from 'react';
import { withRouter, BrowserRouter as Router, Route, Link, Redirect } from 'react-router-dom';
import { polyfill } from 'es6-promise';
//redux configs
import { connect } from 'react-redux';
import * as actions from '../../actions/actions';
import { PER_USER, VIEW_ONLY } from '../../tools/keys/variables';
polyfill();
class HomePage extends Component {
  componentWillReceiveProps() {
    if (this.props.login.user.factory_name != null)
      this.props.history.push(`/${this.props.login.user.factory_name}`);
  }

  render() {
    // dynamic url factory name
    const dynamicFactoryName = this.props.login.user.factory_name;

    let redirect = `/${dynamicFactoryName}/yearly`;
    if (window.innerWidth <= 800) {
      redirect = `/${dynamicFactoryName}/monthly/${new Date()}`;
    }

    if (
      this.props.login.user.privileges.includes(PER_USER) ||
      this.props.login.user.privileges.includes(VIEW_ONLY)
    ) {
      redirect = `/${dynamicFactoryName}/monthly`;
    }

    return <div>{dynamicFactoryName != null ? <Redirect to={redirect} /> : null}</div>;
  }
}

function mapStateToProps({ login }) {
  return { login };
}
export default withRouter(connect(mapStateToProps, actions)(HomePage));
