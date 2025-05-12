import React, { Component } from 'react';
import '../../../../sass/GeneralReview/_general_review.scss';
import '../../../../sass/warningDashboard/warningDashboard.scss';
import InfiniteScroll from 'react-infinite-scroller';
import { getWarningsDashboard } from '../../../../functions/api/orders';
import moment from 'moment';
import arrowIcon from '../../../../images/general/blueArrow.svg';
import { withRouter } from 'react-router-dom';

import { Link } from 'react-router-dom';
//redux configs
import { connect } from 'react-redux';
import * as actions from '../../../../actions/actions';
import Loader from '../../../LoaderNew/Loader';
import uniqid from 'uniqid';

class WarningDashboard extends Component {
  constructor() {
    super();
    this.state = {
      loadMoreaWarnings: false,
      warning_page: 0,
      warning_data: [],
      loader_data: true,
      load_more_loader: false,
    };
  }

  async componentDidMount() {
    this.getWarningsData();
  }

  async componentWillReceiveProps(nextProps) {
    if (this.props.fetchNewData !== nextProps.fetchNewData) {
      this.setState(
        {
          warning_page: 0,
          warning_data: [],
          loadMoreaWarnings: false,
          loader_data: true,
        },
        () => {
          this.getWarningsData();
        },
      );
    }

    //     if(this.props.loadData !== nextProps.loadData){

    //   let loadData
    //   if(nextProps.loadData){
    //      loadData = true
    //   }else{
    //     loadData = false
    //   }

    //   this.setState({
    //     loader_data: loadData
    //   })
    // }
  }

  componentDidUpdate(prevProps, prevState) {
    //sort data by:
    //comment
    if (
      prevProps.location.search !== this.props.location.search ||
      JSON.stringify(prevProps.login.selectedDepartment) !==
        JSON.stringify(this.props.login.selectedDepartment) ||
      JSON.stringify(prevProps.login.selectedManager) !==
        JSON.stringify(this.props.login.selectedManager)
    ) {
      this.setState(
        {
          warning_page: 0,
          warning_data: [],
          loadMoreaWarnings: false,
          loader_data: true,
        },
        () => {
          this.getWarningsData();
        },
      );
    }
  }

  scrollMoreWarnings = () => {
    //prevent double scroll for the infinityScroll packege

    this.setState({
      loadMoreaWarnings: false,
      load_more_loader: true,
    });
    this.getWarningsData();
  };

  getWarningsData = async () => {
    const { warning_page, warning_data } = this.state;
    const limit = 12;

    let urlOrderNumber = window.location.search.replace('?order_number=', '');
    let selectedDepartment = this.props.login.selectedDepartment._id;
    let employee_id = this.props.login.selectedManager;

    let res = await getWarningsDashboard(
      warning_page,
      limit,
      urlOrderNumber,
      selectedDepartment,
      employee_id,
    );

    if (res.ok && res.result.length > 0) {
      let warning_data_copy = JSON.parse(JSON.stringify(warning_data));

      let new_warning_data = warning_data_copy.concat(res.result);

      this.setState({
        warning_page: warning_page + limit,
        warning_data: new_warning_data,
        loader_data: false,
        load_more_loader: false,
      });

      // if there is more warning to load -> true
      if (res.result.length < limit) {
        this.setState({
          loadMoreaWarnings: false,
        });
      } else {
        this.setState({
          loadMoreaWarnings: true,
        });
      }
    } else {
      this.setState({
        warning_data: [],
        loader_data: false,
      });
    }
  };

  dateFormat = (date) => {
    return moment(new Date(date)).format('l');
  };

  render() {
    const { loadMoreaWarnings, warning_data, loader_data, load_more_loader } = this.state;

    //dynamic url factory name
    const dynamicFactoryName = this.props.login.user.factory_name;

    return (
      <div className="warnings__container">
        <header>
          <h1>בעיות שמצריכות טיפול</h1>
          <button>הצג הכל</button>
        </header>

        {loader_data ? (
          <Loader
            style={{
              transform: 'scale(0.7)',
              position: 'relative',
              height: '240px',
              right: '22px',
            }}
          />
        ) : (
          <div className="warnings__dashboard__data">
            {warning_data.length <= 0 ? (
              <div className="empty__review__dashboard__message">אין בעיות שמצריכות טיפול</div>
            ) : (
              <InfiniteScroll
                pageStart={1}
                loadMore={this.scrollMoreWarnings}
                hasMore={loadMoreaWarnings}
                useWindow={false}
              >
                {warning_data.map((w, i) => (
                  <div className="warning__dashboard__line" key={uniqid()}>
                    {
                      w.type === 'TimeFrameOverLoad' ? (
                        <p>
                          בתאריך {this.dateFormat(w.order_process.process_date)} - הזמנה מס'{' '}
                          {w.order.order_number} - יש עומס בתהליך {w.process.name}
                        </p>
                      ) : (
                        <p></p>
                      )
                      // anoter types of warning
                    }
                    <Link to={`/${dynamicFactoryName}/yearly?order_number=${w.order.order_number}`}>
                      <img alt="arrow" src={arrowIcon} />
                    </Link>
                  </div>
                ))}
                {load_more_loader ? (
                  <Loader
                    style={{
                      transform: 'scale(0.7)',
                      position: 'relative',
                      height: '240px',
                      right: '22px',
                    }}
                  />
                ) : null}
              </InfiniteScroll>
            )}
          </div>
        )}
      </div>
    );
  }
}

function mapStateToProps({ login }) {
  return { login };
}
export default withRouter(connect(mapStateToProps, actions)(WarningDashboard));
