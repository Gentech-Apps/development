import React from 'react';
import { styles } from '../styles';

const SignatureField = ({ label }) => {
  return (
    <div style={styles.TitleAndValueRow}>
      <p styles={styles.signatureTitle}>{label}</p>
      <span style={styles.signatureLine}></span>
    </div>
  );
};

export default SignatureField;
