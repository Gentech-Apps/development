import React, { Component } from 'react';
import '../../../../sass/popup/popup.scss';
import RightSide from './Parts/RightSide/RightSide.jsx';
import LeftSide from './Parts/LeftSide/LeftSide.jsx';
import uniqid from 'uniqid';
import { getProcessSteps } from '../../../../functions/api/popup.js';
import { Link, Element, Events, animateScroll as scroll, scrollSpy, scroller } from 'react-scroll';

import {
  getSalesAndProjectManager,
  addClient,
  updateClient,
} from '../../../../functions/api/popup.js';
import { connect } from 'react-redux';
import * as actions from '../../../../actions/actions.js';
import moment from 'moment';
import { polyfill } from 'es6-promise';
import { thisExpression } from '@babel/types';
import PopupLoader from '../../../PopupLoader/PopupLoader.jsx';
import Loader from '../../../LoaderNew/Loader.js';
//icons
import { SvgIcon } from '@material-ui/core';
import ClearIcon from '@material-ui/icons/Clear';
polyfill();

class Popup extends Component {
  constructor(props) {
    super(props);
    this.state = {
      form_data: {
        date: '',
        client_name: '',
        client_phone: ' ',
        client_email: ' ',
        orders_status: true,
        quantity: ' ',
        transaction_value: ' ',
        order_number: '',
        cancelled: false,
        current_sales_manager_name: '',
        current_sales_project_manager: '',
      },

      address: '',
      city: '',
      updatePopUp: false,

      order_inputs: {},
      customStepApiData: {},

      project_steps: [
        {
          process_id: ' ',
          name: '',
          amount: '',
          percent: ' ',
          id: 1,
        },
      ],
      project_managers_from_db: props.project_managers_from_db,
      sales_managers_from_db: props.sales_managers_from_db,
      favorite_steps_process_from_db: [],
      steps_process_from_db: [],

      is_validate_project_steps: true,
      loading_popup: false,
      is_disabled_for_transaction_value: false,
      validate_message: '',
      isHundredPercent: true,
      is_validate_steps: true,
      first_time: true,
      //validat all the inputs --> check in the component will reciveprops all the childs
      validate_all_form: false,
      is_loaded: props.mainPopup.order_id.length > 0 ? false : true,
      popup_title: props.mainPopup.order_id.length > 0 ? 'עדכון הזמנה' : 'הוספת הזמנה',
      submit_button_text: props.mainPopup.order_id.length > 0 ? 'עדכן הזמנה' : 'הוסף הזמנה',
    };
  }

  updateFormOrderInputs = (id, value) => {
    if (id === 'address' || id === 'city') {
      this.setState({
        [id]: value,
      });
    } else {
      let copy_order_inputs = { ...this.state.order_inputs };
      copy_order_inputs[id] = value;
      this.setState({
        order_inputs: copy_order_inputs,
      });
    }
  };

