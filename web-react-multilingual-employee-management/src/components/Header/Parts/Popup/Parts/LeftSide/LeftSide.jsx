import React, { Component } from 'react';
import StepsInputs from '../StepsInputs/StepsInputs';
import '../../../../../../sass/leftSide/leftSide.scss';
import { polyfill } from 'es6-promise';
polyfill();
class LeftSide extends Component {
  render() {
    const {
      deleteProjectStep,
      addNewStep,
      project_steps,
      project_managers,
      sales_managers,
      is_validate_project_steps,
      validateFormProjectSteps,
      is_disabled_for_transaction_value,
      changeDisabledForTransactionValue,
      editProjectStep,
      form_data,
      is_validate_steps,
      isHundredPercent,
      addFavoriteStep,
      steps_process_from_db,
      hideProjectStepValidate,
      updatePopUp,
    } = this.props;

    return (
      <div id="steps__container">
        <h1 className="project__steps__header">חלוקת שלבי תשלום</h1>
        {/* <div className="popup__left__titles">
          <div className="step__title">שלב</div>
          <div className="precent__title">אחוזים</div>
          <div className="amount__title"> סכום</div>
        </div> */}
        <div className="project__steps__container">
          {project_steps.map((s) => (
            <StepsInputs
              updatePopUp={updatePopUp}
              steps_process_from_db={steps_process_from_db}
              addFavoriteStep={addFavoriteStep}
              project_steps={project_steps}
              is_validate_steps={is_validate_steps}
              editProjectStep={editProjectStep}
              hideProjectStepValidate={hideProjectStepValidate}
              changeDisabledForTransactionValue={changeDisabledForTransactionValue}
              is_disabled_for_transaction_value={is_disabled_for_transaction_value}
              form_data={form_data}
              validateFormProjectSteps={validateFormProjectSteps}
              key={s.id}
              id={s.id}
              step={s}
              deleteProjectStep={deleteProjectStep}
              project_managers={project_managers}
              sales_managers={sales_managers}
              is_validate_project_steps={is_validate_project_steps}
            />
          ))}
          {!isHundredPercent ? (
            <div id="percent_validate" className="validate__message">
              {'יש להשלים את סך האחוזים ל100%'}
            </div>
          ) : (
            ''
          )}
          {this.props.form_data.orders_status !== 'מיוחדת' ? (
            <div
              className="add__step"
              onClick={() => {
                addNewStep();
              }}
            >
              {' '}
              + הוסף שלב
            </div>
          ) : null}
        </div>
      </div>
    );
  }
}

export default LeftSide;
