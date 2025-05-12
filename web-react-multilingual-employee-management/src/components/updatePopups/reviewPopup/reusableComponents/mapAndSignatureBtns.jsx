import React from 'react';
import { GOOGLE_MAPS_SEARCH_QUERY } from '../../../../constants/maps';
import { Grid } from '@material-ui/core';
import mapIcon from '../../../../images/reviewPopup/map.svg';
import { useStyles } from './styles';
import BorderColorIcon from '@material-ui/icons/BorderColor';
import StartAndEndTimeSection from '../../updateProcessPopup/tasksPerOrder/StartAndEndTimeSection';

const MapAndSignatureBtns = ({
  process,
  signatureClickHandler,
  updateProcessPopupStateHandler,
  actualDuration,
  startTime,
  resourcesQuntity,
}) => {
  const classes = useStyles();

  const createQuery = () => {
    const { address, city } = process.proccess;
    const fullAddress = city + ' ' + address;
    const query = GOOGLE_MAPS_SEARCH_QUERY + fullAddress.split(' ').join('+');
    return query;
  };

  return (
    <Grid className={classes.mapButtonWrapper}>
      <StartAndEndTimeSection
        duration={actualDuration}
        processStartTime={startTime}
        updateProcessPopupStateHandler={updateProcessPopupStateHandler}
        resourcesQuntity={resourcesQuntity}
        selectedProcess={process}
      />
      <BorderColorIcon classes={{ root: classes.signIcon }} onClick={signatureClickHandler} />
      <a href={createQuery()} target="blank">
        <img src={mapIcon} alt="map" className={classes.icon} />
      </a>
    </Grid>
  );
};

export default MapAndSignatureBtns;
