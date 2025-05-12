import React, { Component } from 'react';
import { withRouter } from 'react-router-dom';
import '../../../../sass/reservationpopup/reservation_popup.scss';
import moment from 'moment';
import * as momentBusinessDays from 'moment-business-days';

//compnonets
import ResevrationPopupContent from './parts/ResevrationPopupContent';
import Loader from '../../../LoaderNew/Loader';
//functions
import { generalPostRequest, generalGetRequest } from './functions/api';
//icons
import { SvgIcon } from '@material-ui/core';
import ClearIcon from '@material-ui/icons/Clear';
//redux config
import { connect } from 'react-redux';
import * as actions from '../../../../actions/actions';
import { PER_USER } from '../../../../tools/keys/variables';
import { VIEW_ONLY } from '../../../../tools/keys/variables';
import {
  CUSTOM_FIELDS_PHONE,
  CUSTOM_FIELDS_CONTACT_NAME,
} from '../../../../constants/custom-fields';
import { PROPOSAL } from '../../../../constants/order-types-values';
import { METALPRESS } from '../../../../constants/factories';
import {
  METALPRESS_DOORS_PRODUCTION,
  METALPRESS_DOORS_INSTALLATION,
  METALPRESS_DOORS_ENGINEERING,
} from '../../../../constants/sub-departments';

class ReservationPopup extends Component {
  constructor(props) {
    super();

    this.state = {
      mounted: false,
      loader: false,
      editMode: false,
      initValidation: false,
      processOptions: {},
      initialDueDate: null,
      formData: {
        proposal: props.customerPageOrderType === PROPOSAL,
        typeOfReservation: { type: null },
        customFields: [
          // {[CUSTOM_FIELDS_PHONE]: props.contactPhone},
          // {[CUSTOM_FIELDS_CONTACT_NAME]: props.contactName}
        ],
        category: { _id: null },
        systemList: [],
        client_name: props.contactName,
        client_phone: props.contactPhone,
        client_email: props.email,
        city: props.city,
        address: props.address,
        resourcesForDepartments: {},
      },
    };
  }

  componentDidMount() {
    //initialize enter animation
    setTimeout(() => {
      this.setState({ mounted: true });
    }, 10);

    // const holidays = this.props.login.user.holidays.filter(i=> i.status === "Day Off").map(i => moment(i.date).format('MM-DD-YYYY'))

    // momentBusinessDays.updateLocale('us', {
    //     holidays,
    //     holidayFormat: 'MM-DD-YYYY',
    //     workingWeekdays: this.props.login.user.mps_view !== 'day' ? [0, 1, 2, 3, 4 ] : [0, 1, 2, 3 ]
    // });

    this.getProcessOptions();

    this.setState({ mounted: true });
    if (Object.keys(this.props.mainPopup.order_data).length > 0)
      this.initializeDataForEdit(
        this.props.mainPopup.order_data,
        this.props.mainPopup.current_steps,
      );
  }

  componentDidUpdate(prevProps, prevState) {
    const prevValue =
      prevState.formData.value && typeof prevState.formData.value === 'string'
        ? Number(prevState.formData.value.replace(/,/g, ''))
        : typeof this.state.formData.value === 'number'
        ? this.state.formData.value
        : '';
    const currentValue =
      this.state.formData.value && typeof this.state.formData.value === 'string'
        ? Number(this.state.formData.value.replace(/,/g, ''))
        : typeof this.state.formData.value === 'number'
        ? this.state.formData.value
        : '';
    if (prevValue !== currentValue && !isNaN(currentValue) && !isNaN(prevValue)) {
      let newFormData = { ...this.state.formData };
      if (newFormData.collection_stages) {
        newFormData.collection_stages = newFormData.collection_stages.map((item) => {
          return { ...item, value: Number(currentValue) * (item.percentage / 100) };
        });
        this.setState({ formData: newFormData });
      }
    }
  }

  getProcessOptions = async (typeItem) => {
    const type = 0;
    //Type 1 order always take the type 0 Gantt form the same company and allows choosing one of it's processes on the dropdown.
    // const duration = typeItem ? Number(typeItem.duration) || 0 : 0;
    let processOptions = await generalGetRequest(`/system/process/get?type=${type}`);
    processOptions = processOptions.result;
    // const due_date = momentBusinessDays(new Date()).businessAdd( duration ? duration : 1 )._d;
    this.setState((prevState) => ({
      ...prevState,
      processOptions,
      formData: {
        ...prevState.formData,
        // due_date: Object.keys(this.props.mainPopup.order_data).length > 0 ? prevState.formData.due_date : due_date
      },
    }));
  };

