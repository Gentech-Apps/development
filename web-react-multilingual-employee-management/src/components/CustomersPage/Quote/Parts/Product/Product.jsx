import React from 'react';
import { useStyles } from '../../styles';
import ProductPropertyAndValue from './ProductPropertyAndValue';
import { QUOTE } from '../../../../../constants/translations/customersPage';
import ProductGeneralInfo from './ProductGeneralInfo';
import ProductAttributesInfo from './ProductAttributesInfo';
import ProductPartsInfo from './ProductPartsInfo';
import ProductCostSection from './ProductCostSection';
import { useHistory, useParams } from 'react-router-dom';
import { useSelector } from 'react-redux';
import { API } from '../../../../../tools/keys/keys';

const Product = ({ product, status }) => {
  const history = useHistory();
  const { customerId, quoteId } = useParams();
  const factoryName = useSelector((state) => state.login.user.factory_name);
  const { product_info, cost_of_product, total_cost, quantity, location, _id } = product;
  const { MODEL_NAME, TOTAL_COST } = QUOTE;
  const classes = useStyles();
  const editProductHandler = () => {
    history.push(
      `/${factoryName}/customers-page/edit-product/${customerId}/${quoteId}/${location}/${_id}/${status}`,
    );
  };

  return (
    <div className={classes.productWrapper} onClick={editProductHandler}>
      <img src={`${API}${product_info?.picture}`} alt="product" className={classes.productImage} />
      <div className={classes.productDescriptionWrapper}>
        <div>
          <ProductPropertyAndValue property={MODEL_NAME} value={product_info?.description} />
          <ProductCostSection
            totalCost={total_cost}
            costOfProduct={cost_of_product}
            quantity={quantity}
          />
        </div>
        <div className={classes.productColumnsWrapper}>
          <ProductGeneralInfo product={product} />
          <ProductPartsInfo product={product} />
          <ProductAttributesInfo product={product} />
        </div>
      </div>
    </div>
  );
};

export default Product;