  componentDidMount = async () => {
    let res = await getProcessSteps('1');
    this.setState({ customStepApiData: res[0] });
    const { mainPopup, get_order_input_popup } = this.props;
    let copy_mainPopup = JSON.parse(JSON.stringify(mainPopup));

    // let copy_mainPopup = JSON.parse(JSON.stringify(mainPopup));
    const { form_data, order_inputs, city, address } = this.state;
    let copy_order_inputs1 = { ...order_inputs };

    for (let input of get_order_input_popup) {
      copy_order_inputs1[input._id] = ' ';
    }

    this.setState({
      order_inputs: copy_order_inputs1,
    });

    if (copy_mainPopup.order_id.length > 0) {
      console.log(copy_mainPopup);

      // this.pushCurrentSteps(); ---> like   this.pushFavoriteSteps();  but with new data and amount

      let copy_form_data = JSON.parse(JSON.stringify(form_data));
      let copy_order_inputs = JSON.parse(JSON.stringify(copy_order_inputs1));

      //add the new order input to the state
      if (copy_mainPopup.order_data.custom_inputs !== undefined) {
        let copy_order_inputs_from_api = copy_mainPopup.order_data.custom_inputs;

        let order_inputs_from_api_keys = Object.keys(copy_order_inputs_from_api);

        for (let id of order_inputs_from_api_keys) {
          copy_order_inputs[id] = copy_order_inputs_from_api[id]; // id: value
        }

        this.setState({
          order_inputs: copy_order_inputs,
        });
      }

      copy_form_data.transaction_value = copy_mainPopup.order_data.value;
      copy_form_data.order_number = copy_mainPopup.order_data.order_number;
      copy_form_data.client_name = copy_mainPopup.order_data.client_name;
      copy_form_data.client_phone = copy_mainPopup.order_data.client_phone;
      copy_form_data.client_email = copy_mainPopup.order_data.client_email;
      copy_form_data.orders_status = copy_mainPopup.order_data.started ? true : false;
      copy_form_data.quantity = copy_mainPopup.order_data.quantity;
      copy_form_data.date = new Date(copy_mainPopup.order_data.due_date);

      let current_sales_manager_obj = copy_mainPopup.order_data.employees.find(
        (e) => e.sub_department_name === 'נציג מכירות',
      );

      if (current_sales_manager_obj) {
        let current_sales_manager = current_sales_manager_obj;
        copy_form_data.sales_manager = current_sales_manager._id;
        copy_form_data.current_sales_manager_name = current_sales_manager.name;
      }

      let current_project_manager_obj = copy_mainPopup.order_data.employees.find(
        (e) => e.sub_department_name === 'מנהל פרויקט',
      );

      if (current_project_manager_obj) {
        let current_project_manager = current_project_manager_obj;

        copy_form_data.project_manager = current_project_manager._id;
        copy_form_data.current_sales_project_manager = current_project_manager.name;
      }

      if (copy_mainPopup.order_data.type !== 1) {
        this.pushCurrentSteps(
          copy_mainPopup.order_data.collection_stages,
          copy_mainPopup.order_data.value,
        );
      }

      this.setState(
        {
          form_data: copy_form_data,
          is_loaded: true,
          city: copy_mainPopup.order_data.city,
          address: copy_mainPopup.order_data.address,
          updatePopUp: true,
        },
        () => {
          var element = document.getElementById('steps__container');

          if (copy_mainPopup.order_data.type === 1) {
            element.style.display = 'none';
          } else {
            element.style.display = 'block';
          }
        },
      );
    } else {
      this.pushFavoriteSteps();

      this.setState({
        updatePopUp: false,
      });
    }
  };

  pushCurrentSteps = (current_stages, transaction_value) => {
    const { steps_process_from_db } = this.props;

    let copy_steps_process = JSON.parse(JSON.stringify(steps_process_from_db));
    let copy_favorite_steps_process = JSON.parse(JSON.stringify(current_stages));

    let copy_favorite_ids = copy_favorite_steps_process.map((step) => step.process_id);
    let copy_favorite_amount = copy_favorite_steps_process.map((step) => step.value);

    let filter_fav_steps = copy_steps_process.filter((step) =>
      copy_favorite_ids.includes(step._id),
    );

    if (filter_fav_steps.length > 0) {
      let new_step_array = [];

      for (let i = 0; i < filter_fav_steps.length; i++) {
        let step_id = i + 100;

        let newAmount = copy_favorite_amount[i];

        if (!Number.isInteger(Number(newAmount))) {
          newAmount = Number(newAmount).toFixed(2).toString();
        }

        let newPercent = (100 * newAmount) / transaction_value;

        if (!Number.isInteger(Number(newPercent))) {
          newPercent = Number(newPercent).toFixed(2).toString();
        }

        let new_step_obj = {
          process_id: filter_fav_steps[i]._id,
          name: filter_fav_steps[i].name,
          amount: newAmount,
          percent: newPercent,
          id: step_id,
        };

        new_step_array.push(new_step_obj);
      }

      console.log(new_step_array);

      this.setState({
        project_steps: new_step_array,
      });
    }
  };

