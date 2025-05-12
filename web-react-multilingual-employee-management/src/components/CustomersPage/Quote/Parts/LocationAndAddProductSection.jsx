import React from 'react';
import AddProductButton from './AddProductButton';
import Location from './Location';
import Product from './Product/Product';

const LocationAndAddProductButton = (props) => {
  const { index, data, changeLocationValueHandler, locations, status, readOnly } = props;
  const { location, products } = data;
  return (
    <React.Fragment>
      <Location
        identifier={index}
        changeLocationValueHandler={changeLocationValueHandler}
        value={location}
        products={products}
      />
      {products?.map((i, idx) => (
        <Product key={idx} product={i} status={status} />
      ))}
      {location ? (
        <AddProductButton
          identifier={index}
          locations={locations}
          location={location}
          readOnly={readOnly}
        />
      ) : null}
    </React.Fragment>
  );
};

export default LocationAndAddProductButton;
