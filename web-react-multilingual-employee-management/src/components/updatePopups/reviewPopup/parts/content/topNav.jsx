import React, { useState, useEffect } from 'react';
import { Grid, makeStyles } from '@material-ui/core';
import EditTechnicianButton from '../../reusableComponents/editTechnicianButton';
import EditOrderButton from '../../reusableComponents/editOrderButton';
import MapAndSignatureBtns from '../../reusableComponents/mapAndSignatureBtns';
import Technicians from '../technicians/technicians';
import DigitalSignature from '../digitalSignature/DigitalSignature';

const useStyles = makeStyles((theme) => ({
  topNavWrapper: {
    display: 'flex',
    justifyContent: 'space-between',
    marginRight: theme.spacing(4),
    marginLeft: theme.spacing(4),
    paddingRight: theme.spacing(4),
    paddingLeft: theme.spacing(4),
    marginBottom: '10px',
  },
}));

const TopNav = (props) => {
  const {
    selectedProcess,
    openReservationPopupHandler,
    techniciansProps,
    actualDuration,
    startTime,
    resourcesQuntity,
  } = props;
  const { order_number: orderNumber, client_name: customerName } = selectedProcess;

  const orderId = selectedProcess?.proccess?.order_id;
  const order_process = selectedProcess?.proccess;

  const { techniciansList, updateProcessPopupStateHandler } = techniciansProps;

  const [technicians, setTechnicians] = useState('');
  const [techniciansPopupOpen, setTechniciansPopupOpen] = useState(false);
  const [digitalSignatureOpen, setDigitalSignatureOpen] = useState(false);

  useEffect(() => {
    const createResourcesName = () => {
      const technicians = techniciansList
        ?.map?.((item) =>
          item?.resources?.map?.((subitem) => (subitem.current ? subitem.full_name + ' / ' : null)),
        )
        ?.join?.(' ')
        ?.replace?.(/,/gi, '');
      setTechnicians(technicians?.substr?.(0, technicians.length - 2) || 'אין עובד');
    };
    createResourcesName();
  }, [techniciansList, technicians]);

  const classes = useStyles();
  return (
    <Grid className={classes.topNavWrapper}>
      <EditTechnicianButton
        clickHandler={() => setTechniciansPopupOpen((open) => !open)}
        technicians={technicians}
      />
      <EditOrderButton
        clickHandler={() => openReservationPopupHandler(order_process)}
        customerName={customerName}
        orderNumber={orderNumber}
      />
      <MapAndSignatureBtns
        process={selectedProcess}
        signatureClickHandler={() => setDigitalSignatureOpen((i) => !i)}
        updateProcessPopupStateHandler={updateProcessPopupStateHandler}
        actualDuration={actualDuration}
        startTime={startTime}
        resourcesQuntity={resourcesQuntity}
      />
      {techniciansPopupOpen && technicians ? (
        <Technicians
          technicians={techniciansList}
          updateProcessPopupStateHandler={updateProcessPopupStateHandler}
          handleClose={() => setTechniciansPopupOpen(false)}
        />
      ) : null}
      {digitalSignatureOpen ? (
        <DigitalSignature
          isOpen={digitalSignatureOpen}
          closeHandler={() => setDigitalSignatureOpen((i) => !i)}
          orderId={orderId}
        />
      ) : null}
    </Grid>
  );
};

export default TopNav;
