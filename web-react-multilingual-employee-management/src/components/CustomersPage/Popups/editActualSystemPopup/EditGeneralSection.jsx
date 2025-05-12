import React from 'react';
import { Box } from '@material-ui/core';
import { inputComponentCreator } from '../../../updatePopups/reviewPopup/parts/reusableComponentsForSections/tools';
import { generalSection } from '../../../../constants/responsive-pop-up';

function SystemsGeneralSection(props) {
  const { systemsGeneralSection, setSystemsGeneralSection } = props;

  const setValueHandler = (rowIdx, colIdx, value) => {
    const newSystemsGeneralSection = { ...systemsGeneralSection };
    newSystemsGeneralSection.data[rowIdx].values[colIdx].value = value;
    setSystemsGeneralSection(newSystemsGeneralSection);
  };

  return (
    <React.Fragment>
      {systemsGeneralSection &&
        systemsGeneralSection.data &&
        systemsGeneralSection.data.map((row, rowIdx) => {
          return inputComponentCreator(row, 0, rowIdx, generalSection, setValueHandler);
        })}
    </React.Fragment>
  );
}

export default SystemsGeneralSection;
