import React, { Component, useEffect, useState } from 'react';
import moment from 'moment';
import { isThisSecond } from 'date-fns/esm';
import sort_icon from '../../../images/general/arrow_2.svg';
import sort_icon_up from '../../../images/general/arrow_1.svg';
import {
  updateInvoiceOrder,
  updateIsPaymentReceivedOrder,
} from '../../../actions/updateOrderPaymentActions';
import { useDispatch, useSelector, connect } from 'react-redux';
import * as actions from '../../../actions/actions';
import { withRouter } from 'react-router-dom';
import Loader from '../../LoaderNew/Loader';

class ReportsPage extends Component {
  constructor(props) {
    super(props);
    this.state = {
      data_array: this.props.reportsPageData.dataArray,
      sorted_tab: 'client_name',
      //for sort  type - start
      sort_type_client: false,
      // sort_type_departments: false,
      sort_type_process: false,
      // planned_value: false,
      // is_exited: false,
      // is_done_value: false,
      // is_delayed_value:false,
      //for sort  type - end
      planned_value: false,
      actual_value: false,
      dataForCsv: [],
    };
  }

  sortDate = (sort_by) => {
    const {
      data_array,
      sort_type_client,
      sort_type_process,
      planned_value,
      actual_value,
    } = this.state;
    let copy_data = JSON.parse(JSON.stringify(data_array));
    let sort_data;

    if (sort_by === 'customer_name') {
      if (sort_type_client) {
        sort_data = copy_data.sort((a, b) => a[sort_by] && a[sort_by].localeCompare(b[sort_by]));
      } else {
        sort_data = copy_data
          .sort((a, b) => a[sort_by] && a[sort_by].localeCompare(b[sort_by]))
          .reverse();
      }

      this.setState({
        sort_type_client: !sort_type_client,
      });
    } else if (sort_by === 'process') {
      if (sort_type_process) {
        sort_data = copy_data.sort((a, b) => a[sort_by].localeCompare(b[sort_by]));
      } else {
        sort_data = copy_data.sort((a, b) => a[sort_by].localeCompare(b[sort_by])).reverse();
      }

      this.setState({
        sort_type_process: !sort_type_process,
      });
    } else if (sort_by === 'planned') {
      if (planned_value) {
        sort_data = copy_data.sort((a, b) => a[sort_by] - b[sort_by]);
      } else {
        sort_data = copy_data.sort((a, b) => a[sort_by] - b[sort_by]).reverse();
      }
      this.setState({
        planned_value: !this.state['planned_value'],
      });
    } else if (sort_by === 'actual') {
      if (actual_value) {
        sort_data = copy_data.sort((a, b) => a[sort_by] - b[sort_by]);
      } else {
        sort_data = copy_data.sort((a, b) => a[sort_by] - b[sort_by]).reverse();
      }
      this.setState({
        actual_value: !this.state['actual_value'],
      });
    }

    this.setState(
      {
        data_array: sort_data,
        sorted_tab: sort_by,
      },
      () => {
        //update data array for csv
        this.props.updateDataArray(sort_data);
      },
    );
  };

  updateDataForCsv = (idx, item, changes) => {
    let dataArray = [...this.state.data_array];
    dataArray[idx] = { ...item, ...changes };
    // this.props.updateDataArray(dataArray)
    this.setState({ data_array: dataArray }, () => this.props.updateDataArray(dataArray));
    // dataForCsv[idx] = {...item, ...changes}
  };

  componentDidUpdate(prevProps, prevState) {
    const {
      reportsPageData,
      changeToNewDates,
      resetChangeToNewDates,
      updateStagesInFinancialReport,
      updateTotalActualValue,
    } = this.props;
    if (
      reportsPageData &&
      reportsPageData.dataArray &&
      JSON.stringify(prevProps.reportsPageData.dataArray) !==
        JSON.stringify(reportsPageData.dataArray)
    ) {
      this.setState({ data_array: reportsPageData.dataArray });
    }
    if (
      (reportsPageData.total_actual || reportsPageData.total_actual !== 0) &&
      reportsPageData.total_actual !== prevProps.reportsPageData.total_actual
    ) {
      this.setState({ total_actual: reportsPageData.total_actual });
    }
    if (
      updateStagesInFinancialReport.updateStageInvoice &&
      updateStagesInFinancialReport.updateStageInvoice.invoice_issued &&
      prevProps.updateStagesInFinancialReport.updateStageInvoice !==
        updateStagesInFinancialReport.updateStageInvoice
    ) {
      this.setState(
        {
          total_actual:
            this.state.total_actual + updateStagesInFinancialReport.updateStageInvoice.value,
        },
        () => updateTotalActualValue(this.state.total_actual),
      );
    } else if (
      updateStagesInFinancialReport.updateStageInvoice &&
      !updateStagesInFinancialReport.updateStageInvoice.invoice_issued &&
      prevProps.updateStagesInFinancialReport.updateStageInvoice !==
        updateStagesInFinancialReport.updateStageInvoice
    ) {
      this.setState(
        {
          total_actual:
            this.state.total_actual - updateStagesInFinancialReport.updateStageInvoice.value,
        },
        () => updateTotalActualValue(this.state.total_actual),
      );
    }
  }

