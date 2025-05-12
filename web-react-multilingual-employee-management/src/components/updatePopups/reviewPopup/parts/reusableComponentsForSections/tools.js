import React from 'react';
import InputSelectMobile from './components/Select';
import InputTextMobile from './components/Text';
import InputNumberMobile from './components/Number';
import InputPhotoMobile from './components/Photo';
import CheckboxMobile from './components/CheckboxMobile';
import { checkListSection, generalSection } from '../../../../../constants/responsive-pop-up';
import { LABELS_FOR_CHECK_LIST } from './labels';

export const inputComponentCreator = (
  item,
  colIdx,
  rowIdx,
  sectionType,
  changeCallback,
  addPhotoCallback,
  removePhotoCallback,
  row,
) => {
  if (sectionType === checkListSection) {
    return crateInputsForCheckListSection(
      item,
      colIdx,
      rowIdx,
      changeCallback,
      addPhotoCallback,
      removePhotoCallback,
      row,
    );
  } else if (sectionType === generalSection) {
    return createInputsForGeneralSection(
      item,
      colIdx,
      rowIdx,
      changeCallback,
      addPhotoCallback,
      removePhotoCallback,
    );
  }
};

const crateInputsForCheckListSection = (
  item,
  colIdx,
  rowIdx,
  changeCallback,
  addPhotoCallback,
  removePhotoCallback,
  row,
) => {
  const { _id, placeholder, options, value, typeOfInput } = item;
  const label = LABELS_FOR_CHECK_LIST[rowIdx];
  if (parseInt(typeOfInput)) {
    return (
      <InputSelectMobile
        key={_id}
        rowIdx={rowIdx}
        colIdx={colIdx}
        changeHandler={changeCallback}
        placeholder={placeholder}
        label={label}
        value={value}
        options={options?.map((i) => i.option)}
        type={parseInt(typeOfInput)}
      />
    );
  } else if (typeOfInput === 'text') {
    return (
      <InputTextMobile
        key={_id}
        rowIdx={rowIdx}
        colIdx={colIdx}
        changeHandler={changeCallback}
        placeholder={placeholder}
        label={label}
        value={value}
      />
    );
  } else if (typeOfInput === 'number') {
    return (
      <InputNumberMobile
        key={_id}
        rowIdx={rowIdx}
        colIdx={colIdx}
        changeHandler={changeCallback}
        placeholder={placeholder}
        label={label}
        value={value}
      />
    );
  } else if (typeOfInput === 'photo') {
    return (
      <InputPhotoMobile
        key={_id}
        item={item}
        rowIdx={rowIdx}
        colIdx={colIdx}
        changeHandler={addPhotoCallback}
        removeHandler={removePhotoCallback}
        row={row}
      />
    );
  } else if (typeOfInput === 'read') {
    return (
      <InputTextMobile
        key={_id}
        changeHandler={() => ({})}
        placeholder={placeholder}
        label={label}
        value={setMultipleLines(value)}
      />
    );
  } else if (typeOfInput === 'checkbox') {
    return (
      <CheckboxMobile
        key={_id}
        checked={value}
        changeHandler={changeCallback}
        label={label}
        colIdx={colIdx}
        rowIdx={rowIdx}
      />
    );
  }
};

const createInputsForGeneralSection = (
  item,
  colIdx,
  rowIdx,
  changeCallback,
  addPhotoCallback,
  removePhotoCallback,
) => {
  if (parseInt(item.values[0].typeOfInput)) {
    return (
      <InputSelectMobile
        key={item._id}
        rowIdx={colIdx}
        colIdx={rowIdx}
        changeHandler={changeCallback}
        placeholder={item.values[0].placeholder}
        label={item.row_title}
        value={item.values[0].value}
        options={item.values[0].options}
        type={item.values[0].typeOfInput}
      />
    );
  } else if (item.values[0].typeOfInput === 'text') {
    return (
      <InputTextMobile
        key={item._id}
        item={item}
        rowIdx={colIdx}
        colIdx={rowIdx}
        changeHandler={changeCallback}
        placeholder={item.values[0].placeholder}
        label={item.row_title}
        value={item.values[0].value}
      />
    );
  } else if (item.values[0].typeOfInput === 'number') {
    return (
      <InputNumberMobile
        key={item._id}
        item={item}
        rowIdx={colIdx}
        colIdx={rowIdx}
        changeHandler={changeCallback}
        placeholder={item.values[0].placeholder}
        label={item.row_title}
        value={item.values[0].value}
      />
    );
  } else if (item.values[0].typeOfInput === 'photo') {
    return (
      <InputPhotoMobile
        key={item._id}
        item={item}
        rowIdx={rowIdx}
        colIdx={colIdx}
        changeHandler={addPhotoCallback}
        removeHandler={removePhotoCallback}
        // row = {row}
      />
    );
  }
};

export const setMultipleLines = (value) => {
  console.log('value ', value);
  return value?.split?.(',')?.join?.('\n') || '';
};
