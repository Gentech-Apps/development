import React, { Component } from 'react';
import DateSelect from '../DateSelect/DateSelect';
import validator from 'validator';
import DropDownBox from '../DropDownBox/DropDownBox';
import { polyfill } from 'es6-promise';
import { connect } from 'react-redux';
import * as actions from '../../../../../../actions/actions';
import TextInput from './Parts/TextInput/TextInput';
import PhoneInput from './Parts/PhoneInput/PhoneInput';
import MailInput from './Parts/MailInput/MailInput';
import SumInput from './Parts/SumInput/SumInput';
import NumInput from './Parts/NumInput/NumInput';
import '../../../../../../sass/rightSide/rightSide.scss';
import OrderTextInput from './Parts/OrderTextInput/OrderTextInput';

polyfill();

class RightSide extends Component {
  constructor() {
    super();
    this.state = {
      status_input_options: [
        { name: 'הצעה', _id: false },
        { name: 'הזמנה', _id: true },
        { name: 'בוטלה', _id: false },
      ],
      more_inputs: true,
    };
  }

  excludeTimes = () => {
    let exclude_times = this.props.login.user.holidays
      .filter((d) => d.status === 'Day Off')
      .map((d) => new Date(d.date));
    return exclude_times;
  };

  statusDropDownOptions = () => {
    const { status_input_options } = this.state;
    const { form_data } = this.props;
    let status_input_options_copy = JSON.parse(JSON.stringify(status_input_options));
    let filter_status_input_options_copy;

    if (form_data.orders_status) {
      filter_status_input_options_copy = status_input_options_copy.filter(
        (i) => i.name !== 'הזמנה',
      );
    } else {
      filter_status_input_options_copy = status_input_options_copy.filter((i) => i.name !== 'הצעה');
    }

    return filter_status_input_options_copy;
  };

  render() {
    const {
      validate_all_form,
      updateForm,
      sales_managers,
      project_managers,
      date,
      changeDisabledForTransactionValue,
      form_data,
      mainPopup,
      popup_title,
      get_order_input_popup,
      updateFormOrderInputs,
      order_inputs,
      address,
      city,
    } = this.props;

    const { status_input_options, more_inputs } = this.state;
    console.log(form_data);

    return (
      <div className="popup__right">
        <div className="popup__title">{popup_title}</div>
        <div className="popup__right__inputs__container">
          <div className="status__input">
            <DropDownBox
              validate_all_form={validate_all_form}
              title={'סטטוס'}
              data={this.statusDropDownOptions()}
              updateForm={updateForm}
              name={'orders_status'}
              validate_message={'יש לבחור סטטוס'}
              selected_step={form_data.orders_status ? 'הזמנה' : 'הצעה'}
            />
          </div>
          <div className="order__number__input">
            <OrderTextInput
              value={form_data.order_number}
              title={'מספר הזמנה / קריאה'}
              updateForm={updateForm} // (id ,value)
              name={'order_number'}
            />
          </div>
          <div className="form__container">
            <div>
              <TextInput
                value={form_data.client_name}
                validate_all_form={validate_all_form}
                title={'שם לקוח'}
                updateForm={updateForm}
                name={'client_name'}
                validate__message={'אנא הכנס שם לקוח'}
              />
              <PhoneInput
                validate_all_form={validate_all_form}
                title={'נייד'}
                updateForm={updateForm}
                name={'client_phone'}
                validate__message={'אנא הכנס מספר טלפון'}
                value={form_data.client_phone}
              />
              <MailInput
                validate_all_form={validate_all_form}
                title={'מייל'}
                updateForm={updateForm}
                name={'client_email'}
                validate__message={'אנא הכנס אימייל תקין'}
                value={form_data.client_email}
              />
              <NumInput
                validate_all_form={validate_all_form}
                title={'מספר מפתחים'}
                updateForm={updateForm}
                name={'quantity'}
                validate__message={'אנא הכנס מספר מפתחים'}
                value={form_data.quantity}
              />
              <OrderTextInput
                value={address}
                title={'כתובת'}
                updateForm={updateFormOrderInputs} // (id ,value)
                name={'address'}
              />
            </div>
            <div>
              <div className="sales__project__manager__container">
                <DateSelect
                  validate_all_form={validate_all_form}
                  user_data={this.props.login.user}
                  excludeTimes={this.excludeTimes()}
                  value={date}
                  updateForm={updateForm}
                  title={'תאריך אספקה'}
                  name={'date'}
                  validate_message={'יש להכניס תאריך'}
                />

                <DropDownBox
                  validate_all_form={validate_all_form}
                  title={'מנהל פרוייקט'}
                  data={project_managers}
                  updateForm={updateForm}
                  name={'project_manager'}
                  validate_message={'יש לבחור מנהל פרוייקט'}
                  selected_step={form_data.current_sales_project_manager}
                />
                <DropDownBox
                  validate_all_form={validate_all_form}
                  title={'נציג מכירות'}
                  data={sales_managers}
                  updateForm={updateForm}
                  name={'sales_manager'}
                  validate_message={'יש לבחור נציג מכירות'}
                  selected_step={form_data.current_sales_manager_name}
                />
              </div>

              <SumInput
                validate_all_form={validate_all_form}
                title={'ערך עסקה (לא כולל מע"מ)'}
                updateForm={updateForm}
                name={'transaction_value'}
                validate__message={'אנא הכנס ערך עסקה'}
                changeDisabledForTransactionValue={changeDisabledForTransactionValue}
                value={form_data.transaction_value}
              />
              <OrderTextInput
                value={city}
                title={'עיר'}
                updateForm={updateFormOrderInputs} // (id ,value)
                name={'city'}
              />
            </div>
          </div>

          {get_order_input_popup.length > 0 && form_data.orders_status !== 'מיוחדת' ? (
            <div className="order__inputs__popup">
              {get_order_input_popup.map((o, i) => (
                <OrderTextInput
                  key={i}
                  value={order_inputs[o._id] === undefined ? '' : order_inputs[o._id]}
                  title={o.name}
                  updateForm={updateFormOrderInputs} // (id ,value)
                  name={o._id}
                />
              ))}
            </div>
          ) : null}

          {form_data.orders_status === 'מיוחדת' ? (
            <div className="input__order__container special__custom__input">
              <TextInput
                value={form_data.client_name}
                // validate_all_form={validate_all_form}
                title={'הערות'}
                updateForm={updateForm}
                name={'process_notes'}
                size={'big'}
                // validate__message={"אנא הכנס שם לקוח"}
              />
            </div>
          ) : null}
        </div>
      </div>
    );
  }
}

function mapStateToProps({ router, login, mainPopup }) {
  return { router, login, mainPopup };
}
export default connect(mapStateToProps, actions)(RightSide);
