import React, { Component } from 'react';
import '../../../../../../../../sass/deleteStep/deleteStep.scss';
import { polyfill } from 'es6-promise';
polyfill();
class DeleteStep extends Component {
  render() {
    const { deleteStep, confirmDeleteStep } = this.props;
    return (
      <div className="delete__container">
        <div className="step__input__icons">
          <i className="fas fa-check" onClick={deleteStep}></i>
          <i className="fas fa-times" onClick={confirmDeleteStep}></i>
          <div className="delete__text">האם אתם בטוחים שברצונכם למחוק?</div>
        </div>
      </div>
    );
  }
}

export default DeleteStep;
