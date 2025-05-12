import React, { useEffect, useState } from 'react';
import PropTypes from 'prop-types';
import { makeStyles, useTheme } from '@material-ui/core/styles';
import Tabs from '@material-ui/core/Tabs';
import Tab from '@material-ui/core/Tab';
import Typography from '@material-ui/core/Typography';
import Box from '@material-ui/core/Box';
import { Badge } from '@material-ui/core';
import { SYSTEMS, TASKS, FILES } from '../../../../../constants/translations/review-popup';
import {
  LIGHT_BLUE,
  NAV_FONT_SIZE,
  NAV_FONT_SIZE_LARGE,
  SYSTEMS_TAB,
  TASKS_TAB,
  FILES_TAB,
} from '../../../../../constants/review-popup';
import { Grid } from '@material-ui/core';

const useStyles = makeStyles((theme) => ({
  root: {
    width: '80%',
    margin: '0 auto',
    display: 'flex',
    justifyContent: 'center',
    fontSize: '1.3em',
    fontWeight: 600,
  },
  selected: {
    background: LIGHT_BLUE,
    boxShadow: '0px 2px 4px rgba(0, 0, 0, 0.05)',
  },
  navLinkName: {
    // fontSize: NAV_FONT_SIZE
    [theme.breakpoints.up('sm')]: {
      fontSize: NAV_FONT_SIZE,
    },
    [theme.breakpoints.up('lg')]: {
      fontSize: NAV_FONT_SIZE_LARGE,
    },
    fontWeight: '600',
  },
  navigation: {
    position: 'sticky',
    top: 0,
    zIndex: 1500,
    backgroundColor: 'white',
  },
}));

const useSystemsQuantity = (systemLayers) => {
  const [systemsTotal, setSystemsTotal] = useState('0');

  useEffect(() => {
    if (systemLayers) {
      // find systems layer 3
      const LAYER_THREE = 3;
      const systems = systemLayers.find((i) => i.layer === LAYER_THREE)?.systems;
      let systemsTotal = 0;
      if (systems) {
        systems.forEach((i) => {
          const systemsQuantity = i?.systems?.length || 0;
          systemsTotal += systemsQuantity;
        });
      }
      setSystemsTotal(systemsTotal + '');
    }
  }, [systemLayers]);

  return systemsTotal;
};

export default function NavMenu(props) {
  const [value, setValue] = React.useState(1);
  const {
    SystemsPage,
    TasksPage,
    FilesPage,
    setActiveTab,
    tasksQuantity,
    filesQuantity,
    TopNav,
    systemLayers,
  } = props;
  const classes = useStyles();
  const systemsQuantity = useSystemsQuantity(systemLayers);
  const handleChange = (event, newValue) => {
    switch (newValue) {
      case 1: {
        setActiveTab(SYSTEMS_TAB);
        break;
      }
      case 2: {
        setActiveTab(TASKS_TAB);
        break;
      }
      case 3: {
        setActiveTab(FILES_TAB);
        break;
      }
    }
    setValue(newValue);
  };

  return (
    <React.Fragment>
      <Grid className={classes.navigation}>
        {TopNav}
        <Tabs
          value={value}
          onChange={handleChange}
          indicatorColor="primary"
          textColor="primary"
          variant="fullWidth"
          style={{
            boxShadow: 'none',
          }}
        >
          <Tab
            value={1}
            style={{ padding: '10px' }}
            classes={{ selected: classes.selected }}
            component={'div'}
            label={
              <Badge
                badgeContent={systemsQuantity || '0'}
                color="primary"
                classes={{ root: classes.root }}
                anchorOrigin={{
                  vertical: 'top',
                  horizontal: 'left',
                }}
              >
                <span className={classes.navLinkName}>{SYSTEMS}</span>
              </Badge>
            }
          />
          <Tab
            value={2}
            style={{ padding: '10px' }}
            classes={{ selected: classes.selected }}
            label={
              <Badge
                badgeContent={tasksQuantity || '0'}
                classes={{ root: classes.root }}
                color="primary"
                anchorOrigin={{
                  vertical: 'top',
                  horizontal: 'left',
                }}
              >
                <span className={classes.navLinkName}>{TASKS}</span>
              </Badge>
            }
          />
          <Tab
            value={3}
            style={{ padding: '10px' }}
            classes={{ selected: classes.selected }}
            label={
              <Badge
                badgeContent={filesQuantity || '0'}
                color="primary"
                classes={{ root: classes.root }}
                anchorOrigin={{
                  vertical: 'top',
                  horizontal: 'left',
                }}
              >
                <span className={classes.navLinkName}>{FILES}</span>
              </Badge>
            }
          />
        </Tabs>
      </Grid>
      {/* </AppBar> */}
      <StyledTabPanel value={value} index={1} name={SYSTEMS}>
        {SystemsPage}
      </StyledTabPanel>
      <StyledTabPanel value={value} index={2} name={TASKS}>
        {TasksPage}
      </StyledTabPanel>
      <StyledTabPanel value={value} index={3} name={FILES}>
        {FilesPage}
      </StyledTabPanel>
    </React.Fragment>
  );
}

const StyledTabPanel = (props) => {
  const { value, index, children } = props;
  return (
    <TabPanel value={value} index={index}>
      {children}
    </TabPanel>
  );
};

function TabPanel(props) {
  const { children, value, index, ...other } = props;

  return (
    <div
      role="tabpanel"
      hidden={value !== index}
      id={`full-width-tabpanel-${index}`}
      aria-labelledby={`full-width-tab-${index}`}
      {...other}
    >
      {value === index && (
        <Box p={3}>
          <Typography component="div">{children}</Typography>
        </Box>
      )}
    </div>
  );
}

TabPanel.propTypes = {
  children: PropTypes.node,
  index: PropTypes.any.isRequired,
  value: PropTypes.any.isRequired,
};
