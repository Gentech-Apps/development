import React, { Component } from 'react';
import '../../../sass/abstracts/general_app_components.scss';
import validator from 'validator';

class InputGeneral extends Component {
  constructor(props) {
    super(props);

    this.state = {
      hasError: false,
    };
  }

  componentWillReceiveProps(nextProps) {
    if (this.props.initValidation !== nextProps.initValidation && nextProps.initValidation) {
      this.validate();
    }
  }

  handleChange = (e) => {
    let value = e.target.value;
    const { name, typeOfInput } = this.props;

    if (typeOfInput && typeOfInput === 'number') {
      value = value.replace(/\D+/g, '');
    }

    if (this.props.idForObj) value = { [this.props.idForObj]: value };

    this.props.updateFormData(name, value);
  };

  validate = () => {
    const { typeOfInput } = this.props;
    // check for required and empty validation
    if (this.props.required && (!this.props.value || this.props.value == null)) {
      this.setState({ hasError: 'empty' });
      this.props.setError(this.props.name);
      return;
    }

    if (typeOfInput === 'phone' && this.props.value) {
      if (this.props.value.length < 7 || this.props.value.length > 11) {
        this.setState({ hasError: 'invalid' });
        this.props.setError(this.props.name);
      } else {
        this.props.clearError(this.props.name);
        this.setState({ hasError: null });
      }
      return;
    }

    if (typeOfInput === 'email' && this.props.value) {
      if (!validator.isEmail(this.props.value)) {
        this.setState({ hasError: 'invalid' });
        this.props.setError(this.props.name);
      } else {
        this.props.clearError(this.props.name);
        this.setState({ hasError: null });
      }
      return;
    }

    if (this.props.value) {
      this.setState({ hasError: false });
      this.props.clearError(this.props.name);
    }
  };

  render() {
    const { typeOfInput, value, errorMessageEmpty, errorMessageInvalid, disabled } = this.props;
    const { hasError } = this.state;
    return (
      <div
        className={typeOfInput === 'textarea' ? 'general-textarea' : 'general-input'}
        style={hasError ? { border: '1px solid #ff0000' } : {}}
      >
        {typeOfInput === 'textarea' ? (
          <textarea
            value={value}
            type={typeOfInput ? typeOfInput : 'text'}
            onChange={(e) => {
              this.handleChange(e);
            }}
            onBlur={() => {
              this.validate();
            }}
            disabled={disabled}
          ></textarea>
        ) : (
          <input
            disabled={disabled}
            value={value ? value : ''}
            type={typeOfInput ? typeOfInput : 'text'}
            onChange={(e) => {
              this.handleChange(e);
            }}
            onBlur={() => {
              this.validate();
            }}
          />
        )}
        {hasError && hasError === 'empty' ? (
          <p className="general-dropdown--error">{errorMessageEmpty ? errorMessageEmpty : ''}</p>
        ) : hasError && hasError === 'invalid' ? (
          <p className="general-dropdown--error">
            {errorMessageInvalid ? errorMessageInvalid : ''}
          </p>
        ) : null}
      </div>
    );
  }
}

export default InputGeneral;
