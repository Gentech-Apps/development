import React, { useState, useEffect } from 'react';
import TypesOfProduct from './TypesOfProduct/TypesOfProduct';
import ProductModels from './ProductModels/ProductModels';
import Products from './Products/Products';
import CustomizedInputWithLabel from '../../reused_components/CustomizedInputWithLabel';
import { PRODUCT_FORM } from '../../../../constants/translations/customersPage';
import { useStyles } from './styles';
import { useSelector } from 'react-redux';

const SelectProduct = (props) => {
  const readOnly = useSelector((state) => state.quotationManagement.readOnly);
  const classes = useStyles();
  const { QUANTITY } = PRODUCT_FORM;
  const {
    productType,
    setProductType,
    productModel,
    setProductModel,
    selectedProduct,
    setProduct,
    productTypes,
    productModels,
    products,
    quantity,
    setQuantity,
    isEditing,
  } = props;

  const setProductTypeHandler = (type) => {
    setProductType(type);
    setProductModel('');
    setProduct({});
  };

  const setProductModelHandler = (model) => {
    setProductModel(model);
    setProduct({});
  };

  const doNothing = () => {};

  return (
    <React.Fragment>
      <TypesOfProduct
        productType={productType}
        setProductTypeHandler={isEditing ? doNothing : setProductTypeHandler}
        productTypes={isEditing ? [productType] : productTypes}
      />
      <ProductModels
        productType={productType}
        productModel={productModel}
        setProductModel={isEditing ? doNothing : setProductModelHandler}
        productModels={isEditing ? [productModel] : productModels}
      />
      <Products
        productModel={productModel}
        selectedProduct={selectedProduct}
        setProduct={isEditing ? doNothing : setProduct}
        products={isEditing ? (selectedProduct ? [selectedProduct] : []) : products}
      />
      <div className={classes.quantityWrapper}>
        <CustomizedInputWithLabel
          label={QUANTITY}
          value={quantity}
          changeHandler={setQuantity}
          type="number"
          disabled={readOnly}
        />
      </div>
    </React.Fragment>
  );
};

export default SelectProduct;
