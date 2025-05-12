import makeStyles from '@material-ui/core/styles/makeStyles';

export const useStyles = makeStyles((theme) => ({
  typesWrapper: {
    display: 'flex',
    marginBottom: '10px',
    // padding:'10px'
  },
  productType: {
    padding: '10px',
    border: '1px solid rgba(224, 224, 224, 1)',
    marginRight: '10px',
    cursor: 'pointer',
    color: '#0091ff',
    background: '#c5c7c7',
  },
  productModelType: {
    padding: '10px',
    border: '1px solid rgba(224, 224, 224, 0)',
    marginRight: '10px',
    cursor: 'pointer',
  },
  selectedProductType: {
    padding: '10px',
    border: '1px solid rgba(224, 224, 224, 1)',
    marginRight: '10px',
    cursor: 'pointer',
    color: '#0091ff',
  },
  selectedProductModelType: {
    padding: '10px',
    border: '1px solid rgba(224, 224, 224, 1)',
    marginRight: '10px',
    cursor: 'pointer',
    color: '#0091ff',
  },
  productsWrapper: {
    display: 'flex',
    flexWrap: 'wrap',
  },
  card: {
    display: 'flex',
    flexDirection: 'column',
    marginRight: '10px',
    width: 'calc(100% / 6 - 10px)',
    height: '200px',
    cursor: 'pointer',
    marginBottom: '10px',
  },
  cardImage: {
    height: '140px',
    objectFit: 'contain',
    marginBottom: '10px',
  },
  cardDescription: {
    height: '47px',
    overflow: 'hidden',
  },
  selectedCard: {
    display: 'flex',
    flexDirection: 'column',
    marginRight: '10px',
    width: 'calc(100% / 6 - 10px)',
    height: '200px',
    cursor: 'pointer',
    marginBottom: '10px',
    background: '#0091ff',
  },
  quantityWrapper: {
    width: '246px',
  },
}));