  changeDisabledForTransactionValue = (boolean) => {
    this.setState({
      is_disabled_for_transaction_value: boolean,
    });
  };

  pushFavoriteSteps = () => {
    const { form_data } = this.state;
    if (form_data.orders_status === 'מיוחדת') {
      return;
    }

    const { favorite_steps_process_from_db, steps_process_from_db } = this.props;
    let copy_steps_process = JSON.parse(JSON.stringify(steps_process_from_db));
    let copy_favorite_steps_process = JSON.parse(JSON.stringify(favorite_steps_process_from_db));

    let copy_favorite_ids = copy_favorite_steps_process.map((step) => step.process_id);
    let copy_favorite_percentage = copy_favorite_steps_process.map((step) => step.percentage);

    let filter_fav_steps = copy_steps_process.filter((step) =>
      copy_favorite_ids.includes(step._id),
    );

    if (filter_fav_steps.length > 0) {
      let new_step_array = [];

      for (let i = 0; i < filter_fav_steps.length; i++) {
        let step_id = i + 100;
        let new_step_obj = {
          process_id: filter_fav_steps[i]._id,
          name: filter_fav_steps[i].name,
          amount: '',
          percent: copy_favorite_percentage[i],
          id: step_id,
        };

        new_step_array.push(new_step_obj);
      }

      this.setState({
        project_steps: new_step_array,
      });
    }
  };

  determineCustomStep = () => {
    let obj = {
      process_id: 'idididididid',
      name: 'מיוחדת',
      amount: '',
      percent: 100,
      id: 'ijijjji',
    };

    this.setState({ project_steps: [obj] });
  };

  validateFormProjectSteps = () => {
    this.setState({
      is_validate_project_steps: true,
    });
  };

  updateForm = (name, value) => {
    console.log(name, value);
    var element = document.getElementById('steps__container'); // or:

    if (name === 'orders_status') {
      if (value === 'מיוחדת') {
        element.style.display = 'none';
      } else {
        element.style.display = 'block';
      }
    }
    let { project_steps, first_time } = this.state;
    let copy_project_steps = JSON.parse(JSON.stringify(project_steps));

    console.log(copy_project_steps);

    let temp_form_date = { ...this.state.form_data };
    temp_form_date[name] = value;

    if (name === 'cancelled') {
      temp_form_date['orders_status'] = false;
    }

    this.setState({
      form_data: temp_form_date,
    });

    // && first_time
    if (name === 'transaction_value') {
      copy_project_steps.forEach((step) => this.addAmount(step, value));
      this.setState({
        project_steps: copy_project_steps,
        first_time: false,
      });
    }
  };

  addAmount = (step, total_value) => {
    step.amount = (step.percent / 100) * total_value;
  };

  addAmountForSpacial = (percent, total_value) => {
    let amount = (percent / 100) * total_value;
    return amount;
  };

  addNewStep = () => {
    let step_id = uniqid();
    let new_step_obj = {
      process_id: '',
      name: '',
      amount: '',
      percent: '',
      id: step_id,
    };
    const { project_steps } = this.state;
    let temp_project_steps = [...project_steps];
    temp_project_steps.push(new_step_obj);

    this.setState({
      project_steps: temp_project_steps,
    });
  };

  editProjectStep = (key, value, id) => {
    const { project_steps, form_data } = this.state;
    let temp_project_steps = [...project_steps];
    let index = temp_project_steps.findIndex((item) => item.id === id);
    let temp_project_step = temp_project_steps[index];

    this.hideIsHundredPercentValidate();
    temp_project_step[key] = value;

    if (key === 'percent') {
      let amount_number = (value / 100) * form_data.transaction_value;
      temp_project_step['amount'] = amount_number;
    }

    this.setState(
      {
        project_steps: temp_project_steps,
      },
      () => {
        this.hideProjectStepValidate();
      },
    );
  };

  hideProjectStepValidate = () => {
    this.setState({
      is_validate_steps: true,
    });
  };

