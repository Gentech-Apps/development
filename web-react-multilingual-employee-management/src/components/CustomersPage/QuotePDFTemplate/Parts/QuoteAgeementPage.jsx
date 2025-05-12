import React from 'react';
import { styles } from '../styles';
import {
  QUOTE_PDF,
  QUOTE,
  QUOTE_PDF_RULES,
} from '../../../../constants/translations/customersPage';
import moment from 'moment';
import TitleAndValueRow from './TitleAndValueRow';
import SignatureField from './Signature';
import Line from './Line';
import RemarksPdf from './RemarksPdf';

const QuoteAgreementPage = (props) => {
  const {
    EXTRAS,
    TOTAL_PRICE_BEFORE_VAT,
    TOTAL_PAYMENT_INCLUDING_VAT,
    OFFER_VALID,
    A_LIGHT_SIGNATURE,
    CUSTOMER_SIGNATURE,
  } = QUOTE_PDF;

  const { SHEKEL } = QUOTE;
  const { totalCost, totalCostWithVAT, remarks } = props;
  const offerValidDate = moment().add(2, 'week').format('DD/MM/YYYY');

  return totalCost && totalCostWithVAT ? (
    <div style={{ ...styles.page, ...styles.marginsAndPaddingsForSecondPage }} id="quote-agreement">
      <Line />
      <p style={styles.fontSize25px}>{EXTRAS}</p>
      <Line />
      <RemarksPdf remarks={remarks} />
      <TitleAndValueRow
        titleName={TOTAL_PRICE_BEFORE_VAT}
        value={SHEKEL + totalCost}
        style={styles.fontSize25px}
        titleStyle={styles.agreementPriceAndTermsInfo}
        valueStyle={styles.fontSize25px}
      />
      <TitleAndValueRow
        titleName={TOTAL_PAYMENT_INCLUDING_VAT}
        value={SHEKEL + totalCostWithVAT}
        style={styles.fontSize25px}
        titleStyle={styles.agreementPriceAndTermsInfo}
        valueStyle={styles.mainColor}
      />
      <TitleAndValueRow
        titleName={OFFER_VALID}
        value={offerValidDate}
        style={styles.fontSize25px}
        titleStyle={styles.agreementPriceAndTermsInfo}
        valueStyle={{}}
      />
      <div style={{ ...styles.productWrapper, ...styles.agreementRulesWrapper }}>
        {QUOTE_PDF_RULES.map((i, idx) => (
          <p style={styles.agreementText} key={idx}>{`${idx + 1}. ${i}`}</p>
        ))}
      </div>
      <div style={{ ...styles.signaturesLine }}>
        <SignatureField label={A_LIGHT_SIGNATURE} />
        <SignatureField label={CUSTOMER_SIGNATURE} />
      </div>
    </div>
  ) : null;
};

export default QuoteAgreementPage;
