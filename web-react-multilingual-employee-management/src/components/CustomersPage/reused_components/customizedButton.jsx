import React from 'react';
import Loader from '../../LoaderNew/Loader';
import { useStyles } from './style';

const CustomizedButton = (props) => {
  const classes = useStyles();
  const { backgroundColor, textColor, text, clickHandler, width, loading } = props;
  return (
    <div
      className={classes.rootCustomizedButton}
      style={{
        backgroundColor,
        color: textColor,
        width: width ? width : '',
      }}
      onClick={clickHandler}
    >
      {loading ? (
        <div className="semi_annual_save_btn">
          <Loader />
        </div>
      ) : (
        text
      )}
    </div>
  );
};

export default CustomizedButton;
