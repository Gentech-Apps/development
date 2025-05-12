import React, { Component } from 'react';
import Login from './components/Login/Login.js';
import { BrowserRouter as Router, Route, Link, Switch } from 'react-router-dom';
import { withRouter } from 'react-router-dom';
import { getCookie, removeCookie } from './tools/cookies/cookie.js';
import { connect } from 'react-redux';
import * as actions from './actions/actions.js';

import { getUserByToken } from './functions/api/login.js';
import Dashboard from './components/Dashboard/Dashboard.jsx';
import HomePage from './components/HomePage/HomePage.jsx';
import YearlyDashboard from './components/Dashboard/YearlyDashboard/YearlyDashboard.jsx';
import MonthlyDashboard from './components/Dashboard/MonthlyDashboard/MonthView.jsx';
import WeeklyDashboard from './components/Dashboard/WeeklyDashboard/WeeklyDashboard.jsx';
import DailyDashboard from './components/Dashboard/DailyDashboard/DailyDashboard.jsx';
import GeneralReview from './components/GeneralReview/GeneralReview.jsx';
import Reports from './components/Reports/Reports.jsx';
import BidsPage from './components/BidsPage/BidsPage.jsx';
import BacklogsReport from './components/AppReports/BacklogsReport/BacklogsReport.jsx';
import AdminPanel from './components/AdminPanel/AdminPanel.js';

import { polyfill } from 'es6-promise';
import { FactoriesList } from './components/AdminPanel/factoryies/FactoriesList.js';
import { DepartmentList } from './components/AdminPanel/department/DepartmentList.js';
import { SubDepartmentList } from './components/AdminPanel/subDepartment/SubDepartmentList.js';
import Layout from './components/generals/Layout.jsx';
import { RecipientList } from './components/AdminPanel/recipient/RecipientList.js';
import { OrderTypeList } from './components/AdminPanel/orderType/OrderTypeList.js';
import { ResourceList } from './components/AdminPanel/resource/ResourceList.js';
import { GanttTemplateList } from './components/AdminPanel/ganttTemplate/GanttTemplateList.js';
import { OrderList } from './components/AdminPanel/order/OrderList.js';
import { ActualGanttList } from './components/AdminPanel/actualGantt/ActualGanttList.js';
import { CategoryList } from './components/AdminPanel/categories/CategoryList.js';
import { UserList } from './components/AdminPanel/users/UserList.js';
import { OrderCollectionStagesList } from './components/AdminPanel/orderCollectionStages/OrderCollectionStagesList.js';
import { OngoingOrdersReport } from './components/OngoingOrdersReport/OngoingOrdersReport.jsx';
import CustomersTable from './components/CustomersPage/CustomersTable/CustomersTable.jsx';
import CustomersPage from './components/CustomersPage/CustomersPage.jsx';
import { PER_USER } from './tools/keys/variables.js';
import TasksReport from './components/AppReports/TasksReport/TasksReport.jsx';
import CreateQuote from './components/CustomersPage/Quote/CreateQuote.jsx';
import CreateProductForm from './components/CustomersPage/Product/CreateProductForm.jsx';
import ReportPage from './components/ReportsPage/ReportsPage.jsx';
import DailyView from './components/DailyView/DailyView.jsx';
import DailyNewView from './components/DailyNewView/DailyNewView.jsx';
import Info from './components/Info/Info.js';
import DailyCalendar from './components/DailyCalendar/DailyCalendar.jsx';
import WorkloadChart from './components/AppReports/WorkloadChart/WorkloadChart.jsx';
import FinancialChart from './components/AppReports/FinancialChart/FiancialChart.jsx';
import MonthlyResourcesCalendar from './components/MonthlyResourceCalendar/MonthlyResourceView.jsx';
import { RouterOutlined } from '@material-ui/icons';
import { captureTimeStamp } from './hooks/helper.js';

polyfill();

class App extends Component {
  constructor(props) {
    super(props);
    this.state = {
      loaded: false,
    };
    window.addEventListener('mousemove', captureTimeStamp);
  }

  async componentWillMount() {
    let cookie = await getCookie('login_cookie');
    if (cookie && cookie != null && cookie.toString() !== 'undefined') {
      const body = { email: '', password: '' };
      let access = await getUserByToken(body, cookie);
      this.props.setUserData(access.result);

      if (access.ok) {
        this.props.updateLogin(true);
        this.props.setUserToken(cookie);
      } else {
        console.log('Need to login');
      }
    } else if (cookie == null) {
      removeCookie(cookie);
    }

    this.setState({
      loaded: true,
    });
  }

  handleResize = () => {
    const windowSize = {
      height: window.screen.height,
      width: window.screen.width,
    };
    this.props.setWindowSize(windowSize);
  };

  componentDidMount() {
    this.handleResize();
    window.addEventListener('resize', this.handleResize);
  }

  componentWillUnmount() {
    window.removeEventListener('resize', this.handleResize);
  }