  initializeDataForEdit = (data) => {
    let newFormData = { ...this.state.formData };
    // set new formdata state
    newFormData.typeOfReservation = data.type;
    newFormData.cancelled = data.cancelled;
    newFormData.proposal = !data.started && !data.cancelled;
    newFormData.order_number = data.order_number;
    newFormData.client_name = data.client_name;
    newFormData.due_date = data.due_date;
    newFormData.city = { name: data.city };
    newFormData.address = data.address;
    newFormData.client_phone = data.client_phone;
    newFormData.second_phone = data.second_phone;
    newFormData.client_email = data.client_email;
    newFormData.employees = data.employees;
    newFormData.quantity = data.quantity;
    newFormData.value =
      data.value && data.value && typeof data.value === 'string'
        ? Number(data.value.replace(/,/g, ''))
        : typeof data.value === 'number'
        ? data.value
        : '';
    newFormData.custom_process = data.custom_process ? data.custom_process : {};
    newFormData.collection_stages = data.collection_stages;
    newFormData.customFields =
      data.custom_inputs != null
        ? Object.keys(data.custom_inputs).map((item) => {
            return { [item]: data.custom_inputs[item] };
          })
        : [];
    //
    newFormData.category._id = data.order_category_id;
    newFormData.payment_method_id = data.payment_method_id;
    newFormData.terms_payment_id = data.term_payment_id;
    newFormData.system_types = data.system_types ? data.system_types : [];
    newFormData.system_list = data.system_list ? data.system_list : [];
    newFormData.technician_resource = data.technician_resource
      ? data.technician_resource
      : undefined;
    newFormData.customer_id = data.customer_id ? data.customer_id : undefined;
    newFormData.labor_cost = data.labor_cost ? data.labor_cost : undefined;
    newFormData.agreement_terms = data.agreement_terms ? data.agreement_terms : undefined;
    //
    newFormData.resourcesForDepartments = data.resources_for_departments || {};
    newFormData.plannedDueDate = data.planned_due_date;

    data.employees.map((employee, index) => {
      return (newFormData['employee' + employee.sub_department_name] = { ...employee });
    });
    this.setState({
      formData: newFormData,
      initialDueDate: newFormData.due_date,
    });
  };

  closePopup = () => {
    this.setState({ mounted: false });
    setTimeout(() => {
      this.props.closePopup();
    }, 200);
  };

  updateFormData = (name, value) => {
    let newFormData = JSON.parse(JSON.stringify(this.state.formData));
    if (name === 'customFields') {
      let idsArr = newFormData[name].map((item) => Object.keys(item)[0]);
      if (idsArr.includes(Object.keys(value)[0])) {
        let index = idsArr.findIndex((item) => {
          return item === Object.keys(value)[0];
        });
        newFormData[name][index] = value;
      } else {
        newFormData[name].push(value);
      }
    } else if (name === 'client_name' && value && typeof value === 'object') {
      const setCustomFieldValue = (fieldName, value) => {
        let valueExist = false;
        newFormData['customFields'].map((i, idx) => {
          const [entries] = Object.entries(i);
          const key = entries[0];
          if (key === fieldName) {
            valueExist = true;
            if (value) {
              newFormData['customFields'][idx] = { [fieldName]: value };
            } else {
              newFormData['customFields'].splice(idx, 1);
            }
          }
        });

        if (!valueExist && value) {
          newFormData['customFields'].push({ [fieldName]: value });
        }
      };

      newFormData['client_name'] = value.name;
      newFormData['customer_id'] = value._id;
      newFormData['city'] = { name: value.city };
      newFormData['address'] = value.address;
      newFormData['client_email'] = value.email;
      newFormData['client_phone'] = value.phone;
      if (this.props.login.user.factory_id === METALPRESS) {
        setCustomFieldValue(CUSTOM_FIELDS_PHONE, value.phone);
        setCustomFieldValue(CUSTOM_FIELDS_CONTACT_NAME, value.contact_name);
      }
    } else if (
      name === METALPRESS_DOORS_PRODUCTION ||
      name === METALPRESS_DOORS_INSTALLATION ||
      name === METALPRESS_DOORS_ENGINEERING
    ) {
      newFormData.resourcesForDepartments[name] = value;
    } else {
      newFormData[name] = value;
    }

    this.setState({
      formData: newFormData,
    });
  };

  setError = async (stateName) => {
    this.setState({ [stateName + 'Err']: true });
  };

  clearError = (stateName) => {
    this.setState({ [stateName + 'Err']: false });
  };

