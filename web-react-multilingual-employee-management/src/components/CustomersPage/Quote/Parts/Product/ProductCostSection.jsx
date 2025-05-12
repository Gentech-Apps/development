import React from 'react';
import { useStyles, defaultColor } from '../../styles';
import ProductPropertyAndValue from './ProductPropertyAndValue';
import { QUOTE } from '../../../../../constants/translations/customersPage';

const ProductCostSection = (props) => {
  const { AMOUNT_OF_PRODUCT, TOTAL_COST, PRICE_PER_UNIT, SHEKEL } = QUOTE;
  const { quantity, costOfProduct, totalCost } = props;
  const classes = useStyles();
  return (
    <div className={classes.productCostSectionWrapper}>
      <ProductPropertyAndValue property={PRICE_PER_UNIT} value={SHEKEL + costOfProduct} />
      <ProductPropertyAndValue property={AMOUNT_OF_PRODUCT} value={quantity} />
      <ProductPropertyAndValue
        property={TOTAL_COST}
        value={SHEKEL + totalCost}
        style={{ color: defaultColor }}
      />
    </div>
  );
};

export default ProductCostSection;
