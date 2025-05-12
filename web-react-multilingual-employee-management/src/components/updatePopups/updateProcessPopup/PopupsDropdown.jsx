import React, { Component } from 'react';
//img
import Arrow from '../../../images/updatepopup/arrow.svg';

class PopupsDropdown extends Component {
  constructor() {
    super();

    this.state = {
      active: false,
    };
  }

  toggleMenu = () => {
    this.setState((prevState) => ({
      active: !prevState.active,
    }));
  };

  componentDidMount() {
    document.addEventListener('mousedown', this.handleClickOutside);
  }

  componentWillUnmount() {
    document.removeEventListener('mousedown', this.handleClickOutside);
  }

  setWrapperRef = (node) => {
    this.wrapperRef = node;
  };

  handleClickOutside = (event) => {
    if (this.wrapperRef && !this.wrapperRef.contains(event.target)) {
      this.setState({ active: false });
    }
  };

  render() {
    const { active } = this.state;
    const { options, value, placeholder, customStyles, name, handleChange } = this.props;
    return (
      <div
        style={customStyles ? customStyles : {}}
        className={active ? 'update-popup-drop update-popup-drop--active' : 'update-popup-drop'}
        ref={this.setWrapperRef}
        onClick={() => {
          this.toggleMenu();
        }}
      >
        <span>
          {value ? <p>{value}</p> : <p>{placeholder}</p>}
          <img src={Arrow} alt="dropdown" />
        </span>
        <ul>
          {options.map((item, index) => {
            return (
              <li
                key={index}
                onClick={() => {
                  handleChange(name, item);
                }}
              >
                {item.name}
              </li>
            );
          })}
        </ul>
      </div>
    );
  }
}

export default PopupsDropdown;
