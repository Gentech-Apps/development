import { mobileMaxWidth } from '../constants/responsive-pop-up';

export const calculatePopupWidth = (width) => {
  return width > mobileMaxWidth ? '50%' : '75%';
};

export const calculateButtonWidth = (width) => {
  return width > mobileMaxWidth ? '12vw' : '30%';
};
