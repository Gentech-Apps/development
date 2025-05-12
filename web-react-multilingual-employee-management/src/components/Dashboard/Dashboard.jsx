import React, { Component } from 'react';
import NavBar from '../NavBar/NavBar.jsx';
import Header from '../Header/Header.jsx';
import { withRouter } from 'react-router-dom';
import { connect } from 'react-redux';
import * as actions from '../../actions/actions.js';
import { BrowserRouter as Router, Route, Switch, Redirect } from 'react-router-dom';
import YearlyDashboard from './YearlyDashboard/YearlyDashboard.jsx';
import MonthlyDashboard from './MonthlyDashboard/MonthView.jsx';
import DailyDashboard from './DailyDashboard/DailyDashboard.jsx';
import WeeklyDashboard from './WeeklyDashboard/WeeklyDashboard.jsx';
import BidsPage from '../BidsPage/BidsPage.jsx';

import { polyfill } from 'es6-promise';
import { PER_USER, VIEW_ONLY } from '../../tools/keys/variables.js';
polyfill();

class Dashboard extends Component {
  render() {
    // dynamic factory name in url
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

    return (
      <Router>
        <Redirect to={redirect} />
        <Route exact path={'/' + dynamicFactoryName + 'yearly'} component={YearlyDashboard} />
        <Route exact path={'/' + dynamicFactoryName + 'monthly'} component={MonthlyDashboard} />
        <Route exact path={'/' + dynamicFactoryName + 'weekly'} component={WeeklyDashboard} />
        <Route exact path={'/' + dynamicFactoryName + 'daily'} component={DailyDashboard} />
      </Router>
    );
  }
}

function mapStateToProps({ router, login }) {
  return { router, login };
}
export default withRouter(connect(mapStateToProps, actions)(Dashboard));