  render() {
    const { startingDate, endingDate, reportsPageData, isGenerated } = this.props;
    const {
      data_array,
      sorted_tab,
      sort_type_client,
      sort_type_departments,
      sort_type_process,
      planned_value,
      actual_value,
      total_actual,
    } = this.state;
    return (
      <div className="reports-page__reports">
        <header>
          <h1>דו”ח פיננסי לחודש</h1>
          <h2>
            <span>{moment(endingDate).format('DD/MM/YYYY')}</span>
            <span> - </span>
            <span>{moment(startingDate).format('DD/MM/YYYY')}</span>
          </h2>
        </header>
        <section className="reports-page__reports__general-data">
          <div className="reports-page__reports__general-data--section1">
            <span>
              <p>סה”כ מתוכנן:</p>
              <p>
                {reportsPageData.total_planned ? reportsPageData.total_planned.toLocaleString() : 0}
              </p>
            </span>
          </div>
          <div className="reports-page__reports__general-data--section2">
            <span>
              <p>יצא:</p>
              <p>{total_actual ? total_actual.toLocaleString() : 0}</p>
            </span>
          </div>
        </section>

        <div className="reports-page__reports__main-data__header">
          <p onClick={() => this.sortDate('customer_name')}>
            {' '}
            שם לקוח{' '}
            {sorted_tab === 'client_name' ? (
              <img
                className="sort__icon"
                src={sort_type_client ? sort_icon_up : sort_icon}
                alt="sort icon"
              ></img>
            ) : null}
          </p>
          {/* <p onClick={()=> this.sortDate("departments_for_mps")}>מנהל פרויקט {sorted_tab === "departments_for_mps" ?  <img className="sort__icon" src={ sort_type_departments? sort_icon_up : sort_icon} alt="sort icon"></img> : null}</p> */}
          <p onClick={() => this.sortDate('process')}>
            שלב{' '}
            {sorted_tab === 'process' ? (
              <img
                className="sort__icon"
                src={sort_type_process ? sort_icon_up : sort_icon}
                alt="sort icon"
              ></img>
            ) : null}
          </p>
          <p onClick={() => this.sortDate('planned')}>
            מתוכנן{' '}
            {sorted_tab === 'planned' ? (
              <img
                className="sort__icon"
                src={planned_value ? sort_icon_up : sort_icon}
                alt="sort icon"
              ></img>
            ) : null}
          </p>
          <p className="checkboxTittle">לחיוב</p>
          <p className="checkboxTittle">חשבונית</p>
          <p className="checkboxTittle">קבלה</p>
          <p onClick={() => this.sortDate('actual')}>
            יצא{' '}
            {sorted_tab === 'actual' ? (
              <img
                className="sort__icon"
                src={actual_value ? sort_icon_up : sort_icon}
                alt="sort icon"
              ></img>
            ) : null}
          </p>
          {/* <p onClick={()=> this.sortDate("is_done_value")}>הוקדם {sorted_tab === "is_done_value" ?  <img className="sort__icon" src={is_done_value? sort_icon_up : sort_icon} alt="sort icon"></img> : null}</p>
                    <p onClick={()=> this.sortDate("is_delayed_value")}>נדחה {sorted_tab === "is_delayed_value" ?  <img className="sort__icon" src={is_delayed_value? sort_icon_up : sort_icon} alt="sort icon"></img> : null}</p> */}
        </div>

        {isGenerated ? (
          <section className="reports-page__reports__main-data">
            {data_array && data_array.length > 0
              ? data_array.map((item, idx) => {
                  return (
                    <ReportRow
                      key={item.stage_id + item.order_id}
                      updateDataForCsv={this.updateDataForCsv}
                      idx={idx}
                      item={item}
                    />
                  );
                })
              : null}
          </section>
        ) : (
          <Loader />
        )}
      </div>
    );
  }
}