  deleteProjectStep = (step_id) => {
    const { project_steps } = this.state;
    let temp_project_steps = [...project_steps];

    let index = temp_project_steps.findIndex((s) => s.id === step_id);
    temp_project_steps.splice(index, 1);
    this.setState({
      project_steps: temp_project_steps,
    });
  };

  checkIfHundredPercent = () => {
    const { project_steps } = this.state;
    let copy_project_steps = JSON.parse(JSON.stringify(project_steps));

    let percents_arr = copy_project_steps.map((item) => parseFloat(item.percent));
    let sum_of_percents = percents_arr.reduce((a, b) => a + b);

    if (sum_of_percents === 100) {
      this.setState({
        isHundredPercent: true,
      });
      return true;
    } else {
      this.setState({
        isHundredPercent: false,
      });
      return false;
    }
  };

  hideIsHundredPercentValidate = () => {
    this.setState({
      isHundredPercent: true,
    });
  };

  validateProjectSteps = () => {
    const { project_steps } = this.state;

    let copy_project_steps = JSON.parse(JSON.stringify(project_steps));
    let array_step_num = copy_project_steps.length;

    let validate_percent = false;
    let validate_name = false;

    let project_steps_validate_id = copy_project_steps.map((step) => step.process_id);
    if (
      project_steps_validate_id.length === array_step_num &&
      project_steps_validate_id.every((n) => n !== '')
    ) {
      validate_name = true;
    }

    //validate step percent
    let project_steps_validate_percent = copy_project_steps.map((n) => n.percent);
    if (
      project_steps_validate_percent.length === array_step_num &&
      project_steps_validate_percent.every((n) => n.toString().trim() !== '')
    ) {
      validate_percent = true;
    }

    if (validate_name && validate_percent) {
      this.checkIfHundredPercent();
      this.setState({
        is_validate_steps: true,
      });
      return true;
    } else {
      this.setState({
        is_validate_steps: false,
      });
      return false;
    }
  };

  validate_all_form = () => {
    const { form_data, project_steps } = this.state;
    this.setState({
      validate_all_form: true,
    });
  };

