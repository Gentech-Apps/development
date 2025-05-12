import React, { Component } from 'react';
import '../../sass/GeneralReview/_general_review.scss';
import InfiniteScroll from 'react-infinite-scroller';
import {
  getWarningsDashboard,
  setEndDateForProcess,
  getWarnings,
  montlyUpdateOrdersForConst,
  updateProcess,
  montlyUpdateOrders,
} from '../../functions/api/orders';
import WarningDashboard from './Parts/WarningDashboard/WarningDashboard';
import ReasonPopup from '../updatePopups/ReasonPopup';
import SpreadingPopup from '../updatePopups/SpreadingPopup';
import UpdateProccessPopup from '../updatePopups/UpdateProccessPopup';
import LoaderNew from '../LoaderNew/Loader';
import OnDragPopup from '../updatePopups/OnDragPopup';
//redux configs
import { connect } from 'react-redux';
import * as actions from '../../actions/actions';
import moment from 'moment';
import { withRouter } from 'react-router-dom';
import ErrorPopup from '../NavBar/ErrorPopup/ErrorPopup';
import SideBar from '../SideBar/SideBar';
import DailyReviewDashboard from './Parts/DailyReviewDashboard/DailyReviewDashboard';

class GeneralReview extends Component {
  constructor() {
    super();
    this.state = {
      updateProcessPopup: false,
      selectedProcess: {},
      loader: false,
      spreadingPopup: false,
      reasonPopup: false,
      prevState: [],
      popup: false,
      warnings: [],
    };
  }

  closeUpdateMenu = () => {
    this.setState({
      updateProcessPopup: false,
      selectedProcess: {},
    });
  };

  openUpdateMenu = (selectedProcess) => {
    let formatObjProcess = { proccess: selectedProcess };
    this.setState({
      updateProcessPopup: true,
      selectedProcess: formatObjProcess,
    });
  };

  fetchNewData = () => {
    const { fetchNewData } = this.state;
    this.setState({
      fetchNewData: !fetchNewData,
      loader: false,
    });
  };

  componentDidMount() {
    let pathname = window.location.pathname;
    this.props.setRouteLocation(pathname); // to update the location path in the header tabs
  }

  componentDidUpdate(prevProps, prevState) {
    //sort data by:
    if (JSON.stringify(prevProps.process._id) !== JSON.stringify(this.props.process._id)) {
      this.fetchNewData();

      setTimeout(() => {
        this.props.update_process_obj({
          _id: 'sssssssssssss',
          finished: '',
          is_detached: '',
        });
      }, 1000);
    }
  }

  submitUpdatesFromPopup = async (body, constant) => {
    let newBody = {
      _id: body._id,
      date: body.endDate,
      view: body.view,
      from: body.from,
      to: body.to,
      order_employee_id: null,
      department_id: this.props.login.selectedDepartment._id,
    };

    this.setState({
      updateProcessPopup: false,
    });

    //if date didnt change dont reposition

    if (moment(body.date).isSame(moment(body.process.process_date))) {
      if (newBody.date) {
        let res2 = await setEndDateForProcess(newBody);
        if (res2.ok) {
          this.fetchNewData();
        } else {
          //handle error ***
          this.setState({ errPopupState: res2.result, popup: true });
        }
      }

      this.setState({ loader: false });
      return;
    }

    let res;
    if (constant) {
      //constant handler
      let warningRes = await getWarnings(body);
      if (warningRes.ok) {
        if (warningRes.result.length > 0) {
          //handle error
          this.setState({
            popup: true,
            updateApiBody: body,
            updateProcessPopup: false,
            warnings: warningRes.result,
          });
        } else {
          res = await montlyUpdateOrdersForConst(body, this.props.login.selectedDepartment._id);
        }
      } else {
        let processesArrayCopy = JSON.parse(JSON.stringify(this.state.processesArray));
        this.setState({
          errPopupState: res.result,
          popup: true,
          updateApiBody: body,
          prevState: processesArrayCopy,
          updateProcessPopup: false,
        });
      }
    } else {
      //not constant handler
      this.setState({
        spreadingPopup: true,
        spreadingBodyData: body,
        updateApiBody: body,
        updateProcessPopup: false,
      });
      return;
    }

    // general res handler - from const/not/is detached
    if (res.ok) {
      this.setState({ updateProcessPopup: false }, async () => {
        //building dates data array to show on interface
        this.setState({ loader: false });

        if (newBody.date) {
          let res2 = await setEndDateForProcess(newBody);
          if (res2.ok) {
            this.fetchNewData();
          } else {
            this.setState({ errPopupState: res2.result, popup: true });
            this.fetchNewData();
          }
        }
      });
    } else {
      // let stateHolder = this.state.processesArray.map(item=>item)
      this.setState({
        errPopupState: res.result,
        loader: false,
        updateProcessPopup: false,
        popup: true,
        updateApiBody: body,
      });
    }
  };