// function ReportCheckboxForPaymentIssued({checkboxValue,order_id,stage_id}){
//     const dispatch = useDispatch()
//     const changeValue = () =>{
//        dispatch( updateInvoiceOrder({order_id,stage_id,isIssued:!checkboxValue}))
//     }
//     return <input type="checkbox" checked = {checkboxValue} onChange = {changeValue}/>
// }

// function ReportCheckboxForPaymentReceived({checkboxValue,order_id,stage_id}){
//     const dispatch = useDispatch()
//     const changeValue = () =>{
//     dispatch(updateIsPaymentReceivedOrder({order_id, stage_id, isReceived:!checkboxValue}))
//     }
//     return <input type="checkbox" checked = {checkboxValue} onChange = {changeValue}/>
// }

function ReportCheckboxForPaymentIssued({ checkboxValue, order_id, stage_id }) {
  const paymentInvoice = useSelector(
    (store) => store.updateStagesInFinancialReport.updateStageInvoice,
  );
  const [isIssued, setIsIssued] = useState(checkboxValue ? true : false);
  const dispatch = useDispatch();

  useEffect(() => {
    if (
      paymentInvoice &&
      paymentInvoice.order_id === order_id &&
      paymentInvoice.stage_id === stage_id
    ) {
      // setIsIssued(paymentInvoice.invoice_issued)
      setIsIssued((prevIsIssued) => !prevIsIssued);
    }
  }, [paymentInvoice]);
  const changeValue = () => {
    dispatch(updateInvoiceOrder({ order_id, stage_id, isIssued: !isIssued }));
  };
  return <input type="checkbox" checked={isIssued} onChange={changeValue} />;
}

function ReportCheckboxForPaymentReceived({ checkboxValue, order_id, stage_id }) {
  const paymentReceived = useSelector(
    (store) => store.updateStagesInFinancialReport.updatePaymentReceived,
  );
  const [isReceived, setIsReceived] = useState(checkboxValue ? true : false);
  const dispatch = useDispatch();
  useEffect(() => {
    if (
      paymentReceived &&
      paymentReceived.order_id === order_id &&
      paymentReceived.stage_id === stage_id
    ) {
      setIsReceived((prevIsReceived) => !prevIsReceived);
      // setIsReceived(paymentReceived.payment_received)
    }
  }, [paymentReceived]);

  const changeValue = () => {
    dispatch(updateIsPaymentReceivedOrder({ order_id, stage_id, isReceived: !isReceived }));
  };
  return <input type="checkbox" checked={isReceived} onChange={changeValue} />;
  // return <input type="checkbox" checked = {checkboxValue} onChange = {changeValue}/>
}

function ReportRow({ item, idx, updateDataForCsv }) {
  const paymentInvoice = useSelector(
    (store) => store.updateStagesInFinancialReport.updateStageInvoice,
  );
  const paymentReceived = useSelector(
    (store) => store.updateStagesInFinancialReport.updatePaymentReceived,
  );

  const [actual, setActual] = useState(item.actual);

  useEffect(() => {
    if (
      paymentInvoice &&
      paymentInvoice.order_id === item.order_id &&
      paymentInvoice.stage_id === item.stage_id &&
      paymentInvoice.invoice_issued
    ) {
      setActual(paymentInvoice.value);
      updateDataForCsv(idx, item, { invoice_issued: true, actual: paymentInvoice.value });
    } else if (
      paymentInvoice &&
      paymentInvoice.order_id === item.order_id &&
      paymentInvoice.stage_id === item.stage_id &&
      !paymentInvoice.invoice_issued
    ) {
      setActual(0);
      updateDataForCsv(idx, item, { invoice_issued: paymentInvoice.invoice_issued, actual: 0 });
    }

    if (
      paymentReceived &&
      paymentReceived.order_id === item.order_id &&
      paymentReceived.stage_id === item.stage_id &&
      paymentReceived.payment_received
    ) {
      updateDataForCsv(idx, item, { payment_received: paymentReceived.payment_received });
    } else if (
      paymentReceived &&
      paymentReceived.order_id === item.order_id &&
      paymentReceived.stage_id === item.stage_id &&
      !paymentReceived.payment_received
    ) {
      updateDataForCsv(idx, item, { payment_received: paymentReceived.payment_received });
    }
  }, [paymentInvoice, paymentReceived]);

  return (
    <div
      key={item.stage_id}
      className={
        item.isDelayed
          ? 'reports-page__reports__main-data__item reports-page__reports__main-data__item--delayed'
          : 'reports-page__reports__main-data__item'
      }
    >
      <p>{item.customer_name ? item.customer_name : ''}</p>
      <p>{item.process ? item.process : ''}</p>
      <p>{item.planned ? item.planned.toLocaleString() : 0}</p>
      <input type="checkbox" checked={item.billable} readOnly />
      <ReportCheckboxForPaymentIssued
        checkboxValue={item.invoice_issued}
        order_id={item.order_id}
        stage_id={item.stage_id}
      />
      <ReportCheckboxForPaymentReceived
        checkboxValue={item.payment_received}
        order_id={item.order_id}
        stage_id={item.stage_id}
      />
      {/* <input type="checkbox" checked = {false}/> */}
      <p>{actual ? actual.toLocaleString() : 0}</p>
    </div>
  );
}

