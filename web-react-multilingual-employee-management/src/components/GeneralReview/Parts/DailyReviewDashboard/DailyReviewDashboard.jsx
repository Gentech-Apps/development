import React, { Component } from 'react';
import '../../../../sass/GeneralReview/_general_review.scss';
import '../../../../sass/warningDashboard/warningDashboard.scss';
import { appGetOrders } from '../../../../functions/api/orders';
import moment from 'moment';
import arrowIcon from '../../../../images/general/blueArrow.svg';
import { withRouter } from 'react-router-dom';
//redux configs
import { connect } from 'react-redux';
import * as actions from '../../../../actions/actions';
import Loader from '../../../LoaderNew/Loader';
import uniqid from 'uniqid';

class DailyReviewDashboard extends Component {
  constructor() {
    super();
    this.state = {
      daily_data: [],
      loader_data: true,
    };
  }

  async componentDidMount() {
    this.getDailyData();
  }
  //
  async componentWillReceiveProps(nextProps) {
    if (this.props.fetchNewData !== nextProps.fetchNewData) {
      this.setState({
        loader_data: true,
      });
      this.getDailyData();
    }

    // if(this.props.loadData !== nextProps.loadData){

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
    if (
      prevProps.location.search !== this.props.location.search ||
      JSON.stringify(prevProps.login.selectedDepartment) !==
        JSON.stringify(this.props.login.selectedDepartment) ||
      JSON.stringify(prevProps.login.selectedManager) !==
        JSON.stringify(this.props.login.selectedManager)
    ) {
      this.setState({
        loader_data: true,
      });
      this.getDailyData();
    }
  }

  getDailyData = async () => {
    const { daily_data } = this.state;

    let from = moment();
    let to = moment().add('days', 1)._d;

    let urlOrderNumber = window.location.search.replace('?order_number=', '');
    let selectedDepartment = this.props.login.selectedDepartment._id;
    let employee_id = this.props.login.selectedManager;
    let started = '';

    let res = await appGetOrders(
      from,
      to,
      'L',
      urlOrderNumber,
      selectedDepartment,
      employee_id,
      started,
    );

    if (res === undefined || res.length <= 0) {
      this.setState({
        daily_data: [],
        loader_data: false,
      });
    } else {
      for (let i = 0; i < res.length; i++) {
        for (let p of res[i].processes) {
          p.client_name = res[i].client_name;
          p.order_number = res[i].order_number;
        }
      }

      let new_arr = res.map((p) => p.processes);
      let mergeArrays = [].concat.apply([], new_arr);
      let arrWitoutBacklogs = mergeArrays.filter((p) => !p.backlog);
      this.setState({
        daily_data: arrWitoutBacklogs,
        loader_data: false,
      });
    }
  };

  render() {
    const { daily_data, loader_data } = this.state;

    const { openUpdateMenu } = this.props;
    return (
      <div className="warnings__container">
        <header>
          <h1>תוכנית ייצור יומית</h1>
          {/* <button>הצג הכל</button> */}
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
            {daily_data.length <= 0 ? (
              <div className="empty__review__dashboard__message"> אין תוכנית ליום זה</div>
            ) : (
              daily_data.map((p, i) => {
                return (
                  <div
                    key={uniqid()}
                    onClick={() => openUpdateMenu(p)}
                    className="warning__dashboard__line"
                  >
                    <p>
                      {p.client_name} - {p.order_number}
                    </p>
                    <div>{p.process_name} </div>
                  </div>
                );
              })
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
export default withRouter(connect(mapStateToProps, actions)(DailyReviewDashboard));
