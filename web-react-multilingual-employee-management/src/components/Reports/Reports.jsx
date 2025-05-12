import React, { Component } from 'react';
import moment from 'moment';
//components
import ReportsPage from './Parts/ReportsPage';
import ReportsSideNav from './Parts/ReportsSideNav';
import Loader from '../LoaderNew/Loader';
//funcs
import { getReport, generateReport, isExistReport } from '../../functions/api/orders';
import SideBar from '../SideBar/SideBar';

class Reports extends Component {
  constructor() {
    super();
    this.state = {
      startingDate: moment().startOf('month'),
      endingDate: moment().endOf('month'),
      timestamp: {
        from: moment().startOf('month'),
        to: moment().endOf('month'),
      },
      // planned: 0,
      // forecast: 0,
      // exitedCounter: 0,
      // prevCounter: 0,
      // delayedCounter: 0,
      // total: 0,
      dataArray: [],
      loader: false,
      isGenerated: false,
      csvData: [],
      changeToNewDates: true,
    };
  }

  async componentDidMount() {
    this.generateReport();
  }

  generateReport = async () => {
    let startingDate = moment(this.state.timestamp.from);
    let endingDate = moment(this.state.timestamp.to);
    this.setState({ isGenerated: false });
    let res = await generateReport(startingDate._d.toISOString(), endingDate._d.toISOString());
    if (res.ok) {
      this.setState({
        startingDate,
        endingDate,
        changeToNewDates: true,
        isGenerated: true,
      });
      this.createDataForPage(res);
    }
  };

  createDataForPage = (data) => {
    if (data.result && data.result.length) {
      const dataForReportPage = data.result[0];
      this.setState(
        {
          isGenerated: true,
          total_actual: dataForReportPage.total_actual,
          total_planned: dataForReportPage.total_planned,
          // report:[...dataForReportPage.report],
          loader: false,
          dataArray: [...dataForReportPage.report],
        },
        () => {
          this.initializedCsvData();
        },
      );
    }
  };

  displayNewData = async () => {
    let startingDate = moment(this.state.timestamp.from);
    let endingDate = moment(this.state.timestamp.to);
    this.setState(
      {
        startingDate,
        endingDate,
      },
      async () => {
        this.setState({ loader: true });
        let res = await generateReport(startingDate._d.toISOString(), endingDate._d.toISOString());
        if (res.ok && res.result.is_done) {
          this.createDataForPage(res.result.report);
        } else {
          this.setState({ loader: false });
        }
      },
    );
    this.setState({
      changeToNewDates: true,
    });
  };

  checkExist = async () => {
    let res = await isExistReport();
    return res;
  };

  resetChangeToNewDates = () => {
    this.setState({
      changeToNewDates: false,
    });
  };

  setStartDate = (date) => {
    let startingDate = moment(date);
    this.setState({ startingDate });
  };

  setEndDate = (date) => {
    let endingDate = moment(date);
    this.setState({ endingDate });
  };

  setRange = (timestamp) => {
    this.setState({ timestamp });
  };

  updateDataArray = (new_data_array) => {
    this.setState(
      {
        dataArray: new_data_array,
      },
      () => {
        this.initializedCsvData();
      },
    );
  };

  updateTotalActualValue = (value) => {
    this.setState({ total_actual: value }, () => this.initializedCsvData());
  };

  initializedCsvData = () => {
    let data = JSON.parse(JSON.stringify(this.state));
    let csvData = [
      [
        'דו”ח פיננסי לחודש',
        // " ",
        `${moment(data.startingDate).format('DD/MM/YYYY')} - ${moment(data.endingDate).format(
          'DD/MM/YYYY',
        )}`,
      ],
      [],
      [
        'סה”כ מתוכנן:',
        // " ",
        `${data.total_planned ? data.total_planned : 0}`,
      ],
      [
        'יצא:',
        // " ",
        `${data.total_actual ? data.total_actual : 0}`,
      ],
      [],
      ['שם לקוח', 'שלב', 'מתוכנן', 'לחיוב', 'חשבונית', 'קבלה', 'יצא'],
    ];

    data.dataArray.map((item) => {
      csvData.push([
        item.customer_name ? item.customer_name : '-',
        item.process ? item.process : '-',
        item.planned ? item.planned : 0,
        item.billable ? '    v' : '',
        item.invoice_issued ? '    v' : '',
        item.payment_received ? '    v' : '',
        item.actual ? item.actual : 0,
      ]);
    });

    this.setState({ csvData });
  };