// export default ReportsPage

function mapStateToProps({ updateStagesInFinancialReport }) {
  return { updateStagesInFinancialReport };
}
export default withRouter(connect(mapStateToProps, actions)(ReportsPage));

// import React, { Component } from 'react'
// import moment from 'moment'
// import { isThisSecond } from 'date-fns/esm';
// import sort_icon from "../../../images/general/arrow_2.svg";
// import sort_icon_up from "../../../images/general/arrow_1.svg";

// class ReportsPage extends Component {
//     constructor(props) {
//         super(props);
//         this.state = {
//             data_array: props.reportsPageData.dataArray,
//             sorted_tab: "client_name",
//             //for sort  type - start
//             sort_type_client: false,
//             sort_type_departments: false,
//             sort_type_process: false,
//             planned_value: false,
//             is_exited: false,
//             is_done_value: false,
//             is_delayed_value:false,
//             //for sort  type - end

//       }
//     }

//     sortDate =(sort_by)=>{
//         const {data_array, sort_type_client, sort_type_departments , sort_type_process, planned_value, is_exited, is_done_value, is_delayed_value} = this.state
//         let copy_data = JSON.parse(JSON.stringify(data_array));
//         let sort_data

//         if(sort_by === "client_name" ){
//             if(sort_type_client){
//                 sort_data =  copy_data.sort((a, b) => a[sort_by] && a[sort_by].localeCompare(b[sort_by]))
//             }else{
//                 sort_data =  copy_data.sort((a, b) => a[sort_by] && a[sort_by].localeCompare(b[sort_by])).reverse();
//             }

//             this.setState({
//                 sort_type_client: !sort_type_client
//             })

//         }else if(sort_by === "departments_for_mps"){

//             if(sort_type_departments){
//                 sort_data =  copy_data.sort((a, b) => a.departments_for_mps[0].name.localeCompare(b.departments_for_mps[0].name))
//             }else{
//                 sort_data =  copy_data.sort((a, b) => a.departments_for_mps[0].name.localeCompare(b.departments_for_mps[0].name)).reverse();
//             }

//             this.setState({
//                 sort_type_departments: !sort_type_departments
//             })

//         }else if(sort_by === "process_name"){
//             if(sort_type_process){
//                 sort_data =  copy_data.sort((a, b) => a.process.name.localeCompare(b.process.name))
//             }else{
//                 sort_data =  copy_data.sort((a, b) => a.process.name.localeCompare(b.process.name)).reverse();
//             }

//             this.setState({
//                 sort_type_process: !sort_type_process
//             })

//         }else if(sort_by === "planned_value" ||  sort_by === "is_exited" || sort_by === "is_done_value" || sort_by ===  "is_delayed_value" ){
//             let type_of_sort
//             if(sort_by === "planned_value"){
//                 type_of_sort = planned_value
//             }else if(sort_by === "is_exited"){
//                 type_of_sort = is_exited
//             }else if(sort_by === "is_done_value" ){
//                 type_of_sort = is_done_value
//             }else if(sort_by ===  "is_delayed_value"){
//                 type_of_sort = is_delayed_value
//             }
//             if(type_of_sort){
//                 sort_data =  copy_data.sort((a, b) => a[sort_by] - b[sort_by] )
//             }else{
//                 sort_data =  copy_data.sort((a, b) => b[sort_by] - a[sort_by] )
//             }
//             this.setState({
//                 [sort_by]: !this.state[sort_by]
//             })
//         }

