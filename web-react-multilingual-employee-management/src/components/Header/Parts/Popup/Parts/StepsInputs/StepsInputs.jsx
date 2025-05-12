import React, { Component } from 'react';
import SelectBox from './Parts/SelectBox/SelectBox';
import AmountSelect from './Parts/AmountSelect/AmountSelect';
import PrecentSelect from './Parts/PercentSelect/PercentSelect';
import uniqid from 'uniqid';
import '../../../../../../sass/stepsInputs/stepsInputs.scss';
import DeleteStep from '../LeftSide/Parts/DeleteStep/DeleteStep';
import { connect } from 'react-redux';
import * as actions from '../../../../../../actions/actions';
import validator from 'validator';
import { polyfill } from 'es6-promise';
import trash_icon from '../../../../../../images/addOrderPopup/trash.svg';

polyfill();

class StepsInputs extends Component {
  constructor(props) {
    super(props);
    this.state = {
      step_obj: {
        id: props.step.id,
        is_approved: false,
        amount: '',
        name: props.step.name,
        process_id: props.step.process_id,
        percent: props.step.percent,
      },
      is_disabled: false,
      confirm_delete_step: false,
      favorite_steps_process_from_db: [],
      is_validate: true,
      validate_text: '',
      selected_precent: props.step.percent,
      amount_after_calc: '',
      is_validate_step: true,
    };
  }

  componentDidMount() {
    const { updatePopUp } = this.props;
    if (updatePopUp) {
      this.setState({
        is_disabled: true,
      });
    }
  }

  componentWillReceiveProps(nextProps) {
    let { is_validate_steps } = this.props;
    if (nextProps.is_validate_steps !== is_validate_steps) {
      this.validateStep();
    }
  }

  projectStepsFilter = () => {
    const { project_steps } = this.props;
    const { steps_process_from_db } = this.props;
    let copy_project_steps = JSON.parse(JSON.stringify(project_steps));
    let step_names_arr = copy_project_steps.map((step) => step.name);

    let diffrance = steps_process_from_db.filter((step) => !step_names_arr.includes(step.name));

    return diffrance;
  };

  updateStepNameAndId = (step, id) => {
    const { editProjectStep } = this.props;
    const { step_obj, is_validate_step } = this.state;
    let copy_step_obj = JSON.parse(JSON.stringify(step_obj));

    copy_step_obj.name = step.name;

    this.setState({
      step_obj: copy_step_obj,
    });

    editProjectStep('name', step.name, id, id);
    editProjectStep('process_id', step._id, id);
  };

  updateStepObj = (name, value) => {
    const { step_obj } = this.state;

    const { form_data, id, editProjectStep } = this.props;

    let copy_step_obj = JSON.parse(JSON.stringify(step_obj));
    copy_step_obj[name] = value;

    if (name === 'percent') {
      if (!validator.isNumeric(value.trim())) {
        this.setState({
          is_validate: false,
          validate_text: 'אנא נקוב אחוז כמספר',
        });

        return;
      } else {
        editProjectStep(name, value, id);

        this.setState({
          selected_precent: value,
          step_obj: copy_step_obj,
          is_validate_step: true,
          is_validate: true,
        });

        return;
      }
    }
  };

  confirmDeleteStep = () => {
    const { confirm_delete_step } = this.state;
    this.setState({
      confirm_delete_step: !confirm_delete_step,
    });
  };

  deleteStep = () => {
    const { deleteProjectStep, id } = this.props;
    deleteProjectStep(id);
    this.setState({
      is_disabled: false,
      confirm_delete_step: false,
    });
  };

  editStep = () => {
    const { step_obj } = this.state;

    let temp_step_obj = { ...step_obj };
    temp_step_obj.is_approved = false;

    this.setState({
      is_disabled: false,
      step_obj: temp_step_obj,
    });
  };

  hideValidateMessage = () => {
    let { validateFormProjectSteps } = this.props;
    this.setState({
      is_validate: true,
    });
  };

