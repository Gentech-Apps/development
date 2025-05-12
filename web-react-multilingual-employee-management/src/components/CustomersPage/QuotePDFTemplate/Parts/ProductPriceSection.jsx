import React from 'react';
import { styles } from '../styles';
import { QUOTE } from '../../../../constants/translations/customersPage';
import TitleAndValueRow from './TitleAndValueRow';

const ProductPriceSection = ({ product }) => {
  const { AMOUNT_OF_PRODUCT, TOTAL_COST, PRICE_PER_UNIT, SHEKEL } = QUOTE;
  const { quantity, cost_of_product, total_cost } = product;
  return (
    <div style={styles.flexRow}>
      <TitleAndValueRow
        titleName={PRICE_PER_UNIT}
        value={SHEKEL + cost_of_product}
        style={styles.productInfo}
        titleStyle={styles.orderInfoProperty}
        valueStyle={{ ...styles.orderInfoValue, ...styles.productValueStyles }}
      />
      <TitleAndValueRow
        titleName={AMOUNT_OF_PRODUCT}
        value={quantity}
        style={styles.productInfo}
        titleStyle={styles.orderInfoProperty}
        valueStyle={{ ...styles.orderInfoValue, ...styles.productValueStyles }}
      />
      <TitleAndValueRow
        titleName={TOTAL_COST}
        value={SHEKEL + total_cost}
        style={styles.productInfo}
        titleStyle={styles.orderInfoProperty}
        valueStyle={{ ...styles.orderInfoValue, ...styles.mainColor }}
      />
    </div>
  );
};

export default ProductPriceSection;