//         this.setState({
//             data_array:sort_data,
//             sorted_tab: sort_by
//         }, ()=>{

//             //update data array for csv
//             this.props.updateDataArray(sort_data)
//         })
//     }

//     fixData=()=>{
//         const {startingDate, endingDate, reportsPageData} = this.props
//         let copy_data = JSON.parse(JSON.stringify(reportsPageData.dataArray));

//         for (let i=0; i < copy_data.length; i ++){

//             let valueFloored

//             if(copy_data[i].value){
//                 valueFloored = Math.floor(copy_data[i].value)
//             }else{
//                 valueFloored = 0
//             }

//          //adding manager key

//             if(!copy_data[i].departments_for_mps){
//                 copy_data[i].departments_for_mps = [{name: ""}]
//             }else{
//             if(copy_data[i].departments_for_mps.length === 0){
//                 copy_data[i].departments_for_mps = [{name: ""}]
//               }
//             }

//          //adding process name key
//             if(!copy_data[i].process.name){
//                 copy_data[i].process.name =  ""
//             }

//          //adding client_name key
//             if(copy_data[i].client_name == null){
//                 if(copy_data[i].order && copy_data[i].order.client_name)
//                 copy_data[i].client_name = copy_data[i].order.client_name
//             }

//         //adding planned_value key
//             if(copy_data[i].typeOfArray === 'planned_profits' ){
//                 copy_data[i].planned_value = valueFloored
//             }else{
//                 copy_data[i].planned_value = 0
//             }

//         //adding is_exited key
//             if((copy_data[i].typeOfArray === 'planned_profits' && copy_data[i].isExited) || (copy_data[i].typeOfArray === 'profits' && copy_data[i].showOrNot) ){
//                 if(copy_data[i].done) {
//                     copy_data[i].is_exited = valueFloored
//                 } else {
//                     copy_data[i].is_exited = 0
//                 }

//             }else{
//                 copy_data[i].is_exited = 0
//             }

//         //adding is_done_value key
//             if(copy_data[i].done && copy_data[i].typeOfArray === 'new_profits'  ){
//                 copy_data[i].is_done_value = valueFloored
//             }else{
//                 copy_data[i].is_done_value = 0
//             }

//         //adding is_delayed_value key

//             if(copy_data[i].typeOfArray === 'planned_profits' && copy_data[i].isDelayed){
//                 copy_data[i].is_delayed_value = valueFloored
//             }else{
//                 copy_data[i].is_delayed_value = 0
//             }
//         }

//         this.setState({
//             data_array: copy_data,
//         }, ()=>{
//                 if(reportsPageData.dataArray.length > 0){
//                     this.sortDate("client_name")
//                     this.props.resetChangeToNewDates()
//                 }
//         })
//     }

//     componentDidUpdate(prevProps, prevState) {
//         const { reportsPageData, changeToNewDates, resetChangeToNewDates} = this.props
//         if(  JSON.stringify(prevProps.reportsPageData.dataArray) !== JSON.stringify(reportsPageData.dataArray) && changeToNewDates ) {
//             this.fixData()
//         }
//     }

//     render() {
//         const {startingDate, endingDate, reportsPageData} = this.props
//         const {data_array, sorted_tab , sort_type_client, sort_type_departments , sort_type_process, planned_value, is_exited, is_done_value, is_delayed_value} = this.state

//         return (
//             <div className="reports-page__reports">
//                 <header>
//                     <h1>דו”ח פיננסי לחודש</h1>
//                     <h2>
//                         <span>{moment(endingDate).format('DD/MM/YYYY')}</span>
//                         <span> - </span>
//                         <span>{moment(startingDate).format('DD/MM/YYYY')}</span>
//                     </h2>
//                 </header>