  submitForm = () => {
    this.validate();
    setTimeout(async () => {
      let errorsArray = Object.keys(this.state).filter((item) => {
        return item.includes('Err') && this.state[item] === true;
      });
      if (errorsArray.length > 0) {
        return;
      }

      this.setState({ loader: true });
      let body = this.bodyBuilder();
      //if edit mode add the id
      if (Object.keys(this.props.mainPopup.order_data).length > 0) {
        body._id = this.props.mainPopup.order_data._id;
      }

      let res;

      //check if in edit mode
      if (Object.keys(this.props.mainPopup.order_data).length > 0) {
        res = await generalPostRequest(body, `/system/order/update`);
        this.props.setOrderUpdatedFromCustomersPage(res?.result);
      } else {
        res = await generalPostRequest(body, `/system/order/create`);
      }

      if (res.ok && res.result) {
        this.setState({ loader: false });
        this.props.closePopup();
        if (Object.keys(this.props.mainPopup.order_data).length > 0) {
          // check if date changed to know if show success popup (to prevent double popup apearence of reposition and success)
          let initDate = new Date(this.state.initialDueDate);
          let newDate = new Date(body.due_date);
          if (
            initDate.getFullYear() === newDate.getFullYear() &&
            initDate.getMonth() === newDate.getMonth() &&
            initDate.getDate() === newDate.getDate()
          ) {
            this.props.updateErrorPopup(true, 'הלקוח עודכן בהצלחה!', true);
          }
          //
          //update Ui ---> UPDATE THE CURRENT ORDER IN REDUX
          if (
            window.location.pathname.includes(`/yearly`) ||
            window.location.pathname.includes(`/bids`)
          ) {
            // send to redux and update order and reposition in yearly component:
            this.props.setOrderAfterEditFromPopup(res.result);
            this.props.setNewDueDateAfterEditFromPopup(
              new Date(this.state.formData.due_date).toISOString(),
            );
          } else {
            this.props.setNewDueDateAfterEditFromPopup(
              new Date(this.state.formData.due_date).toISOString(),
            );
            this.props.saveEdditedOrderIdForConstantReposition(this.props.mainPopup.order_data._id);
          }

          //reset the date in redux
          this.props.setOrderAfterEditFromPopup({});
          this.props.setOrderIdForPopup('');
          this.props.setNewDueDateAfterEditFromPopup('');
          this.props.saveEdditedOrderIdForConstantReposition(null);
        } else {
          //check if yearly view for custom response
          if (Array.isArray(res.result)) {
            //handle error
            if (res.result.length === 0 || this.props.orders.weeks_array.length === 0) return;
            this.props.saveNewOrder(res.result[0].order_id);

            //sets the "lastWeek" variable according to mps view day or week to show in ui by updating redux
            let lastWeek;
            if (this.props.login.user.mps_view === 'day') {
              lastWeek = moment(
                this.props.orders.weeks_array[this.props.orders.weeks_array.length - 1]
                  .start_day_formated,
              ).format();
            } else {
              lastWeek = moment(
                this.props.orders.weeks_array[this.props.orders.weeks_array.length - 1].end_week,
              ).format();
            }
            let newOrderDate = moment(res.result[0].due_date).format();

            if (moment(lastWeek)._d.getTime() > moment(newOrderDate)._d.getTime())
              this.props.addNewOrderTopList({
                id: res.result[0].order_id,
                data: res.result[0],
              });
          } else {
            //rest of the views
            this.props.saveNewOrder(res.result.order_id);
          }
          this.props.updateErrorPopup(true, 'הלקוח נוסף בהצלחה!');
        }
      } else {
        this.setState({ loader: false });
        this.props.closePopup();
        if (Object.keys(this.props.mainPopup.order_data).length > 0) {
          this.props.updateErrorPopup(true, 'ארעה שגיאה בעדכון לקוח, אנא נסה שנית');
        } else {
          this.props.updateErrorPopup(true, 'ארעה שגיאה בהוספת לקוח, אנא נסה שנית');
        }
      }
    }, 0);
  };

  validate = () => {
    this.setState({ initValidation: true }, () => {
      setTimeout(() => {
        this.setState({ initValidation: false });
      }, 500);
    });
  };