  ///----------------------

  spreadingFalse = async () => {
    this.setState({ loader: true, spreadingPopup: false });
    let body = { ...this.state.spreadingBodyData };
    let warningsApi = await getWarnings(body);
    console.log(this.state.loader);

    if (warningsApi.ok) {
      //check for warnings
      let warningsApi = await getWarnings(body);
      if (warningsApi.ok) {
        if (warningsApi.result.length > 0) {
          this.setState({
            popup: true,
            loader: false,
            warnings: warningsApi.result,
            spreadingPopup: false,
          });
        } else {
          if (body.process.constant) {
            this.setState({
              popup: true,
              loader: false,
              warningApiPayload: body,
            });
          } else {
            this.handlePopupChoice('yes');
          }
        }
      } else {
        this.setState({
          popup: true,
          loader: false,
          errPopupState: warningsApi.result,
          spreadingPopup: false,
        });
      }
    } else {
      this.setState({
        popup: true,
        loader: false,
        errPopupState: warningsApi.result,
        spreadingPopup: false,
      });
    }
  };

  spreadingTrue = async () => {
    const { spreadingBodyData } = this.state;

    if (
      moment(spreadingBodyData.date).isSameOrBefore(moment(spreadingBodyData.process.process_date))
    ) {
      this.setState({ loader: true, spreadingPopup: false });
      //check for warnings
      let warningsApi = await getWarnings(spreadingBodyData, true);
      if (warningsApi.ok) {
        if (warningsApi && warningsApi.result && warningsApi.result.length > 0) {
          this.setState({
            popup: true,
            loader: false,
            warnings: warningsApi.result,
          });
        } else {
          if (spreadingBodyData.process.constant) {
            this.setState({ popup: true, loader: false });
          } else {
            this.handlePopupChoice('yes', false, true);
          }
        }
      } else {
        this.setState({
          popup: true,
          loader: false,
          errPopupState: warningsApi.result,
        });
      }
    } else {
      this.setState({ reasonPopup: true, spreadingPopup: false });
    }
  };

  handleSpreadWithReason = async (data) => {
    let body = { ...this.state.spreadingBodyData };
    body.reason = data.reason.value;
    body.approved_by = data.approveName.value;
    //check for warnings

    let warningsApi = await getWarnings(body, true);
    if (warningsApi.ok) {
      if (warningsApi && warningsApi.result && warningsApi.result.length > 0) {
        this.setState({
          popup: true,
          loader: false,
          warnings: warningsApi.result,
          reasonPopup: false,
        });
      } else {
        if (body.process.constant) {
          this.setState({ popup: true, loader: false });
        } else {
          this.setState({ updateApiBody: body }, () => {
            this.handlePopupChoice('yes', false, true);
          });
        }
      }
    } else {
      this.setState({
        popup: true,
        loader: false,
        errPopupState: warningsApi.result,
      });
    }
  };