//                 <section className="reports-page__reports__general-data">
//                     <div className="reports-page__reports__general-data--section1">
//                         <span>
//                             <p>סה”כ מתוכנן:</p>
//                             {/* <p>{(reportsPageData.planned).toLocaleString()}</p> */}
//                             <p>-</p>
//                         </span>
//                         <span>
//                             <p>סה”כ בפועל:</p>
//                             <p>{(reportsPageData.total).toLocaleString()}</p>
//                         </span>
//                         <span>
//                             <p>צפי מתוכנן:</p>
//                             {/* <p>{(reportsPageData.forecast + reportsPageData.total).toLocaleString()}</p> */}
//                             <p>{(reportsPageData.planned + reportsPageData.exitedCounter + reportsPageData.prevCounter).toLocaleString()}</p>
//                         </span>
//                         {/* style={{marginRight: '47px'}} */}
//                     </div>
//                     <div className="reports-page__reports__general-data--section2">
//                         <span>
//                             <p>יצא:</p>
//                             <p>{(reportsPageData.exitedCounter).toLocaleString()}</p>
//                         </span>
//                         <span>
//                             <p>הוקדם:</p>
//                             <p>{(reportsPageData.prevCounter).toLocaleString()}</p>
//                         </span>
//                         <span>
//                             <p>נדחה:</p>
//                             <p>{(reportsPageData.delayedCounter).toLocaleString()}</p>
//                         </span>
//                     </div>
//                 </section>

//                 <div className="reports-page__reports__main-data__header">
//                     <p onClick={()=> this.sortDate("client_name")}> שם לקוח {sorted_tab === "client_name" ?  <img className="sort__icon" src={sort_type_client ? sort_icon_up : sort_icon } alt="sort icon"></img> : null}</p>
//                     <p onClick={()=> this.sortDate("departments_for_mps")}>מנהל פרויקט {sorted_tab === "departments_for_mps" ?  <img className="sort__icon" src={ sort_type_departments? sort_icon_up : sort_icon} alt="sort icon"></img> : null}</p>
//                     <p onClick={()=> this.sortDate("process_name")}>שלב {sorted_tab === "process_name" ?  <img className="sort__icon" src={sort_type_process? sort_icon_up : sort_icon} alt="sort icon"></img> : null}</p>
//                     <p onClick={()=> this.sortDate("planned_value")}>מתוכנן {sorted_tab === "planned_value" ?  <img className="sort__icon" src={planned_value? sort_icon_up : sort_icon} alt="sort icon"></img> : null}</p>
//                     <p onClick={()=> this.sortDate("is_exited")}>יצא {sorted_tab === "is_exited" ?  <img className="sort__icon" src={is_exited? sort_icon_up : sort_icon} alt="sort icon"></img> : null}</p>
//                     <p onClick={()=> this.sortDate("is_done_value")}>הוקדם {sorted_tab === "is_done_value" ?  <img className="sort__icon" src={is_done_value? sort_icon_up : sort_icon} alt="sort icon"></img> : null}</p>
//                     <p onClick={()=> this.sortDate("is_delayed_value")}>נדחה {sorted_tab === "is_delayed_value" ?  <img className="sort__icon" src={is_delayed_value? sort_icon_up : sort_icon} alt="sort icon"></img> : null}</p>
//                 </div>

//                 <section className="reports-page__reports__main-data">

//                     {data_array && data_array.length > 0 ?
//                         data_array.map(item=>{

//                             // let valueFloored = Math.floor(item.value)
//                             return  <div key ={item._id}
//                                          className={item.isDelayed ? "reports-page__reports__main-data__item reports-page__reports__main-data__item--delayed":"reports-page__reports__main-data__item"}>
//                                         <p>{item.order && item.order.client_name ? item.order.client_name : item.client_name ? item.client_name:'-'}</p>
//                                         {/* for now its hardcoded - to be changed later */}
//                                         <p>{item.departments_for_mps[0].name === "" ? '-' : item.departments_for_mps[0].name}</p>

//                                         <p>{item.process.name === "" ? '-' : item.process.name}</p>

//                                         <p>{item.planned_value === 0 || item.is_delayed_value > 0 ? "-" : item.planned_value.toLocaleString()}</p>

//                                         <p>{item.is_exited === 0 ? "-" : item.is_exited.toLocaleString()}</p>

//                                         <p>{item.is_done_value === 0 ? "-" : item.is_done_value.toLocaleString()}</p>

//                                         <p>{item.is_delayed_value === 0 ? "-" : item.is_delayed_value.toLocaleString()}</p>
//                                     </div>
//                         }):null

//                     }
//                 </section>
//             </div>
//         )
//     }
// }

// export default ReportsPage
