import React from 'react';
import { styles } from '../styles';

const RemarksPdf = ({ remarks }) => {
  return <span style={styles.remarksPdf}>{remarks}</span>;
};

export default RemarksPdf;