  render() {
    const { loaded } = this.state;
    const { isLogin } = this.props.login;
    const privileges = this.props.login?.user?.privileges;
    const dynamicFactoryName = this.props.login?.user?.factory_name;
    const isAdmin = !!(privileges && privileges.length && privileges[0] == 'admin');
    const perUser = privileges && privileges.includes(PER_USER);

    return (
      loaded && (
        <div>
          {isLogin ? (
            <div>
              <Router>
                {!isAdmin && <Route path="/" exact render={() => <HomePage />} />}
                {/* <Route path="/" exact render={() => <HomePage />} /> */}
                <Route
                  path="/"
                  render={(p) => (
                    <Layout isAdmin={isAdmin} {...p}>
                      <Switch>
                        <Route
                          path={'/' + dynamicFactoryName}
                          exact
                          render={(props) => <Dashboard {...props} />}
                        />
                        {!perUser && (
                          <Route
                            exact
                            path={'/' + dynamicFactoryName + '/yearly'}
                            component={YearlyDashboard}
                          />
                        )}
                        <Route
                          exact
                          path={'/' + dynamicFactoryName + '/monthly'}
                          component={MonthlyDashboard}
                        />
                        <Route
                          path={'/' + dynamicFactoryName + '/monthly/:date'}
                          component={MonthlyDashboard}
                        />
                        <Route
                          exact
                          path={'/' + dynamicFactoryName + '/weekly'}
                          component={WeeklyDashboard}
                        />
                        <Route
                          path={'/' + dynamicFactoryName + '/weekly/:date'}
                          component={WeeklyDashboard}
                        />
                        <Route
                          path={'/' + dynamicFactoryName + '/daily/:date'}
                          component={DailyDashboard}
                        />
                        <Route
                          path={'/' + dynamicFactoryName + '/daily'}
                          component={DailyDashboard}
                        />
                        <Route
                          exact
                          path={'/' + dynamicFactoryName + '/ongoing-orders'}
                          component={OngoingOrdersReport}
                        />
                        <Route
                          exact
                          path={'/' + dynamicFactoryName + '/bids'}
                          component={BidsPage}
                        />
                        <Route
                          exact
                          path={'/' + dynamicFactoryName + '/general-review'}
                          component={GeneralReview}
                        />
                        <Route
                          exact
                          path={`/${dynamicFactoryName}/customers-table`}
                          component={CustomersTable}
                        />
                        <Route
                          exact
                          path={`/${dynamicFactoryName}/customers-page/create-quote/:customerId/:quoteId`}
                          component={CreateQuote}
                        />
                        <Route
                          exact
                          path={`/${dynamicFactoryName}/customers-page/create-product/:customerId/:quoteId/:location`}
                          component={CreateProductForm}
                        />
                        <Route
                          exact
                          path={`/${dynamicFactoryName}/customers-page/edit-product/:customerId/:quoteId/:location/:productId/:status`}
                          component={CreateProductForm}
                        />
                        <Route
                          exact
                          path={`/${dynamicFactoryName}/customers-page/:customerIdentifier`}
                          component={CustomersPage}
                        />
                        <Route
                          exact
                          path={'/' + dynamicFactoryName + '/backlogs'}
                          component={BacklogsReport}
                        />
                        {this.props.login.user.privileges.length === 0 ? (
                          <Route
                            exact
                            path={'/' + dynamicFactoryName + '/reports'}
                            component={Reports}
                          />
                        ) : null}
                        {
                          <Route
                            exact
                            path={'/' + dynamicFactoryName + '/tasks-report'}
                            component={TasksReport}
                          />
                        }
                        <Route
                          exact
                          path={'/' + dynamicFactoryName + '/month-workload-chart'}
                          component={WorkloadChart}
                        />
                        <Route
                          exact
                          path={'/' + dynamicFactoryName + '/year-workload-chart'}
                          component={WorkloadChart}
                        />
                        <Route
                          exact
                          path={'/' + dynamicFactoryName + '/year-financial-chart'}
                          component={FinancialChart}
                        />
                        <Route
                          exact
                          path={'/' + dynamicFactoryName + '/new-daily-view'}
                          component={DailyView}
                        />
                        <Route
                          exact
                          path={'/' + dynamicFactoryName + '/daily-view'}
                          component={DailyNewView}
                        />
                        <Route exact path={'/' + dynamicFactoryName + '/Info'} component={Info} />{' '}
                        <Route
                          exact
                          path={'/' + dynamicFactoryName + '/report-page/:orderId'}
                          component={ReportPage}
                        />
                        <Route
                          exact
                          path={'/' + dynamicFactoryName + '/daily-vertical-processes'}
                          component={DailyCalendar}
                        />
                        <Route
                          exact
                          path={'/' + dynamicFactoryName + '/monthly-resources'}
                          component={MonthlyResourcesCalendar}
                        />
                        <Route
                          path={'/' + dynamicFactoryName + '/monthly-resources/:date'}
                          component={MonthlyResourcesCalendar}
                        />
                        {isAdmin && (
                          <AdminPanel {...p}>
                            <Route exact path={'/admin'} component={AdminPanel} />
                            <Route exact path={'/admin/factories'} component={FactoriesList} />
                            <Route exact path={'/admin/users'} component={UserList} />
                            <Route exact path={'/admin/department'} component={DepartmentList} />
                            <Route
                              exact
                              path={'/admin/sub_department'}
                              component={SubDepartmentList}
                            />
                            {/* <Route
                              exact
                              path={"/admin/resourses"}
                              component={ResourceList}
                            /> */}
                            <Route exact path={'/admin/recipients'} component={RecipientList} />
                            <Route exact path={'/admin/order_types'} component={OrderTypeList} />
                            <Route
                              exact
                              path={'/admin/gantt_template'}
                              component={GanttTemplateList}
                            />
                            <Route exact path={'/admin/gantt_actual'} component={ActualGanttList} />
                            <Route
                              exact
                              path={'/admin/order_categories'}
                              component={CategoryList}
                            />
                            <Route
                              exact
                              path={'/admin/order_collection_stages'}
                              component={OrderCollectionStagesList}
                            />
                          </AdminPanel>
                        )}
                        )
                      </Switch>
                    </Layout>
                  )}
                />
              </Router>
            </div>
          ) : (
            <div>
              <Login />
            </div>
          )}
        </div>
      )
    );
  }
}

function mapStateToProps({ router, login, user }) {
  return { router, login, user };
}
export default withRouter(connect(mapStateToProps, actions)(App));
