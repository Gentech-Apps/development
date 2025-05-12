import React, { useState, useEffect } from 'react';
import { generalGetRequest } from '../functions/api/general';

export const useCreateAndEditProduct = (productId) => {
  const [productType, setProductType] = useState('');
  const [productModel, setProductModel] = useState('');
  const [product, setProduct] = useState(''); /**????????????? */
  const [productHeight, setProductHeight] = useState('');
  const [productWidth, setProductWidth] = useState('');
  const [quantity, setQuantity] = useState('');
  // structure attributes
  const [seriesType, setSeriesType] = useState('');
  const [glassType, setGlassType] = useState('');
  const [boxWidth, setBoxWidth] = useState(150);
  const [shutterType, setShutterType] = useState('');
  const [shutterOpen, setShutterOpen] = useState('');
  const [engine, setEngine] = useState('');
  const [box, setBox] = useState('');
  const [netType, setNetType] = useState('');
  const [netHeight, setNetHeight] = useState('');
  const [netWidth, setNetWidth] = useState('');
  // -------additiona attributes
  const [handle, setHandle] = useState('');
  const [handleType, setHandleType] = useState('');
  const [color, setColor] = useState('');
  const [hue, setHue] = useState('');
  const [remarks, setRemarks] = useState('');
  const [partition, setPartition] = useState('');
  const [buffer, setBuffer] = useState('');
  const [loaded, setLoaded] = useState(true);

  const getProductById = async (productId) => {
    const { result } = await generalGetRequest(
      `/system/customer-page/get-product-by-id?product_id=${productId}`,
    );
    const {
      _id,
      order_id,
      location: current_location,
      box_width,
      buffer: product_buffer,
      color: product_color,
      hue: product_hue,
      engine,
      glass_type,
      handle,
      handle_type,
      height,
      width,
      net_type,
      net_height,
      net_width,
      partition: product_partition,
      product_info,
      product_model,
      product_type,
      series_type,
      shutter_open,
      shutter_type,
      quantity: product_quantity,
      cost_of_product,
      total_cost,
      remarks: product_remarks,
      box: product_box,
    } = result;
    setProductModel(product_model || '');
    setProductType(product_type || '');
    setProduct(product_info || '');
    setProductHeight(height || '');
    setProductWidth(width || '');
    setQuantity(product_quantity || '');
    setSeriesType(series_type || '');
    setGlassType(glass_type || '');
    setBoxWidth(box_width || '');
    setShutterType(shutter_type || '');
    setShutterOpen(shutter_open || '');
    setEngine(engine || '');
    setBox(product_box || '');
    setNetType(net_type || '');
    setNetHeight(net_height || '');
    setNetWidth(net_width || '');
    setHandle(handle || '');
    setHandleType(handle_type || '');
    setColor(product_color || '');
    setHue(product_hue || '');
    setRemarks(product_remarks || '');
    setPartition(product_partition || '');
    setBuffer(product_buffer || '');
  };

  useEffect(() => {
    if (productId) {
      setLoaded(false);
      getProductById(productId);
    }
  }, [productId]);

  useEffect(() => {
    if (productId && productType && productModel && product) {
      setLoaded(true);
    }
  }, [productId, productType, productModel, product]);

  const values = {
    productType,
    productModel,
    product,
    productHeight,
    productWidth,
    quantity,
    box,
    seriesType,
    glassType,
    boxWidth,
    shutterOpen,
    shutterType,
    engine,
    netType,
    netHeight,
    netWidth,
    handle,
    handleType,
    color,
    hue,
    remarks,
    partition,
    buffer,
  };

  const setters = {
    setProductType,
    setProductModel,
    setProduct,
    setProductHeight,
    setProductWidth,
    setQuantity,
    setBox,
    setSeriesType,
    setGlassType,
    setBoxWidth,
    setShutterOpen,
    setShutterType,
    setEngine,
    setNetType,
    setNetHeight,
    setNetWidth,
    setHandle,
    setHandleType,
    setColor,
    setHue,
    setRemarks,
    setPartition,
    setBuffer,
  };

  return [values, setters, loaded];
};
