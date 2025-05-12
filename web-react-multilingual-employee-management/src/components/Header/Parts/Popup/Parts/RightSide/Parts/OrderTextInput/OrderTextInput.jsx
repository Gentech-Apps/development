import React, { Component } from 'react';
import '../../../../../../../../sass/orderTextInput/orderTextInput.scss';
import { connect } from 'react-redux';
class OrderTextInput extends Component {
  constructor(props) {
    super(props);
    this.state = {
      value: props.value,
    };
  }

  updateForm = () => {
    let { value } = this.state;
    let { name } = this.props;
    this.props.updateForm(name, value);
  };

  handleInputChange = (e) => {
    let value = e.target.value;
    this.setState({
      value: value,
    });
  };

  render() {
    const { is_validate, value } = this.state;
    const { title, name, validate__message } = this.props;

    return (
      <div className="input__order__container">
        <div className="input__order__title">{title}</div>
        <input
          value={value}
          type="text"
          name={name}
          onBlur={() => {
            this.updateForm();
          }}
          onChange={(e) => this.handleInputChange(e)}
        ></input>
      </div>
    );
  }
}

export default OrderTextInput;