  render() {
    const {
      startingDate,
      endingDate,
      loader,
      csvData,
      changeToNewDates,
      timestamp,
      isGenerated,
    } = this.state;
    let reportsPageData = JSON.parse(JSON.stringify(this.state));

    return (
      <div className="reports__container">
        <SideBar />

        <div className="reports-page">
          {loader ? <Loader /> : null}
          <ReportsSideNav
            setStartDate={this.setStartDate}
            setEndDate={this.setEndDate}
            setRange={this.setRange}
            generateReport={this.generateReport}
            csvData={csvData}
            timestamp={timestamp}
            isGenerated={isGenerated}
          />
          {/* {this.props.reportsPageData && this.props.reportsPageData.report &&  */}
          <ReportsPage
            resetChangeToNewDates={this.resetChangeToNewDates}
            changeToNewDates={changeToNewDates}
            updateDataArray={this.updateDataArray}
            startingDate={startingDate}
            endingDate={endingDate}
            reportsPageData={reportsPageData}
            updateTotalActualValue={this.updateTotalActualValue}
            isGenerated={isGenerated}
          />
          {/* } */}
        </div>
      </div>
    );
  }
}

export default Reports;

// import React, { Component } from "react";
// import moment from "moment";
// //components
// import ReportsPage from "./Parts/ReportsPage";
// import ReportsSideNav from "./Parts/ReportsSideNav";
// import Loader from "../LoaderNew/Loader";
// //funcs
// import {
//   getReport,
//   generateReport,
//   isExistReport,
// } from "../../functions/api/orders";
// import SideBar from "../SideBar/SideBar";

// class Reports extends Component {
//   constructor() {
//     super();
//     this.state = {
//       startingDate: moment().startOf("month"),
//       endingDate: moment().endOf("month"),
//       timestamp: {
//         from: moment().startOf("month"),
//         to: moment().endOf("month"),
//       },
//       planned: 0,
//       forecast: 0,
//       exitedCounter: 0,
//       prevCounter: 0,
//       delayedCounter: 0,
//       total: 0,
//       dataArray: [],
//       loader: false,
//       isGenerated: false,
//       csvData: [],
//       changeToNewDates: true,
//     };
//   }

//   interval = null;

//   componentWillUnmount() {
//     clearInterval(this.interval);
//   }

//   async componentDidMount() {
//     let resExist = await this.checkExist();
//     if (resExist.ok && resExist.result.isExist) {
//       let resDone = await getReport();
//       if (resDone.ok) {
//         let timestamp = {
//           from: moment(resDone.result.from),
//           to: moment(resDone.result.to),
//         };
//         this.setState({ timestamp,
//             startingDate:resDone.result.from,
//             endingDate:resDone.result.to });

//         if (resDone.result.is_done) {
//           this.setState({isGenerated: false });
//           clearInterval(this.interval);
//           this.displayNewData();
//         } else {
//           this.interval = setInterval(this.generateСontinue, 60000);
//           this.setState({ isGenerated: true });
//         }
//       }
//     } else {
//       this.generateReport();
//     }
//   }

//   generateСontinue = async () => {
//     let resDone = await getReport();
//     if (resDone.ok && resDone.result.is_done) {
//       this.setState({
//         isGenerated: false,
//       });
//       clearInterval(this.interval);
//       this.displayNewData();
//     }
//   };

//   generateReport = async () => {
//     let startingDate = moment(this.state.timestamp.from);
//     let endingDate = moment(this.state.timestamp.to);
//     let res = await generateReport(
//       startingDate._d.toISOString(),
//       endingDate._d.toISOString()
//     );
//     if (res.ok) {
//       this.interval = setInterval(this.generateСontinue, 60000);
//       this.setState({
//         startingDate,
//         endingDate,
//         changeToNewDates: true,
//         isGenerated: true,
//       });
//       this.createDataForPage(res.result.report);
//     }
//     console.log(res);
//   };

