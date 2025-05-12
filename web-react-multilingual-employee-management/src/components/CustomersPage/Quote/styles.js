import makeStyles from '@material-ui/core/styles/makeStyles';

export const useStyles = makeStyles((theme) => ({
  infoSectionWrapper: {
    display: 'flex',
    flexDirection: 'column',
    width: '330px',
    padding: '15px',
  },
  addProductButton: {
    width: '150px',
    border: '2px dashed black',
    height: '150px',
    display: 'flex',
    alignItems: 'center',
    cursor: 'pointer',
  },
  addButtonInnerText: {
    margin: '0 auto',
    fontSize: '20px',
  },
  buttonWithIcon: {
    display: 'flex',
    alignItems: 'center',
    padding: '10px 0',
    cursor: 'pointer',
  },
  buttonWitIconText: {
    marginLeft: '10px',
  },
  navWrapper: {
    display: 'flex',
    justifyContent: 'space-between',
    width: '270px',
  },
  totalAmountFontSize: { fontSize: '25px' },
  buttonsWrapper: {
    width: '250px',
    padding: '15px 0',
  },
  button: {
    // width:'45%'
    width: '110px',
  },
  okButton: {
    background: 'rgb(0, 145, 255);',
    color: 'white',
  },
  printButton: {
    color: 'rgb(0, 145, 255);',
    textDecoration: 'none',
  },
  buttonPending: {
    color: 'rgb(218, 220, 224)',
  },
  productWrapper: {
    height: '150px',
    marginBottom: '10px',
    display: 'flex',
  },
  productImage: {
    width: '150px',
    height: '150px',
    objectFit: 'contain',
  },
  productDescriptionWrapper: {
    display: 'flex',
    flexDirection: 'column',
    justifyContent: 'space-between',
    cursor: 'pointer',
  },
  productPropertyAndValue: {
    display: 'flex',
  },
  productDescriptionColumnWrapper: {
    display: 'flex',
    flexDirection: 'column',
    marginRight: '30px',
  },
  productColumnsWrapper: {
    display: 'flex',
  },
  productCostSectionWrapper: {
    display: 'flex',
  },
  productDescriptionProperty: {
    textAlign: 'right',
    width: '100px',
    color: `rgb(187 187 184)`,
    fontWeight: '500',
  },
}));

export const activeLink = {
  color: '#f7991e',
};

export const navLinkStyle = {
  textDecoration: 'none',
  color: '#0091ff',
};
export const defaultColor = {
  color: '#0091ff',
};

export const disabled = {
  color: 'rgb(187 187 184)',
};
