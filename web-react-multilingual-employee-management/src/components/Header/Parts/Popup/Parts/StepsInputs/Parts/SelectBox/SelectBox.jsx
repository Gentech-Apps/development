import React, { Component } from 'react';
import { makeStyles } from '@material-ui/core/styles';
import TextField from '@material-ui/core/TextField';
import MenuItem from '@material-ui/core/MenuItem';
import '../../../../../../../../sass/selectedBox/selectedBox.scss';
import Select from '@material-ui/core/Select';
import { thisExpression } from '@babel/types';
import { polyfill } from 'es6-promise';
polyfill();

class SelectBox extends Component {
  constructor(props) {
    super(props);
    this.state = {
      selected_step: '',
      selected: true,
    };
  }

  toggle = () => {
    const { selected } = this.state;
    // this.props.hideValidateMessage()
    this.props.clickAndScroll();
    this.setState({
      selected: !selected,
    });
  };

  closeSelectedBox = () => {
    this.setState({
      selected: true,
    });
  };

  selectStep = (step) => {
    const { updateStepNameAndId, validateFormProjectSteps, id } = this.props;

    // update the step in the steps array
    updateStepNameAndId(step, id);

    //for validation
    validateFormProjectSteps();

    this.toggle();
    this.setState({
      selected_step: step.name,
    });
  };

  setWrapperRef = (node) => {
    this.wrapperRef = node;
  };
  componentDidMount() {
    document.addEventListener('mousedown', this.handleClickOutside);
  }
  componentWillUnmount() {
    document.removeEventListener('mousedown', this.handleClickOutside);
  }

  handleClickOutside = (event) => {
    if (this.wrapperRef && !this.wrapperRef.contains(event.target)) {
      this.closeSelectedBox();
    }
  };

  render() {
    const { is_disabled, options, step, hideValidateMessage } = this.props;
    const { selected, selected_step } = this.state;

    return (
      <div ref={this.setWrapperRef}>
        <section
          className="selected__box"
          style={step.name === 'מיוחדת' ? { pointerEvents: 'none' } : {}}
        >
          <header onClick={this.toggle} className="header__select">
            {selected_step ? selected_step : step.name}
            {''}
            <span className="select__box__icon">
              {selected ? <i className="fas fa-sort-down"></i> : <i className="fas fa-sort-up"></i>}
            </span>
          </header>

          <ul
            id={selected ? 'selected__box--off' : 'selected__box--active'}
            className="selectbox__list"
          >
            {options.map((step, index) => {
              return (
                <li className="selectbox__option" onClick={() => this.selectStep(step)} key={index}>
                  <span>{step.name}</span>
                </li>
              );
            })}
          </ul>
        </section>
      </div>
    );
  }
}

export default SelectBox;
