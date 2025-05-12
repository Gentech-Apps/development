import React, { useState, useEffect } from 'react';
// import { Document, Page, Text, View, Font } from '@react-pdf/renderer'
import { styles } from '../styles';
import { QUOTE, PRODUCT_FORM } from '../../../../constants/translations/customersPage';
import { API } from '../../../../tools/keys/keys';
import TitleAndValueRow from './TitleAndValueRow';
import ProductPriceSection from './ProductPriceSection';

const ProductInfoColumn = (props) => {
  const {
    firstValue,
    secondValue,
    thirdValue,
    fourthValue,
    fifthValue,
    sixValue,
    firstName,
    secondName,
    thirdName,
    fourthName,
    fifthName,
    sixName,
  } = props;

  const getValue = (data) => (data?.name ? data?.name : data);

  return (
    <div style={styles.productWrapper}>
      <TitleAndValueRow
        titleName={firstName}
        value={getValue(firstValue)}
        style={styles.productInfo}
        titleStyle={styles.productInfoColumnProperty}
        valueStyle={styles.productInfoColumnValue}
      />
      <TitleAndValueRow
        titleName={secondName}
        value={getValue(secondValue)}
        style={styles.productInfo}
        titleStyle={styles.productInfoColumnProperty}
        valueStyle={styles.productInfoColumnValue}
      />
      <TitleAndValueRow
        titleName={thirdName}
        value={getValue(thirdValue)}
        style={styles.productInfo}
        titleStyle={styles.productInfoColumnProperty}
        valueStyle={styles.productInfoColumnValue}
      />
      <TitleAndValueRow
        titleName={fourthName}
        value={getValue(fourthValue)}
        style={styles.productInfo}
        titleStyle={styles.productInfoColumnProperty}
        valueStyle={styles.productInfoColumnValue}
      />
      <TitleAndValueRow
        titleName={fifthName}
        value={getValue(fifthValue)}
        style={styles.productInfo}
        titleStyle={styles.productInfoColumnProperty}
        valueStyle={styles.productInfoColumnValue}
      />
      <TitleAndValueRow
        titleName={sixName}
        value={getValue(sixValue)}
        style={styles.productInfo}
        titleStyle={styles.productInfoColumnProperty}
        valueStyle={styles.productInfoColumnValue}
      />
    </div>
  );
};

const ProductPdf = ({ product, idx }) => {
  const {
    MODEL_NAME,
    SERIES_TYPE,
    HUE,
    HEIGHT,
    WIDTH,
    GLASS,
    NET_HEIGHT,
    NET_WIDTH,
    NET_TYPE,
    PARTITION,
    BUFFER,
  } = QUOTE;
  const { HANDLE, HANDLE_TYPE, SHUTTER_TYPE, SHUTTER_OPEN, BOX, BOX_WIDTH, ENGINE } = PRODUCT_FORM;
  const {
    _id,
    location,
    box_width,
    buffer,
    color,
    hue,
    engine,
    glass_type,
    handle,
    handle_type,
    height,
    width,
    net_type,
    net_height,
    net_width,
    partition,
    product_info,
    product_model,
    product_type,
    series_type,
    shutter_open,
    shutter_type,
    box,
    remarks,
  } = product;
  return (
    <div style={styles.product}>
      {/* <img src={picture} alt='product' style={styles.productImage} /> */}
      <div style={styles.productImageAndNumberWrapper}>
        <span style={styles.productNumber}>{product.orderNumber}</span>
        <img src={`${API}${product_info?.picture}`} alt="product" style={styles.productImage} />
      </div>
      <div style={{ ...styles.productWrapper }}>
        <TitleAndValueRow
          titleName={MODEL_NAME}
          value={product_info?.description}
          style={styles.productInfo}
          titleStyle={styles.orderInfoProperty}
          valueStyle={styles.orderInfoValue}
        />
        <ProductPriceSection product={product} />
        <div style={styles.flexRow}>
          <ProductInfoColumn
            firstName={WIDTH}
            secondName={HEIGHT}
            thirdName={SERIES_TYPE}
            fourthName={HUE}
            fifthName={HANDLE}
            sixName={HANDLE_TYPE}
            firstValue={width}
            secondValue={height}
            thirdValue={series_type}
            fourthValue={hue}
            fifthValue={handle}
            sixValue={handle_type}
          />
          <ProductInfoColumn
            firstName={GLASS}
            secondName={BUFFER}
            thirdName={PARTITION}
            fourthName={NET_TYPE}
            fifthName={NET_WIDTH}
            sixName={NET_HEIGHT}
            firstValue={glass_type}
            secondValue={buffer}
            thirdValue={partition}
            fourthValue={net_type}
            fifthValue={net_width}
            sixValue={net_height}
          />
          <ProductInfoColumn
            firstName={SHUTTER_TYPE}
            secondName={SHUTTER_OPEN}
            thirdName={BOX + ':'}
            fourthName={BOX_WIDTH}
            fifthName={ENGINE}
            firstValue={shutter_type}
            secondValue={shutter_open}
            thirdValue={box}
            fourthValue={box_width}
            fifthValue={engine}
          />
        </div>
      </div>
    </div>
  );
};

export default ProductPdf;
