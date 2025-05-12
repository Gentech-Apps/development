import React, { Component } from 'react';
import { connect } from 'react-redux';
import * as actions from '../../actions/actions';
import { withRouter } from 'react-router-dom';
import '../../sass/sideBar/sideBar.scss';
import { BrowserRouter as Router, Route, Link, Redirect } from 'react-router-dom';
import { PER_USER } from '../../tools/keys/variables';
import {
  TASKS_REPORT,
  MONTH_WORKLOAD_CHART,
  YEAR_WORKLOAD_CHART,
  YEAR_FINANCIAL_CHART,
} from '../../constants/translations/order-tasks-report';

class SideBar extends Component {
  constructor() {
    super();
    this.state = {
      selected: 0,
      perUser: false,
    };
  }

  componentDidMount = async () => {
    this.findLocationPath();
    if (this.props.login.user.privileges && this.props.login.user.privileges.includes(PER_USER)) {
      this.setState({ perUser: true });
    }
  };

  componentWillMount() {
    let pathname = window.location.pathname;
    this.props.setRouteLocation(pathname);
  }

  findLocationPath = () => {
    let location_path = window.location.pathname;
    location_path = decodeURIComponent(location_path);

    const dynamicFactoryName = this.props.login.user.factory_name;

    if (location_path.includes(`/${dynamicFactoryName}/bids`)) {
      this.setState({
        selected: 2,
      });
    } else if (location_path.includes(`/${dynamicFactoryName}/general-review`)) {
      this.setState({
        selected: 1,
      });
    } else if (location_path.includes(`/${dynamicFactoryName}/backlog`)) {
      this.setState({
        selected: 3,
      });
    } else if (location_path.includes(`/${dynamicFactoryName}/reports`)) {
      this.setState({
        selected: 4,
      });
    } else if (location_path.includes(`/${dynamicFactoryName}/tasks-report`)) {
      this.setState({
        selected: 5,
      });
    } else if (location_path.includes(`/${dynamicFactoryName}/month-workload-chart`)) {
      this.setState({
        selected: 6,
      });
    } else if (location_path.includes(`/${dynamicFactoryName}/year-workload-chart`)) {
      this.setState({
        selected: 7,
      });
    } else if (location_path.includes(`/${dynamicFactoryName}/year-financial-chart`)) {
      this.setState({
        selected: 8,
      });
    }
  };

  render() {
    const dynamicFactoryName = this.props.login.user.factory_name;
    const { selected, perUser } = this.state;
    return (
      <div className="side__bar__container">
        <ul>
          {!perUser && (
            <Link to={`/${dynamicFactoryName}/ongoing-orders`}>
              <li
                onClick={() => this.setState({ selected: 1 })}
                id={selected === 1 ? 'active__sidbar__tab' : null}
              >
                הזמנות פתוחות
              </li>
            </Link>
          )}

          {!perUser && (
            <Link to={`/${dynamicFactoryName}/bids`}>
              <li
                onClick={() => this.setState({ selected: 2 })}
                id={selected === 2 ? 'active__sidbar__tab' : null}
              >
                הצעות מחיר
              </li>
            </Link>
          )}

          <Link to={`/${dynamicFactoryName}/backlogs`}>
            <li
              onClick={() => this.setState({ selected: 3 })}
              id={selected === 3 ? 'active__sidbar__tab' : null}
            >
              דו"ח השלמות
            </li>
          </Link>

          {
            <Link to={`/${dynamicFactoryName}/tasks-report`}>
              <li
                onClick={() => this.setState({ selected: 5 })}
                id={selected === 5 ? 'active__sidbar__tab' : null}
              >
                {TASKS_REPORT}
              </li>
            </Link>
          }

          {
            <Link to={`/${dynamicFactoryName}/month-workload-chart`}>
              <li
                onClick={() => this.setState({ selected: 6 })}
                id={selected === 6 ? 'active__sidbar__tab' : null}
              >
                {MONTH_WORKLOAD_CHART}
              </li>
            </Link>
          }

          {
            <Link to={`/${dynamicFactoryName}/year-workload-chart`}>
              <li
                onClick={() => this.setState({ selected: 7 })}
                id={selected === 7 ? 'active__sidbar__tab' : null}
              >
                {YEAR_WORKLOAD_CHART}
              </li>
            </Link>
          }

          {this.props.login.user.privileges.length === 0 ? (
            <Link to={`/${dynamicFactoryName}/reports`}>
              <li
                onClick={() => this.setState({ selected: 4 })}
                id={selected === 4 ? 'active__sidbar__tab' : null}
              >
                דו"חות פיננסים
              </li>
            </Link>
          ) : null}

          {
            <Link to={`/${dynamicFactoryName}/year-financial-chart`}>
              <li
                onClick={() => this.setState({ selected: 8 })}
                id={selected === 8 ? 'active__sidbar__tab' : null}
              >
                {YEAR_FINANCIAL_CHART}
              </li>
            </Link>
          }
        </ul>
      </div>
    );
  }
}

function mapStateToProps({ router, route, orders, csv, mainPopup, login, process, alertPopup }) {
  return { router, route, orders, csv, mainPopup, login, process, alertPopup };
}
export default withRouter(connect(mapStateToProps, actions)(SideBar));