//   createDataForPage = (data) => {
//     console.log(data);
//     //insert types to arrays
//     let newTempArr = JSON.parse(JSON.stringify(data));
//     let idsArrayForCouldHaveBeenProfits = newTempArr.could_have_been_profits.map(
//       (item) => item.order_process_id
//     );
//     let idsArrayForProfits = newTempArr.profits.map(
//       (item) => item.order_process_id
//     );
//     let idsArrayForPlannedProfits = newTempArr.planned_profits.map(
//       (item) => item.order_process_id
//     );

//     newTempArr.new_profits = newTempArr.new_profits.map((item) => {
//       return { ...item, typeOfArray: "new_profits" };
//     });

//     newTempArr.profits = newTempArr.profits.map((item) => {
//       return {
//         ...item,
//         typeOfArray: "profits",
//         showOrNot: idsArrayForPlannedProfits.includes(item.order_process_id)
//           ? false
//           : true,
//       };
//     });

//     newTempArr.planned_profits = newTempArr.planned_profits.map((item) => {
//       return {
//         ...item,
//         typeOfArray: "planned_profits",
//         isDelayed: idsArrayForCouldHaveBeenProfits.includes(
//           item.order_process_id
//         )
//           ? true
//           : false,
//         isExited: idsArrayForProfits.includes(item.order_process_id)
//           ? true
//           : false,
//       };
//     });

//     let newDataArray = Object.keys(newTempArr).map(function (key) {
//       if (key !== "planned" && key !== "could_have_been_profits")
//         return newTempArr[key];
//     });

//     let exitedCounter = 0;
//     let prevCounter = 0;
//     let delayedCounter = 0;
//     let forecastCounter = 0;

//     data.new_profits.map((item) => {
//       if (item.done) prevCounter = prevCounter + item.value;
//     });

//     data.could_have_been_profits.map((item) => {
//       if (idsArrayForPlannedProfits.includes(item.order_process_id))
//         delayedCounter = delayedCounter + item.value;
//     });

//     data.profits.map((item) => {
//       if (item.done) {
//         exitedCounter = exitedCounter + item.value;
//       } else {
//         forecastCounter = forecastCounter + item.value;
//       }
//     });

//     prevCounter = Math.floor(prevCounter);
//     delayedCounter = Math.floor(delayedCounter);
//     exitedCounter = Math.floor(exitedCounter);
//     forecastCounter = Math.floor(forecastCounter);

//     newDataArray = newDataArray.filter((item) => item);

//     // merge all arrays
//     Array.prototype.push.apply(newDataArray[0], newDataArray[1]);
//     Array.prototype.push.apply(newDataArray[0], newDataArray[2]);
//     let merged = [].concat.apply([], newDataArray[0]);
//     // sort by date
//     merged = merged.sort(function (a, b) {
//       return (
//         new Date(a.process_date).getTime() - new Date(b.process_date).getTime()
//       );
//     });
//     merged = merged.filter((item) => {
//       if (!item.showOrNot && item.typeOfArray === "profits") {
//         return false;
//       } else {
//         return true;
//       }
//     });

//     this.setState(
//       {
//         planned: Math.floor(data.planned),
//         exitedCounter,
//         prevCounter,
//         delayedCounter,
//         forecast: forecastCounter,
//         total: prevCounter + exitedCounter,
//         dataArray: merged,
//         loader: false,
//       },
//       () => {
//         this.initializedCsvData();
//       }
//     );
//   };

//   displayNewData = async () => {
//     let startingDate = moment(this.state.timestamp.from);
//     let endingDate = moment(this.state.timestamp.to);
//     this.setState(
//       {
//         startingDate,
//         endingDate,
//       },
//       async () => {
//         this.setState({ loader: true });
//         let res = await getReport();
//         if (res.ok && res.result.is_done) {
//           this.createDataForPage(res.result.report);
//         } else {
//           console.log("error handle here");
//           this.setState({ loader: false });
//         }
//       }
//     );
//     this.setState({
//       changeToNewDates: true,
//     });
//   };

