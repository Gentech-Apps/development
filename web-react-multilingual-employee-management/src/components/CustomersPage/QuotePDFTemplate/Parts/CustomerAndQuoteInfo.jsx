import React from 'react';
import { styles } from '../styles';
import { QUOTE_PDF } from '../../../../constants/translations/customersPage';
import moment from 'moment';
import TitleAndValueRow from './TitleAndValueRow';
import { getLogo } from '../../../../functions/helpers/getLogo';
import { useSelector } from 'react-redux';

const CustomerAndQuoteInfo = (props) => {
  const { NUMBER, PROJECT_TYPE, CUSTOMER_NAME, ADDRESS, PHONE, ID_NUMBER, DUE_DATE } = QUOTE_PDF;
  const {
    quoteNumber,
    clientName,
    address,
    phoneNumber,
    quoteStatus,
    quoteDate,
    projectType,
  } = props;
  const user = useSelector((state) => state.login.user);

  return (
    <div style={styles.generalInfo}>
      <div style={styles.orderInfoTitle}>
        <TitleAndValueRow
          titleName={NUMBER}
          value={quoteNumber}
          style={styles.orderInfo}
          valueStyle={styles.orderInfoValue}
        />
        <TitleAndValueRow
          titleName={PROJECT_TYPE}
          value={projectType}
          style={styles.orderInfo}
          valueStyle={styles.orderInfoValue}
        />
        <img src={getLogo(user)} style={{ width: '15%', height: 'auto' }} />
      </div>
      <div style={styles.section}>
        <TitleAndValueRow
          titleName={CUSTOMER_NAME}
          value={clientName}
          style={styles.customerInfoRow}
          titleStyle={styles.customerInfoRowTitle}
        />
        <TitleAndValueRow
          titleName={ADDRESS}
          value={address}
          style={styles.customerInfoRow}
          titleStyle={styles.customerInfoRowTitle}
        />
        <TitleAndValueRow
          titleName={PHONE}
          value={phoneNumber}
          style={styles.customerInfoRow}
          titleStyle={styles.customerInfoRowTitle}
        />
        <div style={styles.customerInfoIdAndDueDate}>
          <TitleAndValueRow
            titleName={ID_NUMBER}
            value={address}
            style={styles.customerInfoRow}
            titleStyle={styles.customerInfoRowTitle}
          />
          <TitleAndValueRow
            titleName={DUE_DATE}
            value={moment(quoteDate).format('DD/MM/YYYY')}
            style={styles.customerInfoRow}
            titleStyle={styles.customerInfoDueDateTitle}
          />
        </div>
      </div>
    </div>
  );
};

export default CustomerAndQuoteInfo;
