import React from 'react';
import { SvgIcon } from '@material-ui/core';
import ArrowDropDownIcon from '@material-ui/icons/ArrowDropDown';

export const ProcessOptionsDropDown = ({
  nameOptions,
  index,
  changeQuantityProcess,
  activeDrop,
  onSetActiveDrop,
  name,
}) => {
  const [selectedOptionNames, setSelectedOptionsName] = React.useState('');

  const onChangeQuantityProcess = (index, i, item) => {
    setSelectedOptionsName(item);
    changeQuantityProcess(index, 'process_id', i);
  };

  return (
    <div className="quantity-process-picker__section1">
      <label>שלב</label>
      <h3 onClick={() => onSetActiveDrop(true)}>
        <span>{selectedOptionNames || name}</span>
        <span>
          <SvgIcon component={ArrowDropDownIcon} />
        </span>
      </h3>
      <ul
        className={
          activeDrop
            ? 'quantity-process-picker__section1__dropdown                        quantity-process-picker__section1__dropdown--active'
            : 'quantity-process-picker__section1__dropdown'
        }
      >
        {nameOptions.length > 0
          ? nameOptions.map((item, i) => (
              <li key={i} onClick={() => onChangeQuantityProcess(index, i, item)}>
                {item}
              </li>
            ))
          : null}
      </ul>
    </div>
  );
};
