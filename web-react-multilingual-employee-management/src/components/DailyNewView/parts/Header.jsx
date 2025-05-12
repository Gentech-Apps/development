import React from 'react';
import { useSelector } from 'react-redux';
import { useStyles } from '../styles';
import { RESOURCES, HOLIDAYS } from '../../../constants/translations/daily-page';

const DailyViewHeader = () => {
  const resources = useSelector((state) => state.resources.resourcesList);
  const classes = useStyles();
  return (
    <div className={classes.calendarHeaderContainer}>
      <div className={classes.calendarHeaderColumn}>
        <div className={classes.titles} style={{ color: 'blue' }}>
          {RESOURCES}
        </div>
        <div className={classes.titles} style={{ color: 'green' }}>
          {HOLIDAYS}
        </div>
      </div>
      {/* reosurces ----------------------------- */}
      <div className={classes.resourcesBox}>
        {resources.map((resource) => (
          <div className={classes.resourceWrapper} key={resource._id}>
            <span className={classes.resourceDescription}>{resource.full_name}</span>
            <span className={classes.resourceDescription}>
              {/* /will be marked if user in vacation */}
            </span>
          </div>
        ))}
      </div>
      {/* -------------------------------- */}
    </div>
  );
};

export default DailyViewHeader;