  formSubmit = async () => {
    const { mainPopup, get_order_input_popup, updateErrorPopup, orders } = this.props;
    const { form_data, project_steps, order_inputs, city, address } = this.state;

    this.validate_all_form();
    console.log(this.state);

    let validat_steps_for_submit = this.validateProjectSteps();
    if (form_data.cancelled) {
      validat_steps_for_submit = true;
    }

    if (form_data.orders_status === 'מיוחדת') {
      validat_steps_for_submit = true;
    }

    if (validat_steps_for_submit) {
      let collection_stages = project_steps.map((s) => {
        return {
          process_id: s.process_id,
          value: Number(s.amount),
          percent: Number(s.percent),
        };
      });

      let final_form_data = {
        started: form_data.orders_status === 'מיוחדת' ? true : form_data.orders_status,
        type: form_data.orders_status === 'מיוחדת' ? 1 : 0,
        client_name: form_data.client_name,
        client_phone: form_data.client_phone,
        client_email: form_data.client_email,
        employees: [form_data.sales_manager, form_data.project_manager],
        // collection_stages: collection_stages,
        quantity: Number(form_data.quantity),
        value: Number(form_data.transaction_value),
        due_date: moment(form_data.date).format(),
        order_number: form_data.order_number,
        cancelled: form_data.cancelled,
        process_notes: form_data.process_notes ? form_data.process_notes : '',
        city: city,
        address: address,
      };

      if (form_data.orders_status === 'מיוחדת') {
        // final_form_data.collection_stages[0].process_id = this.state.customStepApiData._id
        final_form_data.collection_stages = {
          process_id: this.state.customStepApiData._id,
          name: 'מיוחדת',
          amount: this.addAmountForSpacial(100, form_data.transaction_value),
          percent: 100,
        };
      } else {
        final_form_data.collection_stages = collection_stages;
      }

      console.log(final_form_data);

      if (get_order_input_popup.length > 0) {
        let copy_order_inputs = { ...order_inputs };
        let order_inputs_keys = Object.keys(copy_order_inputs);
        for (let id of order_inputs_keys) {
          final_form_data[id] = copy_order_inputs[id]; // id: value
        }
      }

      if (this.props.login && this.props.login.addOrderPayload) {
        final_form_data.view = this.props.login.addOrderPayload.view;
        final_form_data.from = this.props.login.addOrderPayload.from;
        final_form_data.to = this.props.login.addOrderPayload.to;
        final_form_data.department_id = this.props.login.addOrderPayload.department_id;
      }

      this.ScrollToPercentValidate();
      this.ScrollToRightValidate();

      await setTimeout(async () => {
        let element = document.getElementsByClassName('validate__message');

        console.log(element);

        if (final_form_data.cancelled) {
          element = [];
        }

        if (final_form_data.type === 1) {
          element = [];
        }

        if (element.length === 0) {
          this.setState({
            loading_popup: true,
          });

          if (mainPopup.order_id.length > 0) {
            final_form_data._id = this.props.mainPopup.order_id;

            console.log(final_form_data, 'update');
            let is_update_new_client = await updateClient(final_form_data);

            this.setState({
              loading_popup: false,
            });

            if (is_update_new_client.ok) {
              updateErrorPopup(true, 'הלקוח עודכן בהצלחה!');
              this.updateOrderAfterUpdate(is_update_new_client.result);
              this.props.setOrderIdForPopup('');
              this.props.closePopup();
            } else {
              updateErrorPopup(true, 'הלקוח לא עודכן');

              this.props.setOrderIdForPopup('');
            }
          } else {
            console.log(final_form_data);
            let is_add_new_client = await addClient(final_form_data);
            this.setState({
              loading_popup: false,
            });

            if (is_add_new_client.ok) {
              updateErrorPopup(true, 'הלקוח נוסף בהצלחה!');
              //   result[0]   => replace to    result.order
              let new_order = {
                id: is_add_new_client.result[0].order_id,
                data: is_add_new_client.result[0],
              };
              //   save new result to redux in order to update views with it
              this.props.saveNewOrder(is_add_new_client.result[0].order_id);
              console.log(is_add_new_client.result[0].order_id);

              let last_week_of_the_current_orders = moment(
                orders.weeks_array[orders.weeks_array.length - 1].end_week,
              ).format();
              let new_order_date = moment(is_add_new_client.result[0].due_date).format();
              console.log(new_order_date);
              if (last_week_of_the_current_orders > new_order_date) {
                //adding new order without dates change.
                this.props.addNewOrderTopList(new_order);
              } else {
              }

              this.props.addNewOrderTopList();
              this.props.closePopup();
            } else {
              updateErrorPopup(true, 'הטופס לא נשלח');
            }
          }
        }
      }, 500);
    }
    this.ScrollToPercentValidate();
  };

  updateOrderAfterUpdate = (update_order) => {
    const { mainPopup, get_order_input_popup, updateErrorPopup, orders } = this.props;
    if (update_order.cancelled) {
      //delete
      let copy_orders = JSON.parse(JSON.stringify(orders.orders));
      delete copy_orders[mainPopup.order_id];
      this.props.setOrders(copy_orders);
    } else {
      console.log(update_order);
      let copy_orders_2 = JSON.parse(JSON.stringify(orders.orders));
      copy_orders_2[mainPopup.order_id].client_name = update_order.client_name;
      copy_orders_2[mainPopup.order_id].order_number = update_order.order_number;
      copy_orders_2[mainPopup.order_id].started = update_order.started;
      copy_orders_2[mainPopup.order_id].city = update_order.city;

      copy_orders_2[mainPopup.order_id].processes.forEach(
        (p) => (p.quantity = update_order.quantity),
      );

      this.props.setOrders(copy_orders_2);
    }
  };

