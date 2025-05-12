import React from 'react';
import { useStyles } from '../styles';
import { QUOTE, QUOTE_STATUS_OPTIONS } from '../../../../constants/translations/customersPage';
import CustomizedInputWithLabel from '../../reused_components/CustomizedInputWithLabel';
import { setQuoteInfoWasUpdated } from '../../../../actions/quotation-actions';
import { useDispatch } from 'react-redux';

const InfoSection = (props) => {
  const {
    CLIENT_NAME,
    ADDRESS,
    PHONE_NUMBER,
    QUOTE_NUMBER,
    QUOTE_STATUS,
    DUE_DATE,
    PROJECT_TYPE,
    BUILDING,
    RENOVATION,
  } = QUOTE;
  const { DRAFT, SENT_TO_CLIENT, MAKE_AN_ORDER, CLOSE } = QUOTE_STATUS_OPTIONS;
  const classes = useStyles();
  const dispatch = useDispatch();
  const {
    quoteNumber,
    setQuoteNumber,
    // setClientName,setAddress, setPhoneNumber,clientName, phoneNumber, address,
    projectType,
    setProjectType,
    quoteStatus,
    setQuoteStatus,
    quoteDate,
    setQuoteDate,
    isNotValid,
  } = props;
  const readOnly = quoteStatus === SENT_TO_CLIENT;

  const updateFieldHandler = (cb) => (value) => {
    cb(value);
    dispatch(setQuoteInfoWasUpdated(true));
  };

  return (
    <div className={classes.infoSectionWrapper}>
      <CustomizedInputWithLabel
        value={quoteNumber}
        label={QUOTE_NUMBER}
        changeHandler={updateFieldHandler(setQuoteNumber)}
        disabled={readOnly}
        isNotValid={isNotValid}
      />
      <CustomizedInputWithLabel
        value={projectType}
        label={PROJECT_TYPE}
        changeHandler={updateFieldHandler(setProjectType)}
        type="select"
        options={[BUILDING, RENOVATION]}
        disabled={readOnly}
        isNotValid={isNotValid}
      />
      <CustomizedInputWithLabel
        value={quoteStatus}
        label={QUOTE_STATUS}
        changeHandler={updateFieldHandler(setQuoteStatus)}
        type="select"
        options={[DRAFT, SENT_TO_CLIENT, MAKE_AN_ORDER, CLOSE]}
        isNotValid={isNotValid}
      />
      <CustomizedInputWithLabel
        value={quoteDate}
        label={DUE_DATE}
        changeHandler={updateFieldHandler(setQuoteDate)}
        type="date"
        disabled={readOnly}
        isNotValid={isNotValid}
      />
    </div>
  );
};

export default InfoSection;
