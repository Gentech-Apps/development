import { makeStyles } from '@material-ui/core';
const HEIGHT = '61px';

export const useStyles = makeStyles((theme) => ({
  calendarHeaderContainer: {
    width: 'fit-content',
    display: 'flex',
    height: HEIGHT,
    position: 'sticky',
    top: 0,
    zIndex: 50,
    background: '#f3f3f3',
  },
  calendarHeaderColumn: {
    display: 'flex',
    flexDirection: 'column',
    borderBottom: '1px solid #919ba3',
    alignItems: 'center',
    position: 'sticky',
    right: 0,
    zIndex: 60,
    background: '#f3f3f3',
  },
  resourcesBox: {
    display: 'flex',
    height: HEIGHT,
    fontFamily: 'Rubik',
    fontSize: '16px',
    fontWeight: 'bold',
    borderBottom: '1px solid #919ba3',
    justifyContent: 'center',
    textAlign: 'center',
  },
  resourceWrapper: {
    display: 'flex',
    flexDirection: 'column',
    borderLeft: '1px solid #919ba3',
    width: '15vw',
  },
  resourceDescription: {
    width: '15vw',
    textAlign: 'center',
    padding: '5px',
  },
  titles: {
    width: '15vw',
    height: '30px',
    fontFamily: 'Rubik',
    fontSize: '16px',
    fontWeight: 'bold',
    borderBottom: '1px solid #919ba3',
    display: 'flex',
    justifyContent: 'center',
    alignItems: 'center',
  },

  //  Period

  processesBox: {
    display: 'flex',
    backgroundColor: '#f3f3f3',
    borderBottom: '1px solid #e4e5e6',
    borderLeft: '1px solid #e4e5e6',
    width: 'fit-content',
  },
  sideBarBox: {
    borderTop: '1px solid #e4e5e6',
    backgroundColor: '#f3f3f3',
    fontFamily: 'Rubik',
    position: 'sticky',
    right: 0,
    zIndex: 30,
    display: 'flex',
    alignItems: 'center',
    flexDirection: 'column',
    justifyContent: 'center',
    width: '15vw',
  },
  timeMark: {
    position: 'absolute',
    top: '-8px',
    left: '40%',
    backgroundColor: '#f3f3f3',
  },
  timeRowBox: {
    display: 'flex',
  },
  processCell: {
    width: '15vw',
    height: '74px',
    borderLeft: '1px solid #e4e5e6',
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'center',
    backgroundColor: 'white',
  },

  // DAilyView

  calendarBox: {
    display: 'flex',
    flexDirection: 'column',
    height: 'calc(100vh - 140px)',
    overflowX: 'auto',
    backgroundColor: '#f3f3f3',
    // width: auto
    // background: 'white'
    // -webkit-user-select: none; /* Safari 3.1+ */
    // -moz-user-select: none; /* Firefox 2+ */
    // -ms-user-select: none; /* IE 10+ */
    // user-select: none; /* Standard syntax */
  },

  // OrderProcess
  orderProcessContainer: {
    width: '90%',
    height: '80%',
    padding: '5px',
    borderRadius: '20px',
    display: 'flex',
    flexDirection: 'column',
    border: '1px solid #919ba3',
    position: 'relative',
    overflow: 'hidden',
    cursor: 'pointer',
  },
  oderProcessInfoWrapper: {
    display: 'flex',
    justifyContent: 'space-between',
  },
  doneAside: {
    display: 'flex',
    flexDirection: 'column',
    justifyContent: 'space-between',
  },
  orderInfoWrapper: {
    display: 'flex',
  },
  orderInfo: {
    display: 'flex',
    flexDirection: 'column',
    padding: '5px',
    justifyContent: 'space-between',
  },
  completionStatus: {
    // padding:'5px'
  },
  resourcesColorPointer: {
    content: '',
    display: 'block',
    height: '5px',
    width: '100%',
    position: 'absolute',
    bottom: '0px',
  },
  arrowIcon: {
    width: '25px',
    height: '25px',
    backgroundColor: '#0091ff',
    borderRadius: '100%',
    content: '',
    margin: '0 5px 5px',
    display: 'flex',
    alignItems: 'center',
  },
  arrowButton: {
    width: '10px',
    height: '10px',
    display: 'block',
    borderLeft: '3px solid white',
    borderBottom: '3px solid white',
    marginRight: '6px',
    transform: 'rotate(45deg)',
  },
  text: {
    whiteSpace: 'nowrap',
    textOverflow: 'ellipsis',
    overflow: 'hidden',
    width: '8vw',
    textAlign: 'start',
  },
  //  dateChangeLine
  datePickerBox: {
    height: '40px',
    backgroundColor: '#243748',
    display: 'flex',
    alignItems: 'center',
    fontFamily: 'Assistant',
    fontSize: '20px',
    fontWeight: 'bold',
    color: '#ffffff',
    padding: '0 20px',
    display: 'flex',
    justifyContent: 'start',
  },
  selectDate: {
    width: '70%',
    display: 'flex',
    justifyContent: 'center',
  },
  leftArrow: {
    width: 0,
    height: 0,
    borderTop: '10px solid transparent',
    borderBottom: '10px solid transparent',
    borderRight: '10px solid white',
    marginRight: '10px',
    cursor: 'pointer',
  },
  rightArrow: {
    width: 0,
    height: 0,
    borderTop: '10px solid transparent',
    borderBottom: '10px solid transparent',
    borderLeft: '10px solid white',
    marginLeft: '10px',
    cursor: 'pointer',
  },
  date: {},
  backToTodayBtn: {
    backgroundColor: '#0091ff',
    fontFamily: 'Rubik',
    fontSize: '14px',
    lineHeight: 'normal',
    color: '#ffffff',
    padding: '5px 10px',
    borderRadius: '15px',
    cursor: 'pointer',
    // margin: auto;
  },
}));
