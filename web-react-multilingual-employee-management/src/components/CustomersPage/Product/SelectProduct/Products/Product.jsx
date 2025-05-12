import React, { useEffect } from 'react';
import { useStyles } from '../styles';
import { useIsSelected } from '../../../../../hooks/useIsSelected';
import { API } from '../../../../../tools/keys/keys';

const Product = (props) => {
  const classes = useStyles();
  const { selectedProduct, setProduct, product } = props;
  const { description, picture, _id } = product;
  const selected = useIsSelected(_id, selectedProduct._id);

  return (
    <div
      className={selected ? classes.selectedCard : classes.card}
      onClick={() => setProduct(product)}
    >
      <img className={classes.cardImage} src={`${API}${picture}`} alt="product" />

      <p>{description}</p>
    </div>
  );
};

export default Product;
