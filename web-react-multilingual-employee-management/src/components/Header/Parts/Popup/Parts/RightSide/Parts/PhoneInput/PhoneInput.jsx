import React, { Component } from 'react';
import validator from 'validator';

class PhoneInput extends Component {
  constructor(props) {
    super(props);
    this.state = {
      value: props.value,
      name: '',
      is_validate: true,
    };
  }

  // componentWillReceiveProps(nextProps) {
  //   let { validate_all_form } = this.props;
  //   if (nextProps.validate_all_form !== validate_all_form) {
  //     this.validateForm()
  //   }
  // }

  validateForm = () => {
    let { value } = this.state;
    let { name } = this.props;

    if (validator.isNumeric(value.trim())) {
      this.props.updateForm(name, value.trim());
    } else if (value.trim() == '') {
      return;
    } else {
      this.setState({
        is_validate: false,
      });
    }
  };

  handleInputChange = (e) => {
    let value = e.target.value;
    let { name } = this.props;
    this.setState({
      value: value,
    });

    // this.props.validateFormBeforeSubmit(name);
  };

  hideValidateMessage = (e) => {
    this.setState({
      is_validate: true,
    });
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
          onFocus={(e) => this.hideValidateMessage(e)}
          onBlur={() => {
            this.validateForm();
          }}
          onChange={(e) => this.handleInputChange(e)}
        ></input>
        {is_validate ? '' : <div className="validate__message">{validate__message}</div>}
      </div>
    );
  }
}

export default PhoneInput;
