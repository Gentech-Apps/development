import React, { Component } from 'react';
import { SvgIcon } from '@material-ui/core';
import ArrowDropDownIcon from '@material-ui/icons/ArrowDropDown';
import DeleteOutlineIcon from '@material-ui/icons/DeleteOutline';
import './systemEditPicker.css';
import { deleteActualSystem } from '../../../../../functions/api/systems';
import DeleteConfirmationPopUp from '../../../../reused-components/DeleteConfirmationPopUp';

class SystemEditPicker extends Component {
  constructor() {
    super();

    this.state = {
      deleteMode: false,
      isDeleteConfirmationShown: false,
    };
  }

  openDrop = () => {
    this.setState({ activeDrop: true });
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

  componentWillReceiveProps(nextProps) {
    if (nextProps.resetDeleteMode !== this.props.resetDeleteMode)
      this.setState({ deleteMode: false });
  }

  handleClickOutside = (event) => {
    if (this.wrapperRef && !this.wrapperRef.contains(event.target)) {
      this.setState({ activeDrop: false });
    }
  };

  changeSystemName = (
    idx,
    name,
    value,
    system_id,
    _id,
    actual_system_id,
    act_syst_id,
    name_for_description,
    description_for_pop_up,
  ) => {
    this.setState({ activeDrop: false });
    this.props.changeSystemInstance(idx, name, value);
    this.props.changeSystemInstance(idx, system_id, _id);
    this.props.changeSystemInstance(idx, actual_system_id, act_syst_id);
    this.props.changeSystemInstance(idx, name_for_description, description_for_pop_up);
  };

  deleteSystem = async (_id, customer_id, order_id, idx) => {
    await deleteActualSystem(_id, customer_id, order_id);
    this.props.deleteSystemInstance(idx);
  };

  render() {
    const {
      index,
      systemTypes,
      disabled,
      quantity,
      systemType,
      systemActualName,
      system_note,
      system,
      customer_id,
      order_id,
    } = this.props;
    const { _id } = system;
    const { activeDrop, isDeleteConfirmationShown } = this.state;

    return (
      <div
        className="system-edit-picker"
        ref={this.setWrapperRef}
        style={disabled ? { pointerEvents: 'none' } : {}}
      >
        <section>
          <div className="system-edit-picker__section1">
            <label>שם מערכת</label>
            <h3
              onClick={() => {
                this.openDrop();
              }}
            >
              <span>
                {systemType} - {systemActualName}
              </span>
              <span>
                <SvgIcon component={ArrowDropDownIcon} />
              </span>
            </h3>
            <ul
              className={
                activeDrop
                  ? 'system-edit-picker__section1__dropdown system-edit-picker__section1__dropdown--active'
                  : 'system-edit-picker__section1__dropdown'
              }
            >
              {systemTypes && systemTypes.length > 0
                ? systemTypes.map((item, indexOption) => (
                    <li
                      key={indexOption}
                      onClick={() => {
                        this.changeSystemName(
                          index,
                          'system_name',
                          item.description,
                          'system_id',
                          item.system_id,
                          'actual_system_id',
                          item._id,
                          'description_for_pop_up',
                          item.description_for_pop_up,
                        );
                      }}
                    >
                      {item.description}
                    </li>
                  ))
                : null}
            </ul>
          </div>
          <div
            className="system-edit-picker__section4"
            onClick={() => {
              this.setState({ deleteMode: true });
            }}
          >
            <SvgIcon
              component={DeleteOutlineIcon}
              onClick={() => this.setState({ isDeleteConfirmationShown: true })}
            />
          </div>
          <DeleteConfirmationPopUp
            okCallback={() => this.deleteSystem(_id, customer_id, order_id, index)}
            cancelCallback={() => this.setState({ isDeleteConfirmationShown: false })}
            isOpen={isDeleteConfirmationShown}
          />
        </section>
      </div>
    );
  }
}

export default SystemEditPicker;
