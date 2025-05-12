import React from 'react';
import DescriptionIcon from '@material-ui/icons/Description';
import { API } from '../../../../../tools/keys/keys';
import DeleteForeverOutlinedIcon from '@material-ui/icons/DeleteForeverOutlined';
import { ICON_SIZE, BLUE_COLOR } from '../../../../../constants/review-popup';

export const TrashIcon = (props) => {
  const { clickHandler } = props;
  return (
    <DeleteForeverOutlinedIcon
      style={{ fontSize: ICON_SIZE, color: BLUE_COLOR, cursor: 'pointer' }}
      onClick={clickHandler}
    />
  );
};

export const StyledDecriptionIcon = (props) => {
  const { element } = props;
  const { path, type } = element;
  const isImage = type.includes('image');
  return isImage ? (
    <img src={`${API + path}`} style={{ width: ICON_SIZE, cursor: 'pointer' }} alt="image" />
  ) : (
    <DescriptionIcon style={{ fontSize: ICON_SIZE, color: BLUE_COLOR, cursor: 'pointer' }} />
  );
};

export const DecriptionIconForUploadPopup = (props) => {
  const { element } = props;
  const { type } = element;
  const isImage = type.includes('image');
  return isImage ? (
    <img
      src={`${URL.createObjectURL(element)}`}
      style={{ width: ICON_SIZE, cursor: 'pointer' }}
      alt="image"
    />
  ) : (
    <DescriptionIcon style={{ fontSize: ICON_SIZE, color: BLUE_COLOR, cursor: 'pointer' }} />
  );
};
