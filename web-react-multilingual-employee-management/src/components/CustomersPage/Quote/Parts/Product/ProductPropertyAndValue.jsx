import React from 'react';
import { useStyles } from '../../styles';

const ProductPropertyAndValue = (props) => {
  const { property, value, style } = props;
  const classes = useStyles();
  return (
    <div className={classes.productPropertyAndValue}>
      <h3 className={`${classes.buttonWitIconText} ${classes.productDescriptionProperty}`}>
        {property}
      </h3>
      <h3 className={classes.buttonWitIconText} style={style ? style : {}}>
        {value}
      </h3>
    </div>
  );
};

export default ProductPropertyAndValue;
