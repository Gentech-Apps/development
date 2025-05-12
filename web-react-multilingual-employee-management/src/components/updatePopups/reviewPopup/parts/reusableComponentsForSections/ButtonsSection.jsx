import { cancel } from 'raf';
import React from 'react';
import { useStyles } from './styles';
import Button from '@material-ui/core/Button';

const ButtonsSection = (props) => {
  const classes = useStyles();
  const { disabled, okHandler, cancelHandler } = props;

  return (
    <span>
      <Button className={`${classes.editSystemButton}`} onClick={cancelHandler}>
        ביטול
      </Button>
      <Button
        className={`${classes.editSystemButton}`}
        style={{ marginRight: '20px' }}
        onClick={okHandler}
        disabled={disabled}
      >
        אישור
      </Button>
    </span>
  );
};

export default ButtonsSection;
