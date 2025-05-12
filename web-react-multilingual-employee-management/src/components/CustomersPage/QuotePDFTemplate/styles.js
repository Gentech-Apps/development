export const styles = {
  quotePdfBox: {
    position: 'absolute',
    left: '3000px',
  },
  page: {
    width: '793px',
    direction: 'rtl',
  },
  section: {
    margin: '10px 0 0',
    padding: '10px 0 0',
    flexGrow: 1,
  },
  ////////////////////////////////////////////
  TitleAndValueRow: {
    display: 'flex',
    flexDirection: 'row',
  },
  generalInfo: {
    margin: 10,
    padding: 10,
    flexGrow: 1,
    backgroundColor: '#fef9f3',
    display: 'flex',
    flexDirection: 'column',
    marginBottom: '25px',
  },
  orderInfoTitle: {
    // width: '70%',
    display: 'flex',
    flexDirection: 'row',
    justifyContent: 'space-between',
    marginLeft: '15px',
    alignItems: 'baseline',
    // fontFamily:'Rubik'
  },
  orderInfo: {
    display: 'flex',
    flexDirection: 'row',
    fontSize: '25px',
    // fontFamily:'Rubik'
  },
  orderInfoValue: {
    marginRight: '15px',
  },
  orderInfoProperty: {
    color: `rgb(146 146 142)`,
  },
  location: {
    marginRight: '20px',
    fontSize: '25px',
  },
  // ----------------------------------------------------------------
  customerInfoRow: {
    fontSize: '16px',
    marginBottom: '5px',
  },
  customerInfoRowTitle: {
    width: '80px',
  },
  customerInfoIdAndDueDate: {
    display: 'flex',
    flexDirection: 'row',
    width: '90%',
    justifyContent: 'space-between',
  },
  customerInfoDueDateTitle: {
    width: '145px',
  },
  // ----------------------products
  productWrapper: {
    dispaly: 'flex',
    flexDirection: 'column',
    lineHeight: '20px',
  },
  product: {
    margin: '10px',
    padding: '5px',
    display: 'flex',
  },
  productImageAndNumberWrapper: {
    width: '150px',
    height: '150px',
    display: 'flex',
    flexDirection: 'row',
  },
  productNumber: {
    width: '20px',
    height: '20px',
    border: '1px solid #0091ff',
    margin: '0 10px',
    textAlign: 'center',
    color: '#0091ff',
  },
  productImage: {
    width: '100px',
    height: '100px',
    objectFit: 'contain',
    // height:'auto',
    // maxHeight:'110px',
    // height: '150px',
    // objectFit: 'fill',
    marginLeft: '10px',
  },
  productInfo: {
    display: 'flex',
    flexDirection: 'row',
    fontSize: '14px',
  },
  flexRow: {
    display: 'flex',
    flexDirection: 'row',
  },
  productValueStyles: {
    marginLeft: '10px',
  },
  productInfoColumnValue: {
    width: '110px',
  },
  productInfoColumnProperty: {
    width: '80px',
    color: `rgb(146 146 142)`,
  },
  line: {
    width: '793px',
    borderBottom: `2px`,
    borderColor: 'rgb(146 146 142)',
    borderStyle: 'dotted',
    margin: '20px 0',
  },
  fontSize25px: {
    fontSize: '25px',
  },
  agreementPriceAndTermsInfo: {
    fontSize: '25px',
    width: '240px',
    lineHeight: '35px',
  },
  mainColor: {
    color: '#0091ff',
  },
  agreementRulesWrapper: {
    margin: '30px 0 50px',
  },
  signatureTitle: {
    fontSize: '25px',
  },
  signatureLine: {
    width: '150px',
    borderBottom: '1px solid black',
    marginRight: '15px',
  },
  marginsAndPaddingsForSecondPage: {
    margin: '10px 30px 10px 10px',
    padding: '10px 30px 10px 10px',
  },
  remarksPdf: {
    display: 'block',
    minHeight: '80px',
    width: '100%',
    backgroundColor: '#fef9f3',
    border: '1px solid #0091ff',
    margin: '20px 0',
  },
  // agreeementText:{marginBottom:'7px'},
  agreementText: { lineHeight: '25px' },
  signaturesLine: {
    width: '70%',
    display: 'flex',
    flexDirection: 'row',
    justifyContent: 'space-between',
  },
};
