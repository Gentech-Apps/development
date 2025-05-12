import React from 'react';
import { styles } from '../styles';

const TitleAndValueRow = ({ titleName, value, style, titleStyle, valueStyle }) => {
  return (
    <span style={{ ...styles.TitleAndValueRow, ...style }}>
      <p style={{ ...styles.text, ...titleStyle }}>{titleName}</p>
      <p style={valueStyle}>{value}</p>
    </span>
  );
};

export default TitleAndValueRow;
