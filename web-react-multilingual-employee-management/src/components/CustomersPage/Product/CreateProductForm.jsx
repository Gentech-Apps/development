import React, { useEffect, useState } from 'react';
import ProductHeader from './ProductHeader/ProductHeader';
import { useStyles, jss, theme } from '../styles/CustomersTable.styles';
import { StylesProvider, ThemeProvider, jssPreset } from '@material-ui/styles';
import SelectProduct from './SelectProduct/SelectProduct';
import ProductDescriptionForm from './ProductDescription/ProductDescriptionForm';
import { useSelectProductData } from '../../../hooks/useSelectProductData';
import { useProductComponents } from '../../../hooks/useProductComponents';
import {
  getCostAluminiumAndGlass,
  getCostOfBox,
  getCostOfEngine,
  getCostOfNet,
  getCostOfBuffer,
  getPartitonCost,
  getCostOfHandle,
} from '../../../constants/product-parts';
import { setEditingStatus } from '../../../actions/quotation-actions';
import { useSelector } from 'react-redux';
import { useHistory, useParams } from 'react-router-dom';
import { createProduct } from '../../../functions/api/customer-page';
import { useCreateAndEditProduct } from '../../../hooks/useCreateAndEditProduct';
import { QUOTE, QUOTE_STATUS_OPTIONS } from '../../../constants/translations/customersPage';
import { useDispatch } from 'react-redux';
import Loader from '../../LoaderNew/Loader';

const CreateProductForm = (props) => {
  const { customerId, quoteId, location, productId, status } = useParams();
  const factoryName = useSelector((state) => state.login.user.factory_name);
  const { SENT_TO_CLIENT } = QUOTE_STATUS_OPTIONS;
  const dispatch = useDispatch();
  const readOnly = status === SENT_TO_CLIENT;
  const isEditing = !!status;

  useEffect(() => {
    dispatch(setEditingStatus(readOnly));
  }, []);

  const history = useHistory();
  const classes = useStyles();

  const [productValues, productSetters, loaded] = useCreateAndEditProduct(productId);

  const {
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
  } = productValues;

  const {
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
  } = productSetters;

  const [productTypes, productModels, products, seriesTypes] = useSelectProductData(
    productType,
    productModel,
    product._id,
    setSeriesType,
  );
  const [inputsOptions, colorLoaded, shutterLoaded, handleLoaded] = useProductComponents(
    product._id,
    color?._id,
    handle?._id,
    shutterType?._id,
  );

  useEffect(() => {
    if (!productId && productTypes && !productType) {
      setProductType(productTypes[0]);
    }
    if (!productId && productModels && !productModel) {
      setProductModel(productModels[0]);
    }
  }, [productTypes, productModels, productId]);

  const submitForm = async () => {
    if (readOnly) {
      history.push(`/${factoryName}/customers-page/create-quote/${customerId}/${quoteId}`);
      return;
    }

    const body = {
      _id: productId,
      location,
      order_id: quoteId,
      product_type: productType,
      product_model: productModel,
      product_info: product,
      height: productHeight,
      width: productWidth,
      series_type: seriesType,
      glass_type: glassType,
      box_width: boxWidth,
      shutter_type: shutterType,
      shutter_open: shutterOpen,
      engine,
      box,
      net_type: netType,
      net_height: netHeight,
      net_width: netWidth,
      handle,
      handle_type: handleType,
      color,
      hue,
      partition,
      buffer,
      cost_of_product: getCostOfProduct().toFixed(2),
      quantity,
      total_cost: (quantity * getCostOfProduct()).toFixed(2),
      remarks,
    };
    const { ok, result } = await createProduct(body);
    if (ok && result) {
      history.push(`/${factoryName}/customers-page/create-quote/${customerId}/${quoteId}`);
    }
  };

  const getCostOfProduct = () => {
    const { type_for_calculation } = product;
    const getCostOfFieldForAdding = (fieldName) => (fieldName['cost'] ? +fieldName['cost'] : 0);
    const getCostOfFieldForMultiplying = (fieldName) =>
      fieldName['cost'] ? +fieldName['cost'] : 1;

    const result =
      getCostAluminiumAndGlass(
        getCostOfFieldForAdding(seriesType),
        getCostOfFieldForAdding(shutterType),
        getCostOfFieldForAdding(glassType),
        productHeight,
        productWidth,
        type_for_calculation,
      ) +
      getCostOfBox(getCostOfFieldForAdding(box), boxWidth) +
      getCostOfEngine(getCostOfFieldForAdding(engine)) +
      getCostOfNet(getCostOfFieldForMultiplying(netType), netHeight, netWidth) +
      getCostOfBuffer(getCostOfFieldForMultiplying(buffer)) +
      getPartitonCost(getCostOfFieldForMultiplying(partition)) +
      getCostOfHandle(getCostOfFieldForAdding(handle));

    return result;
  };
  return loaded ? (
    <StylesProvider jss={jss}>
      <ThemeProvider theme={theme}>
        <div className={`${classes.customersPageWrapper} ${classes.overflowAuto}`}>
          <ProductHeader />
          <SelectProduct
            productType={productType}
            setProductType={setProductType}
            productModel={productModel}
            setProductModel={setProductModel}
            selectedProduct={product}
            setProduct={setProduct}
            productTypes={productTypes}
            productModels={productModels}
            products={products}
            quantity={quantity}
            setQuantity={setQuantity}
            isEditing={isEditing}
          />
          <ProductDescriptionForm
            inputsOptions={inputsOptions}
            // ------------------------------
            productHeight={productHeight}
            setProductHeight={setProductHeight}
            productWidth={productWidth}
            setProductWidth={setProductWidth}
            // ------------------------------------
            seriesType={seriesType}
            setSeriesType={setSeriesType}
            glassType={glassType}
            setGlassType={setGlassType}
            boxWidth={boxWidth}
            setBoxWidth={setBoxWidth}
            shutterType={shutterType}
            setShutterType={setShutterType}
            shutterOpen={shutterOpen}
            setShutterOpen={setShutterOpen}
            engine={engine}
            setEngine={setEngine}
            box={box}
            setBox={setBox}
            netType={netType}
            setNetType={setNetType}
            netHeight={netHeight}
            setNetHeight={setNetHeight}
            netWidth={netWidth}
            setNetWidth={setNetWidth}
            seriesTypes={seriesTypes}
            // -----------------------
            handle={handle}
            setHandle={setHandle}
            handleType={handleType}
            setHandleType={setHandleType}
            color={color}
            setColor={setColor}
            hue={hue}
            setHue={setHue}
            submitForm={submitForm}
            remarks={remarks}
            setRemarks={setRemarks}
            partition={partition}
            setPartition={setPartition}
            buffer={buffer}
            setBuffer={setBuffer}
          />
        </div>
      </ThemeProvider>
    </StylesProvider>
  ) : (
    <Loader />
  );
};

export default CreateProductForm;