  bodyBuilder = () => {
    const { formData } = this.state;

    let employees = Object.keys(this.state.formData)
      .filter((item) => item.includes('employee'))
      .map((item) => this.state.formData[item]._id);

    // let system_types =  this.state.formData['system_types'].map(item=>{return item._id})
    let system_types;
    if (this.state.formData['system_types']) {
      system_types = this.state.formData['system_types'].map((item) => {
        return item._id;
      });
    }

    let newCollections = undefined;
    if (formData.collection_stages)
      newCollections = formData.collection_stages.map((item) => {
        let newItem = {
          process_id: item.process_id,
          percentage: item.percentage,
          value:
            (formData.value && typeof formData.value === 'string'
              ? Number(formData['value'].replace(/,/g, ''))
              : typeof formData.value === 'number'
              ? formData.value
              : '') *
            (item.percentage / 100),
          days: item.days,
          invoice_issued: item.invoice_issued,
          payment_received: item.payment_received,
        };
        return newItem;
      });
    let quantity = undefined;
    if (formData.typeOfReservation.formType === '7') {
      quantity = formData.quantity ? Number(formData.quantity) : 1;
    } else {
      quantity = formData.quantity ? Number(formData.quantity) : undefined;
    }

    let body = {
      type: formData.typeOfReservation.type,
      started: !formData.proposal,
      cancelled: formData.cancelled,
      order_number: formData.order_number ? formData.order_number : undefined,
      custom_process: formData.custom_process ? formData.custom_process : undefined,
      client_name: formData.client_name ? formData.client_name : undefined,
      due_date: formData.due_date
        ? new Date(formData.due_date).toISOString()
        : new Date().toISOString(),
      city: formData.city ? formData.city.name : undefined,
      address: formData.address ? formData.address : undefined,
      client_phone: formData.client_phone ? formData.client_phone : undefined,
      second_phone: formData.second_phone ? formData.second_phone : undefined,
      client_email: formData.client_email ? formData.client_email : undefined,
      employees,
      quantity,
      value:
        formData.value && typeof formData.value === 'string'
          ? Number(formData.value.replace(/,/g, ''))
          : typeof formData.value === 'number'
          ? formData.value
          : undefined,
      collection_stages: newCollections,
      technician_resource: formData.technician_resource,

      order_category_id: formData.category._id,
      sub_category_id: formData.typeOfReservation._id,
      term_payment_id: formData.termsPayment ? formData.termsPayment._id : undefined,
      payment_method_id: formData.paymentMethod ? formData.paymentMethod._id : undefined,
      system_list: formData.systemList ? formData.systemList : [],
      system_types: formData.system_types ? formData.system_types : [],
      department_id:
        Object.keys(this.props.login.selectedDepartment).length > 0
          ? this.props.login.selectedDepartment._id
          : '',
      view:
        Object.keys(this.props.login.addOrderPayload).length > 0
          ? this.props.login.addOrderPayload.view
          : '',
      from:
        Object.keys(this.props.login.addOrderPayload).length > 0
          ? this.props.login.addOrderPayload.from
          : '',
      to:
        Object.keys(this.props.login.addOrderPayload).length > 0
          ? this.props.login.addOrderPayload.to
          : '',
      customer_id: formData.customer_id
        ? formData.customer_id
        : this.props.customerId
        ? this.props.customerId
        : undefined,
      labor_cost: formData.labor_cost ? formData.labor_cost : undefined,
      resources_for_departments: formData.resourcesForDepartments || undefined,
    };

    formData.customFields.map((item) => {
      let customKey = Object.keys(item)[0];
      return (body[customKey] = item[customKey]);
    });

    return body;
  };

  render() {
    const { mounted, editMode, formData, initValidation, loader, processOptions } = this.state;
    let editModeVariable = Object.keys(this.props.mainPopup.order_data).length > 0;

    return (
      <div className="reservation-popup">
        <SvgIcon
          component={ClearIcon}
          className={
            mounted
              ? 'reservation-popup__cancel reservation-popup__cancel--active'
              : 'reservation-popup__cancel'
          }
          onClick={() => {
            this.closePopup();
          }}
        />

        <aside
          className={
            mounted
              ? 'reservation-popup__curtain reservation-popup__curtain--active'
              : 'reservation-popup__curtain'
          }
        ></aside>
        <ResevrationPopupContent
          mounted={mounted}
          formData={formData}
          onTypeChange={this.getProcessOptions}
          updateFormData={this.updateFormData}
          initValidation={initValidation}
          setError={this.setError}
          clearError={this.clearError}
          editMode={editModeVariable}
          processOptions={processOptions}
          perUserMode={this.props.login.user.privileges.includes(PER_USER)}
          viewOnlyMode={this.props.login.user.privileges.includes(VIEW_ONLY)}
          currentFactory_id={this.props.login.user.factory_id}
          closeIcon={
            <SvgIcon
              component={ClearIcon}
              className={
                mounted
                  ? 'reservation-popup__cancel__inner reservation-popup__cancel__inner--active'
                  : 'reservation-popup__cancel__inner'
              }
              onClick={() => {
                this.closePopup();
              }}
            />
          }
          orderId={this.props.mainPopup.order_data._id}
          selectedOrderType={this.props.customerPageOrderType}
        />
        <div
          className={
            mounted
              ? 'reservation-popup__submit reservation-popup__submit--active'
              : 'reservation-popup__submit'
          }
        >
          <button
            onClick={() => {
              this.submitForm();
            }}
          >
            {loader ? <Loader /> : editModeVariable ? <p>עדכן</p> : <p>הוסף הזמנה</p>}
          </button>
        </div>
      </div>
    );
  }
}

// export default ReservationPopup

function mapStateToProps({ login, mainPopup, orders, orderTypes }) {
  return { login, mainPopup, orders, orderTypes };
}

export default withRouter(connect(mapStateToProps, actions)(ReservationPopup));
