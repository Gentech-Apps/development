import React, { Component } from 'react';

class TextInput extends Component {
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
    let { name } = this.props;
    if (value.trim() !== '') {
      this.props.updateForm(name, value);
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

  hideValidateMessage = () => {
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
        {this.props.size === 'big' ? (
          <textarea
            value={value}
            type="text"
            name={name} // this.props.name
            onFocus={() => {
              this.hideValidateMessage();
            }}
            onBlur={() => {
              this.validateForm();
            }}
            onChange={(e) => this.handleInputChange(e)}
            className="input__container__textarea"
          ></textarea>
        ) : (
          <input
            value={value}
            type="text"
            name={name} // this.props.name
            onFocus={() => {
              this.hideValidateMessage();
            }}
            onBlur={() => {
              this.validateForm();
            }}
            onChange={(e) => this.handleInputChange(e)}
          ></input>
        )}
        {is_validate ? (
          ''
        ) : (
          <div id="v1" className="validate__message">
            {validate__message}
          </div>
        )}
      </div>
    );
  }
}

export default TextInput;