  showValidateMessage = () => {
    this.setState({
      is_validate: false,
    });
  };

  validateMessage = () => {
    const { form_data, is_disabled_for_transaction_value, step } = this.props;
    const { is_validate } = this.state;
    console.log(is_validate);
    if (is_disabled_for_transaction_value) {
      return 'אנא הכנס ערך עסקה';
    } else if (!is_validate) {
      return 'אנא נקוב אחוז כמספר';
    } else {
      return 'אנא מלא את כל השדות';
    }
  };

  validateStep = () => {
    const { step_obj } = this.state;

    if (step_obj.name === '' || step_obj.percent.toString().trim() === '') {
      this.setState({
        is_validate_step: false,
      });
    } else {
      this.setState({
        is_validate_step: true,
      });
    }
  };

  clickAndScroll = () => {
    setTimeout(function () {
      let element = document.querySelector('#selected__box--active');
      let scroll_element = document.querySelector('.project__steps__container');

      if (element !== null) {
        let element_top = element.getBoundingClientRect();
        if (element_top.top > 271) {
          scroll_element.scrollTop += 150;
        }
      }
    }, 200);
  };

  render() {
    const {
      is_disabled,
      step_obj,
      confirm_delete_step,
      updateStepNameAndId,
      is_validate,
      validate_text,
      selected_precent,
      is_validate_step,
    } = this.state;

    const {
      id,
      step,
      validateFormProjectSteps,
      form_data,
      changeDisabledForTransactionValue,
      is_disabled_for_transaction_value,
    } = this.props;

    return (
      <div id={id} className="main__step__container">
        {confirm_delete_step ? (
          <DeleteStep
            id={id}
            deleteStep={this.deleteStep}
            confirmDeleteStep={this.confirmDeleteStep}
          />
        ) : (
          <div className="step__inputs__container">
            <span>
              <p>שלב</p>
              <p>אחוז</p>
              <p>סכום</p>
            </span>
            <div className={is_disabled ? 'step__select__input__disabled' : 'step__select__input'}>
              <SelectBox
                id={id}
                clickAndScroll={this.clickAndScroll}
                hideValidateMessage={this.hideValidateMessage}
                validateFormProjectSteps={validateFormProjectSteps}
                updateStepNameAndId={this.updateStepNameAndId}
                is_disabled={is_disabled}
                step={step}
                options={this.projectStepsFilter()}
              />
            </div>

            <div className="precent__input">
              <PrecentSelect
                id={id}
                changeDisabledForTransactionValue={changeDisabledForTransactionValue}
                is_disabled_for_transaction_value={is_disabled_for_transaction_value}
                showValidateMessage={this.showValidateMessage}
                form_data={form_data}
                hideValidateMessage={this.hideValidateMessage}
                validateFormProjectSteps={validateFormProjectSteps}
                updateStepObj={this.updateStepObj}
                is_disabled={is_disabled}
                step={step}
              />
            </div>
            <div className="amount__input">
              <AmountSelect
                id={id}
                selected_precent={selected_precent}
                changeDisabledForTransactionValue={changeDisabledForTransactionValue}
                is_disabled_for_transaction_value={is_disabled_for_transaction_value}
                form_data={form_data}
                hideValidateMessage={this.hideValidateMessage}
                validateFormProjectSteps={validateFormProjectSteps}
                updateStepObj={this.updateStepObj}
                is_disabled={is_disabled}
                step={step}
              />
            </div>
            <div className="step__input__icons" onClick={this.confirmDeleteStep}>
              <div className="trash">
                <img className="trash__icon" src={trash_icon} alt="trash icon"></img>
              </div>
            </div>
          </div>
        )}
        {is_validate && is_validate_step ? (
          ''
        ) : (
          <div className="validate__message" id="validate__message__steps">
            {this.validateMessage()}
          </div>
        )}
      </div>
    );
  }
}

function mapStateToProps({ router, login }) {
  return { router, login };
}
export default connect(mapStateToProps)(StepsInputs);
