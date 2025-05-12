import React, { Component } from 'react';
import validator from 'validator';

class SumInput extends Component {
  constructor(props) {
    super(props);
    this.state = {
      value: props.value,
      name: '',
      is_validate: true,
    };
  }

  componentWillReceiveProps(nextProps) {
    let { validate_all_form } = this.props;
    if (nextProps.validate_all_form !== validate_all_form) {
      this.validateForm();
    }
  }

  validateForm = () => {
    let { value } = this.state;
    let { name, changeDisabledForTransactionValue } = this.props;

    if (validator.isNumeric(value.toString().trim())) {
      // this.props.updateForm(name, value.toString().trim());
      changeDisabledForTransactionValue(false);
    } else {
      this.setState({
        is_validate: false,
      });
    }
  };

  handleInputChange = (e) => {
    let value = e.target.value;
    let { name } = this.props;
    this.props.updateForm(name, value);
    this.setState({
      value: value,
    });

    // this.props.validateFormBeforeSubmit(name);
  };

  hideValidateMessage = () => {
    this.setState({
      is_validate: true,
    });
  };

  formatNumber = (num) => {
    return num.toString().replace(/(\d)(?=(\d{3})+(?!\d))/g, '$1,');
  };

  render() {
    const { is_validate, value } = this.state;
    const { title, name, validate__message } = this.props;
    return (
      <div className="input__container">
        <div>{title}</div>
        <input
          value={value}
          type="text"
          name={name} // this.props.name
          onFocus={this.hideValidateMessage}
          onBlur={() => {
            this.validateForm();
          }}
          onChange={(e) => this.handleInputChange(e)}
        ></input>
        {is_validate ? (
          ''
        ) : (
          <div id="v4" className="validate__message">
            {validate__message}
          </div>
        )}
      </div>
    );
  }
}

export default SumInput;