//   checkExist = async () => {
//     let res = await isExistReport();
//     return res;
//   };

//   resetChangeToNewDates = () => {
//     this.setState({
//       changeToNewDates: false,
//     });
//   };

//   setStartDate = (date) => {
//     let startingDate = moment(date);
//     this.setState({ startingDate });
//   };

//   setEndDate = (date) => {
//     let endingDate = moment(date);
//     this.setState({ endingDate });
//   };

//   setRange = (timestamp) => {
//     this.setState({ timestamp });
//   };

//   updateDataArray = (new_data_array) => {
//     this.setState(
//       {
//         dataArray: new_data_array,
//       },
//       () => {
//         this.initializedCsvData();
//       }
//     );
//   };

//   initializedCsvData = () => {
//     let data = JSON.parse(JSON.stringify(this.state));
//     let csvData = [
//       [
//         "דו”ח פיננסי לחודש",
//         " ",
//         `${moment(data.startingDate).format("DD/MM/YYYY")} - ${moment(
//           data.endingDate
//         ).format("DD/MM/YYYY")}`,
//       ],
//       [],
//       [
//         "סה”כ מתוכנן:",
//         `${"-"}`,
//         "סה”כ בפועל:",
//         `${data.total}`,
//         `צפי מתוכנן:`,
//         `${data.forecast}`,
//       ],
//       [
//         "הוקדם:",
//         "",
//         `${data.prevCounter}`,
//         "יצא:",
//         "",
//         `${data.exitedCounter}`,
//         "",
//         "נדחה:",
//         "",
//         `${data.delayedCounter}`,
//       ],
//       [],
//       ["שם לקוח", "מנהל פרויקט", "שלב", "מתוכנן", "יצא", "הוקדם", "נדחה"],
//     ];

//     data.dataArray.map((item) => {
//       console.log(item);
//       if (item.typeOfArray === "profits" && !item.showOrNot) {
//       } else {
//         let valueFloored = Math.floor(item.value);
//         csvData.push([
//           item.order && item.order.client_name
//             ? item.order.client_name
//             : item.client_name
//             ? item.client_name
//             : "-",
//           item.departments_for_mps &&
//           item.departments_for_mps[0] &&
//           item.departments_for_mps[0].name
//             ? item.departments_for_mps[0].name
//             : "-",
//           item.process.name ? item.process.name : "-",
//           item.typeOfArray === "planned_profits" &&
//           item.is_delayed_value === 0 &&
//           valueFloored
//             ? valueFloored.toLocaleString()
//             : "-",
//           item.typeOfArray === "planned_profits" &&
//           item.isExited &&
//           item.is_exited > 0 &&
//           valueFloored
//             ? valueFloored.toLocaleString()
//             : "-",
//           item.done && item.typeOfArray === "new_profits" && valueFloored
//             ? valueFloored.toLocaleString()
//             : "-",
//           item.typeOfArray === "planned_profits" &&
//           item.isDelayed &&
//           valueFloored
//             ? valueFloored.toLocaleString()
//             : "-",
//         ]);
//       }
//     });

//     this.setState({ csvData });
//   };

//   render() {
//     const {
//       startingDate,
//       endingDate,
//       loader,
//       csvData,
//       changeToNewDates,
//       timestamp,
//       isGenerated,
//     } = this.state;
//     let reportsPageData = JSON.parse(JSON.stringify(this.state));
//     return (
//       <div className="reports__container">
//         <SideBar />

//         <div className="reports-page">
//           {loader ? <Loader /> : null}
//           <ReportsSideNav
//             setStartDate={this.setStartDate}
//             setEndDate={this.setEndDate}
//             setRange={this.setRange}
//             generateReport={this.generateReport}
//             csvData={csvData}
//             timestamp={timestamp}
//             isGenerated={isGenerated}
//           />
//           <ReportsPage
//             resetChangeToNewDates={this.resetChangeToNewDates}
//             changeToNewDates={changeToNewDates}
//             updateDataArray={this.updateDataArray}
//             startingDate={startingDate}
//             endingDate={endingDate}
//             reportsPageData={reportsPageData}
//           />
//         </div>
//       </div>
//     );
//   }
// }

// export default Reports;
