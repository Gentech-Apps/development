// props
// options - array - options to dropdown
// dynamicValueForMapping - string - determine what value in options object to display to the UI

import React, { Component } from 'react';
import '../../../sass/abstracts/general_app_components.scss';
//icons
import { SvgIcon } from '@material-ui/core';
import ArrowDropDownIcon from '@material-ui/icons/ArrowDropDown';

class GeneralDropdown extends Component {
  constructor(props) {
    super(props);

    this.state = {
      active: false,
      hasError: false,
      sortingString: '',
      activeValue: props.value ? props.value : '',
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
    //update Value
    if (this.props.value !== nextProps.value) this.setState({ activeValue: nextProps.value });
    //validation
    if (this.props.required)
      if (this.props.initValidation !== nextProps.initValidation && nextProps.initValidation) {
        if (!this.state.activeValue) {
          this.setState({ hasError: true });
          this.props.setError(this.props.stateName);
        }
      }
  }

  componentDidUpdate(prevProps, prevState) {
    if (this.props.sortingInput)
      if (prevState.active !== this.state.active && !this.state.active)
        this.checkValidInput(this.state.sortingString);
  }

  handleClickOutside = (event) => {
    if (this.wrapperRef && !this.wrapperRef.contains(event.target)) {
      this.setState({ active: false });
    }
  };

  toggleDropdown = () => {
    if (!this.props.disabled)
      this.setState((prevState) => ({
        ...prevState,
        active: !prevState.active,
      }));
  };

  setValue = (item) => {
    const { dynamicValueForMapping, stateName } = this.props;
    this.setState(
      {
        activeValue: item[dynamicValueForMapping],
        active: false,
        hasError: false,
      },
      () => {
        if (this.props.clearError) this.props.clearError(stateName);
        if (this.props.updateFormData) this.props.updateFormData(stateName, item);
        if (this.props.customPickCallback) this.props.customPickCallback();
      },
    );
  };

  setSortingValue = (e) => {
    this.setState({ sortingString: e.target.value, activeValue: e.target.value });
  };

  checkValidInput = (valueToCheck) => {
    if (!valueToCheck) return;
    let optionsSort = JSON.parse(JSON.stringify(this.props.options));
    let valid = optionsSort.filter((city) => city.name === valueToCheck).length > 0;
    if (valid === false) {
      this.props.updateFormData(this.props.stateName, '');
      this.setState({ activeValue: '' });
      setTimeout(() => {
        this.setState({ sortingString: '' });
      }, 200);
    }
  };

  render() {
    const {
      options,
      dynamicValueForMapping,
      errorMessage,
      sortingInput,
      disabled,
      placeholder,
    } = this.props;
    const { active, activeValue, hasError, sortingString } = this.state;

    let optionsSort = JSON.parse(JSON.stringify(options));

    if (sortingInput && sortingString.length > 0) {
      optionsSort = optionsSort.filter((city) => city.name.includes(sortingString));
    } else {
      optionsSort = JSON.parse(JSON.stringify(options));
    }

    return (
      <div
        className={active ? 'general-dropdown general-dropdown--active' : 'general-dropdown'}
        ref={this.setWrapperRef}
        style={hasError ? { border: '1px solid #ff0000' } : {}}
      >
        <h3
          onClick={() => {
            this.toggleDropdown();
          }}
        >
          {sortingInput ? (
            <input
              type="text"
              onChange={(e) => {
                this.setSortingValue(e);
              }}
              value={activeValue ? activeValue : ''}
              disabled={disabled}
            />
          ) : (
            <span>{activeValue ? activeValue : placeholder ? placeholder : ''}</span>
          )}
          {sortingInput ? <span></span> : null}
          {disabled ? <SvgIcon /> : <SvgIcon component={ArrowDropDownIcon} />}
        </h3>

        {optionsSort && optionsSort.length > 0 ? (
          <ul>
            {optionsSort && optionsSort.length > 0
              ? optionsSort.map((item, i) => {
                  return (
                    <li
                      key={item._id ? item._id : i}
                      style={{
                        fontWeight: activeValue === item[dynamicValueForMapping] ? 'bold' : '',
                      }}
                      onClick={() => {
                        this.setValue(item);
                      }}
                    >
                      {item[dynamicValueForMapping]}
                    </li>
                  );
                })
              : null}
          </ul>
        ) : (
          <ul>
            <p style={{ textAlign: 'center' }}>לא נמצאו תוצאות</p>
          </ul>
        )}

        {hasError ? (
          <p className="general-dropdown--error">{errorMessage ? errorMessage : ''}</p>
        ) : null}
      </div>
    );
  }
}

export default GeneralDropdown;
