import React, { Component } from 'react';
//icons
import { SvgIcon } from '@material-ui/core';
import DeleteOutlineIcon from '@material-ui/icons/DeleteOutline';
import DoneIcon from '@material-ui/icons/Done';
import CloseIcon from '@material-ui/icons/Close';
import * as CurrencyFormat from 'react-currency-format';
import { ProcessOptionsDropDown } from './ProcessOptionsDropDown';
import { excludeComasFromString } from '../../../../../utils/reservation-pop-up';

class QuantityProcessPicker extends Component {
  constructor() {
    super();

    this.state = {
      deleteMode: false,
      selectedOptionName: [],
    };
  }

  setWrapperRef = (node) => {
    this.wrapperRef = node;
  };

  componentDidMount() {
    document.addEventListener('mousedown', this.handleClickOutside);
  }

  componentWillUnmount() {
    document.removeEventListener('mousedown', this.handleClickOutside);
  }

  componentWillReceiveProps(nextProps) {
    if (nextProps.resetDeleteMode !== this.props.resetDeleteMode)
      this.setState({ deleteMode: false });
  }

  handleClickOutside = (event) => {
    if (this.wrapperRef && !this.wrapperRef.contains(event.target)) {
      this.setState({ activeDrop: false });
    }
  };

  changeQuantityProcess = (index, name, value) => {
    // format value (exclude ,  and . separators)
    const formattedValue = excludeComasFromString(value);
    this.setState({ activeDrop: false });
    this.props.changeQuantityProcess(index, name, Number(formattedValue));
  };

  saveTempData = (name, value) => {
    this.setState({
      [name]: value,
    });
  };

  deleteTempData = (name) => {
    this.setState({
      [name]: null,
    });
  };

  setActiveDrop = (value) => {
    this.setState({ activeDrop: value });
  };

  render() {
    const {
      name,
      percentage,
      nameOptions,
      value,
      index,
      disabled,
      daysToTheEndOfStage,
    } = this.props;
    const { activeDrop, deleteMode } = this.state;

    return (
      <div
        className="quantity-process-picker"
        ref={this.setWrapperRef}
        style={disabled ? { pointerEvents: 'none' } : {}}
      >
        {deleteMode ? (
          <section className="quantity-process-picker__delete-section">
            <SvgIcon
              component={DoneIcon}
              onClick={() => {
                this.props.deleteQuantityProcess(index);
              }}
            />
            <SvgIcon
              component={CloseIcon}
              onClick={() => {
                this.setState({ deleteMode: false });
              }}
            />
            <h1>האם אתם בטוחים שברצונכם למחוק?</h1>
          </section>
        ) : (
          <section>
            <ProcessOptionsDropDown
              nameOptions={nameOptions}
              index={index}
              name={name}
              activeDrop={activeDrop}
              changeQuantityProcess={this.changeQuantityProcess}
              onSetActiveDrop={this.setActiveDrop}
            />
            <div className="quantity-process-picker__section2">
              <label>אחוז</label>
              <input
                name={'percentage'}
                type="text"
                value={Math.floor(percentage) || ''}
                onChange={(e) => {
                  this.changeQuantityProcess(index, 'percentage', e.target.value);
                }}
              />
            </div>
            <div className="quantity-process-picker__section3">
              <label>סכום</label>
              <CurrencyFormat
                decimalScale={2}
                value={Number(value) || ''}
                displayType={'text'}
                thousandSeparator={true}
                decimalSeparator={'.'}
                renderText={(value) => (
                  <input
                    name={'value'}
                    type="text"
                    value={value || ''}
                    onChange={(e) => {
                      this.changeQuantityProcess(index, 'value', e.target.value);
                    }}
                  />
                )}
              />
            </div>
            <div className="quantity-process-picker__section5">
              <label>{'תזכורת (ימים)'}</label>
              <input
                name={'days'}
                type="text"
                value={daysToTheEndOfStage}
                onChange={(e) => {
                  this.changeQuantityProcess(index, 'days', e.target.value);
                }}
              />
            </div>
            <div
              className="quantity-process-picker__section4"
              onClick={() => {
                this.setState({ deleteMode: true });
              }}
            >
              <SvgIcon component={DeleteOutlineIcon} />
            </div>
          </section>
        )}
      </div>
    );
  }
}

export default QuantityProcessPicker;
