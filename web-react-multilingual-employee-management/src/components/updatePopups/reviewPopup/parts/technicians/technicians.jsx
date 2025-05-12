import React from 'react';
import DialogPopup from '../../../../reused-components/DialogPopup/dialogPopup';
import { TECHNICIANS_TITLE } from '../../../../../constants/translations/review-popup';
import { Grid, Checkbox, Typography, makeStyles } from '@material-ui/core';
import {
  TEXT_FONT_SIZE,
  BLUE_COLOR,
  TEXT_FONT_SIZE_LARGE,
} from '../../../../../constants/review-popup';
let uniqId = require('uniqid');

const useStyles = makeStyles((theme) => ({
  technicianName: {
    // fontSize:TEXT_FONT_SIZE,
    display: 'flex',
    alignItems: 'center',
    [theme.breakpoints.up('sm')]: {
      fontSize: TEXT_FONT_SIZE,
    },
    [theme.breakpoints.up('lg')]: {
      fontSize: TEXT_FONT_SIZE_LARGE,
    },
  },
}));

const Technicians = (props) => {
  const { handleClose, isOpen, technicians, updateProcessPopupStateHandler } = props;
  return (
    <DialogPopup
      handleClose={handleClose}
      width={'30%'}
      height={'70%'}
      isOpen={isOpen}
      handleCancel={handleClose}
      title={TECHNICIANS_TITLE}
      actions={null}
      content={
        <TechniciansList
          technicians={technicians}
          updateProcessPopupStateHandler={updateProcessPopupStateHandler}
        />
      }
    />
  );
};

const TechniciansList = (props) => {
  const { technicians, updateProcessPopupStateHandler } = props;
  const classes = useStyles();

  const selectTechnicianHandler = (index, id) => {
    const techniciansCopy = [...technicians];
    const resources = techniciansCopy[index].resources;
    const selectedResource = resources.find((i) => i._id === id);
    const { current } = selectedResource;
    selectedResource.current = !current;
    // calculate technicians quantity
    const currentTechnicians = techniciansCopy.reduce((result, subDepartment) => {
      const resources = subDepartment?.resources;
      if (resources) {
        const addedResources = resources.filter((i) => i.current);
        result = [...result, ...addedResources];
      }
      return result;
    }, []);
    const resourcesQuntity = currentTechnicians.length;
    updateProcessPopupStateHandler({ resourcesList: techniciansCopy, resourcesQuntity });
  };

  return (
    <Grid container style={{ display: 'flex', flexDirection: 'column' }}>
      {technicians.map((technician, idx) => {
        const { resources } = technician;
        return resources.map((i) => {
          const { current, full_name: name, _id: id } = i;
          return (
            <Grid item style={{ display: 'flex' }} key={uniqId()}>
              <Checkbox
                style={{ color: BLUE_COLOR }}
                checked={current}
                onChange={() => selectTechnicianHandler(idx, id)}
              />
              <Typography varint="h6" className={classes.technicianName}>
                {name}
              </Typography>
            </Grid>
          );
        });
      })}
    </Grid>
  );
};

export default Technicians;