  ScrollToPercentValidate = () => {
    setTimeout(function () {
      let element;

      if (document.querySelectorAll('#validate__message__steps').length > 0) {
        element = document.querySelectorAll('#validate__message__steps');
        var first = element[0];
        if (first !== undefined) {
          first.scrollIntoView();
        }
      } else {
        element = document.querySelector('#percent_validate');
        if (element !== null) {
          element.scrollIntoView(false);
        }
      }
    }, 100);
  };

  ScrollToRightValidate = () => {
    setTimeout(function () {
      let element;
      if (document.querySelector('#v1')) {
        element = document.querySelector('#v1');
      } else if (document.querySelector('#v2')) {
        element = document.querySelector('#v2');
      } else if (document.querySelector('#v3')) {
        element = document.querySelector('#v3');
      } else {
        element = document.querySelector('#v4');
      }

      if (element !== null) {
        element.scrollIntoView(false);
      }
    }, 100);
  };

  render() {
    const { date } = this.state.form_data;
    const { form_data, is_loaded } = this.state;
    const {
      project_steps,
      //   project_managers_from_db,
      //   sales_managers_from_db,

      is_validate_project_steps,
      is_disabled_for_transaction_value,
      loading_popup,
      validate_all_form,
      is_validate_steps,
      isHundredPercent,
      popup_title,
      submit_button_text,
      order_inputs,
      address,
      city,
      updatePopUp,
    } = this.state;

    const {
      steps_process_from_db,
      mainPopup,
      get_order_input_popup,
      active,
      project_managers_from_db,
      sales_managers_from_db,
    } = this.props;

    return (
      <div
        className="popup"
        style={active ? { zIndex: '1000', opacity: '1' } : { zIndex: '-1', opacity: '0' }}
      >
        <div className="popup__form">
          <SvgIcon
            component={ClearIcon}
            className="popup__form__cancel-icon"
            onClick={() => {
              this.props.closePopup();
            }}
          />
          {is_loaded ? (
            <div className="popup__inner" style={active ? { left: '0' } : { left: '-474px' }}>
              <RightSide
                city={city}
                address={address}
                popup_title={popup_title}
                changeDisabledForTransactionValue={this.changeDisabledForTransactionValue}
                date={date}
                order_inputs={order_inputs}
                form_data={form_data}
                updateForm={this.updateForm}
                updateFormOrderInputs={this.updateFormOrderInputs}
                sales_managers={sales_managers_from_db}
                project_managers={project_managers_from_db}
                validate_all_form={validate_all_form}
                get_order_input_popup={get_order_input_popup}
              />

              <div className="popup__middle__line"></div>
              <div className="popup__left">
                <LeftSide
                  updatePopUp={updatePopUp}
                  hideProjectStepValidate={this.hideProjectStepValidate}
                  steps_process_from_db={steps_process_from_db}
                  addFavoriteStep={this.addFavoriteStep}
                  changeDisabledForTransactionValue={this.changeDisabledForTransactionValue}
                  is_disabled_for_transaction_value={is_disabled_for_transaction_value}
                  form_data={form_data}
                  validateFormProjectSteps={this.validateFormProjectSteps}
                  deleteProjectStep={this.deleteProjectStep}
                  addNewStep={this.addNewStep}
                  project_steps={project_steps}
                  is_validate_project_steps={is_validate_project_steps}
                  editProjectStep={this.editProjectStep}
                  validate_all_form={validate_all_form}
                  is_validate_steps={is_validate_steps}
                  isHundredPercent={isHundredPercent}
                />

                <div className="input__buttons" style={active ? { left: '0' } : { left: '-474px' }}>
                  <div>
                    <button
                      className="submit__button"
                      onClick={() => {
                        this.formSubmit();
                      }}
                    >
                      {submit_button_text}
                    </button>
                  </div>
                </div>
              </div>
            </div>
          ) : (
            ' '
          )}
        </div>
        {loading_popup ? <Loader /> : null}
      </div>
    );
  }
}

function mapStateToProps({ router, login, orders, mainPopup }) {
  return { router, login, orders, mainPopup };
}
export default connect(mapStateToProps, actions)(Popup);
