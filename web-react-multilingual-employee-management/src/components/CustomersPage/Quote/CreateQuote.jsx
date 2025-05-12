import React, { useState, useEffect } from 'react';
import { useStyles, jss, theme } from '../styles/CustomersTable.styles';
import { StylesProvider, ThemeProvider } from '@material-ui/styles';
import InfoSection from './Parts/InfoSection';
import Line from '../reused_components/Line';
import AddLocationButton from './Parts/AddLocationButton';
import QuoteNavigation from './Parts/HeaderNavigation';
import TotalAmount from './Parts/TotalAmount';
import QuoteButtons from './Parts/ButtonsSection';
import LocationAndAddProductButton from './Parts/LocationAndAddProductSection';
import { useSelector, useDispatch } from 'react-redux';
import { createQuote } from '../../../functions/api/customer-page';
import { useHistory, useParams } from 'react-router-dom';
import { useQuote } from '../../../hooks/useQuote';
import QuotePDF from '../QuotePDFTemplate/QuotePdf';
import { setPrintActive, setQuoteInfoData } from '../../../actions/quotation-actions';
import { QUOTE_STATUS_OPTIONS } from '../../../constants/translations/customersPage';
import RemarksField from './Parts/Remarks';
import html2PDF from 'jspdf-html2canvas';
import Loader from '../../PopupLoader/PopupLoader';

const CreateQuote = (props) => {
  const NOT_VALID_FIELDS = 'SOME OF FIELDS ARE EMPTY';
  const dispatch = useDispatch();
  const history = useHistory();
  const products = useSelector((state) => state.quotationManagement.products);
  const totalAmount = useSelector((state) => state.quotationManagement.totalAmount);
  const quantityOfProducts = useSelector((state) => state.quotationManagement.quantityOfProducts);
  const printActive = useSelector((state) => state.quotationManagement.printActive);
  const factoryName = useSelector((state) => state.login.user.factory_name);
  const { customerId, quoteId } = useParams();
  const classes = useStyles();
  const [readyForPrint, setReadyForPrint] = useState(false);
  const { SENT_TO_CLIENT, MAKE_AN_ORDER, CLOSE } = QUOTE_STATUS_OPTIONS;
  const [notValidInfoSection, setNotValidInfoSection] = useState(false);

  useEffect(() => {
    const printDocument = async () => {
      const quoteAgreement = document.getElementById('quote-agreement');
      const quoteInfo = document.getElementById('quote-info');
      const quoteProductsPage = document.getElementsByClassName('quoteProductsPage');
      const data = [quoteInfo, ...quoteProductsPage, quoteAgreement];
      await html2PDF(data, {
        jsPDF: {
          format: 'a4',
        },
        html2canvas: {
          useCORS: true,
        },
        imageType: 'image/jpeg',
        output: 'quote.pdf',
      });
    };

    const printDocumentAndRedirectToCustomerPage = async () => {
      await printDocument();
      setReadyForPrint(false);
      dispatch(setPrintActive(false));
      history.push(`/${factoryName}/customers-page/${customerId}`);
    };

    if (readyForPrint) {
      printDocumentAndRedirectToCustomerPage();
    }
  }, [readyForPrint]);

  const {
    locations,
    setLocations,
    quoteNumber,
    setQuoteNumber,
    clientName,
    setClientName,
    address,
    setAddress,
    phoneNumber,
    setPhoneNumber,
    quoteStatus,
    setQuoteStatus,
    quoteDate,
    setQuoteDate,
    readOnly,
    remarks,
    setRemarks,
    projectType,
    setProjectType,
  } = useQuote(quoteId);

  useEffect(() => {
    dispatch(
      setQuoteInfoData({
        _id: quoteId,
        order_number: quoteNumber,
        due_date: quoteDate,
        status: quoteStatus,
        remarks,
        project_type: projectType,
      }),
    );
  }, [quoteNumber, quoteDate, quoteStatus, remarks, projectType]);

  const addLocationHandler = () => {
    const newItem = {
      location: '',
      products: [],
    };
    const newLocations = [...locations, newItem];
    setLocations(newLocations);
  };

  const changeLocationValueHandler = (index, value) => {
    const newLocations = [...locations];
    newLocations[index]['location'] = value;
    setLocations(newLocations);
  };

  const submitForm = async () => {
    const body = {
      quote_info: {
        _id: quoteId,
        order_number: quoteNumber,
        client_name: clientName,
        due_date: quoteDate,
        started: quoteStatus === MAKE_AN_ORDER,
        cancelled: quoteStatus === CLOSE,
        address: address,
        status: quoteStatus,
        quantity: quantityOfProducts,
        value: totalAmount,
        customer_id: customerId,
        client_phone: phoneNumber,
        remarks,
        project_type: projectType,
        // ??????????  //?????????
        // order_category_id: "5f6e0ee658bf6041b4953c95",
        // sub_category_id: "5e3a77fd5ee4ad2e1dff7bec",
        order_category_id: '5f6e0ee658bf6041b4953c99',
        sub_category_id: '5e3a77fd5ee4ad2e1dff7bf0',
        type: 0,
      },
      products,
    };
    if (quoteNumber && quoteDate && quoteStatus && projectType) {
      setNotValidInfoSection(false);
      const result = await createQuote(body);
    } else {
      setNotValidInfoSection(true);
      return NOT_VALID_FIELDS;
    }
  };

  return (
    <React.Fragment>
      {printActive ? (
        <QuotePDF
          products={locations}
          quoteNumber={quoteNumber}
          clientName={clientName}
          address={address}
          phoneNumber={phoneNumber}
          quoteStatus={quoteStatus}
          quoteDate={quoteDate}
          setReadyForPrint={setReadyForPrint}
          remarks={remarks}
          projectType={projectType}
        />
      ) : null}
      {printActive ? <Loader /> : null}
      <StylesProvider jss={jss}>
        <ThemeProvider theme={theme}>
          <div className={`${classes.customersPageWrapper} ${classes.overflowAuto}`}>
            <QuoteNavigation quoteId={quoteId} />
            <InfoSection
              quoteNumber={quoteNumber}
              setQuoteNumber={setQuoteNumber}
              quoteStatus={quoteStatus}
              setQuoteStatus={setQuoteStatus}
              quoteDate={quoteDate}
              setQuoteDate={setQuoteDate}
              projectType={projectType}
              setProjectType={setProjectType}
              isNotValid={notValidInfoSection}
            />
            <Line />
            {locations.map((i, idx) => {
              return (
                <LocationAndAddProductButton
                  key={idx}
                  index={idx}
                  data={i}
                  changeLocationValueHandler={changeLocationValueHandler}
                  locations={locations}
                  status={quoteStatus}
                  readOnly={readOnly}
                />
              );
            })}
            <AddLocationButton addLocationHandler={addLocationHandler} readOnly={readOnly} />
            <TotalAmount locations={locations} />
            <RemarksField
              value={remarks}
              changeHandler={setRemarks}
              disabled={quoteStatus === SENT_TO_CLIENT}
            />
            <QuoteButtons submitForm={submitForm} NOT_VALID_FIELDS={NOT_VALID_FIELDS} />
          </div>
        </ThemeProvider>
      </StylesProvider>
    </React.Fragment>
  );
};

export default CreateQuote;