  handlePopupChoice = async (param, constantData = false, spreading = false) => {
    this.setState({ popup: false, loader: true });

    //init body for endDate call
    let newBody;
    if (param === 'yes')
      newBody = {
        _id: this.state.updateApiBody._id,
        date: this.state.updateApiBody.endDate,
        view: this.state.updateApiBody.view,
        from: this.state.updateApiBody.from,
        to: this.state.updateApiBody.to,
        order_employee_id: null,
        department_id: this.props.login.selectedDepartment._id,
      };
    //
    if (param === 'yes') {
      this.setState({ spreadingPopup: false, reasonPopup: false, loader: true });

      if (this.state.updateApiBody.toBacklog) {
        let res = await updateProcess(this.state.updateApiBody.process);
        if (res.ok) this.setState({ popup: false, loader: false });
        return;
      }

      let res;

      if (this.state.updateApiBody.process.constant) {
        let body = { ...this.state.updateApiBody };
        if (constantData) {
          body.reason = constantData.reason.value;
          body.approved_by = constantData.approveName.value;
        }

        res = await montlyUpdateOrdersForConst(body, this.props.login.selectedDepartment._id);
        if (newBody.date) {
          let res2 = await setEndDateForProcess(newBody);
          if (res2.ok) {
            this.fetchNewData();
          } else {
            this.setState({ errPopupState: res2.result, popup: true });
          }
        }
      } else {
        res = await montlyUpdateOrders(
          this.state.updateApiBody,
          spreading,
          this.props.login.selectedDepartment._id,
        );
        if (newBody.date) {
          let res2 = await setEndDateForProcess(newBody);
          if (res2.ok) {
            this.fetchNewData();
          } else {
            this.setState({ errPopupState: res2.result, popup: true });
          }
        }
      }

      if (res.ok) {
        this.fetchNewData();
      } else {
        this.setState({ errPopupState: res.result, loader: false, popup: true });
      }
    } else {
      this.setState({
        popup: false,
        errPopupState: null,
        loader: false,
      });
    }
  };

  cancelReasonPopup = () => {
    let processesArrayCopy = JSON.parse(JSON.stringify(this.state.prevState));
    this.setState({ reasonPopup: false, processesArray: processesArrayCopy });
  };

  saveNewSelectedProcess = (process) => {
    let selectedProcess = { ...this.state.selectedProcess };
    selectedProcess.proccess = { ...process };
    this.setState({
      selectedProcess,
    });
  };

  cancleSpreading = () => {
    this.setState({ spreadingPopup: false });
  };

  render() {
    const {
      currentDate,
      processesArray,
      updateProcessPopup,
      selectedProcess,
      loader,
      spreadingPopup,
      reasonPopup,
      fetchNewData,
      popup,
      errPopupState,
      warnings,
    } = this.state;
    const { off_days, holidays } = this.props.login.user;
    return (
      <div className="general__review__container">
        <SideBar />
        <div className="general-review">
          <div class="general__reports__container">
            <section class="section">
              <WarningDashboard fetchNewData={fetchNewData} />
            </section>

            <section class="section">
              <DailyReviewDashboard
                openUpdateMenu={this.openUpdateMenu}
                fetchNewData={fetchNewData}
              />
            </section>
          </div>

          {reasonPopup ? (
            <ReasonPopup
              handleSpreadWithReason={this.handleSpreadWithReason}
              cancelPopup={this.cancelReasonPopup}
            />
          ) : null}

          {spreadingPopup ? (
            <SpreadingPopup
              spreadingFalse={this.spreadingFalse}
              spreadingTrue={this.spreadingTrue}
              cancleSpreading={this.cancleSpreading}
            />
          ) : null}

          {updateProcessPopup ? (
            <UpdateProccessPopup
              selectedProcess={selectedProcess}
              view={'L'}
              closeUpdateMenu={this.closeUpdateMenu}
              submitUpdatesFromPopup={this.submitUpdatesFromPopup}
              offDays={off_days}
              holidays={holidays}
              saveNewSelectedProcess={this.saveNewSelectedProcess}
            />
          ) : null}

          {popup ? (
            <OnDragPopup
              afterConfirmationError={errPopupState}
              popupActionHandler={this.handlePopupChoice}
              warningApiPayload={this.state.updateApiBody}
              warnings={warnings}
            />
          ) : null}

          {loader ? <LoaderNew /> : null}
        </div>
      </div>
    );
  }
}

function mapStateToProps({ login, process }) {
  return { login, process };
}
export default withRouter(connect(mapStateToProps, actions)(GeneralReview));
