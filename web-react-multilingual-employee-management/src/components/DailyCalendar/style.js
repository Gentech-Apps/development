import { makeStyles } from '@material-ui/core';

const TIMELINE_HEIGHT = 50;
const ASIDE_WIDTH = '200px';
const HOUR_SIZE_IN_PIXELS = 50;
const BORDER = '1px solid #E2E2E2';
const WHITE_BORDER = '1px solid white';

export const useStyles = makeStyles((theme) => ({
  // DailyCalendar
  calendarHolder: {
    height: '100%',
    width: '100%',
    display: 'flex',
  },
  dailyProcessesWrapper: {
    width: '100%',
    height: 'calc(100vh - 135px)',
    display: 'flex',
    flexDirection: 'column',
    overflow: 'scroll',
    '&::-webkit-scrollbar': {
      width: '10px',
      height: '10px',
    },
    '&::-webkit-scrollbar-track': {
      boxShadow: 'inset 0 0 5px #b1b1b1',
      webkitBoxShadow: 'inset 0 0 5px #b1b1b1',
      borderRadius: '10px',
      marginRight: '205px',
      marginTop: '150px',
    },
    '&::-webkit-scrollbar-thumb': {
      background: '#296295',
      borderRadius: '10px',
    },
  },
  // CalendarHeader
  calendarHeaderWrapper: {
    position: 'sticky',
    top: 0,
    display: 'flex',
    zIndex: '150',
    background: 'white',
    width: 'fit-content',
  },
  timelinesWrapper: {
    background: '#F7F7F7',
    display: 'flex',
    flexDirection: 'column',
    position: 'sticky',
    right: 0,
  },
  timelineTypography: {
    textAlign: 'center',
    borderLeft: BORDER,
    borderBottom: BORDER,
    padding: '10px 5px',
    width: '100%',
    fontSize: '12px',
    color: '#0065B1',
    fontWeight: 700,
  },
  headerEmptyAside: {
    paddingRight: ASIDE_WIDTH,
    borderLeft: BORDER,
    borderBottom: BORDER,
    width: '100%',
    background: 'white',
    height: '100%',
  },
  // ------------------------------------------
  headerDateAndUsersWrapper: {
    display: 'flex',
    flexDirection: 'column',
    width: 'fit-content',
    borderLeft: BORDER,
  },
  headerDate: {
    textAlign: 'center',
    borderBottom: BORDER,
    padding: '10px 5px',
    fontSize: '12px',
    color: '#455768',
    fontWeight: 700,
  },
  usersWrapper: {
    display: 'flex',
    height: '100%',
    // borderBottom: BORDER,
  },
  userContainer: {
    borderLeft: (props) => (props.isLast ? WHITE_BORDER : BORDER),
    width: (props) => (props.oneUserPerADay ? '65px' : props.firstUser ? '38px' : ''),
    borderBottom: BORDER,
    borderRight: WHITE_BORDER,
    maxWidth: (props) => (props.oneUserPerADay ? '65px' : props.firstUser ? '38px' : '24px'),
  },
  userName: {
    writingMode: 'vertical-rl',
    textOrientation: 'mixed',
    textAlign: 'start',
    padding: '15px 0',
    magrinRight: (props) => (props.firstUser ? '16px' : 0),
    fontSize: '14px',
    color: (props) => (props.overloaded ? 'red' : '#455768'),
    width: '22px',
    marginRight: 'auto',
  },
  // Schedule
  scheduleWrapper: {
    width: '100%',
    display: 'flex',
    width: 'fit-content',
    // height: 'calc(100vh - 135px)',
  },
  hoursAside: {
    background: '#F7F7F7',
    display: 'flex',
    flexDirection: 'column',
    position: 'sticky',
    right: 0,
    height: '100%',
    zIndex: 100,
    paddingTop: '10px',
    borderLeft: BORDER,
  },
  // ScheduleForDay
  scheduleForDayWrapper: {
    width: (props) => (props.oneUserPerDay ? '66px' : ''),
    display: 'flex',
    background: 'white',
    position: 'relative',
    paddingTop: '10px',
    borderLeft: BORDER,
  },
  // UserProcesses
  userProcesses: {
    height: '100%',
    width: (props) => (props.isFirstProcess ? '38px' : '24px'),
    // 99 is z index ,that could be increased in situation if there will be more than 99 users, hoursAside zIndex should be updated
    // decrease z-index for every next process to allow set process above next
    zIndex: (props) => `${99 - props.index} !important`,
  },
  // Process
  orderProcess: {
    cursor: 'pointer !important',
    boxSizing: 'border-box',
    backgroundColor: (props) => props.backgroundColor,
    borderLeft: (props) => `1px solid ${props.backgroundColor}`,
    padding: '15px 0',
    marginRight: (props) => (props.isFirstProcess ? '10px' : 0),
    height: (props) => `${(props.actualDurationHours || 1) * HOUR_SIZE_IN_PIXELS}px`,
    borderBottomLeftRadius: '20px',
    borderBottomRightRadius: '20px',
    borderTopLeftRadius: '20px',
    borderTopRightRadius: '20px',
    display: 'flex',
    alignItems: 'center',
    border: `${BORDER} !important`,
    // borderLeft:'1px solid white',
    overflow: 'hidden',
    marginLeft: (props) => (props.isLastProcess ? 0 : '-6px'),
  },
  processStripe: {
    display: 'block',
    height: '200%',
    // width: '3px',
    width: '15%',
  },
  whiteStripe: {
    background: 'white',
  },
  processName: {
    writingMode: 'vertical-rl',
    textOrientation: 'mixed',
    textAlign: 'end',
    height: '95%',
    whiteSpace: 'nowrap',
    textOverflow: 'ellipsis',
    overflow: 'hidden',
    fontSize: '14px',
    color: '#455768',
  },

  // Downtime
  downtime: {
    height: (props) => `${(props.actualDurationHours || 1) * HOUR_SIZE_IN_PIXELS}px`,
    boxSizing: 'border-box',
    padding: '15px 0px',
    marginRight: (props) => (props.isFirstProcess ? '38px' : '28px'),
    // paddingRight: props => props.isFirstProcess ? '5px' : '0px',
    border: '1px solid rgb(226, 226, 226)',
    marginLeft: (props) => (props.isLastProcess ? 0 : '-6px'),
    // marginLeft: props => props.isLastProcess ? '-5px' :'-6px',
    opacity: 0,
  },
  // Timeline
  timeline: {
    width: '100%',
    height: `${HOUR_SIZE_IN_PIXELS}px`,
    borderTop: BORDER,
    position: 'absolute',
    // add 10 pixels shift for every stripe during calculation top for absolute
    top: (props) => `${10 + props.index * TIMELINE_HEIGHT}px`,
  },
  // TimelineWithTime
  timelineWithTimeWrapper: {
    height: `${HOUR_SIZE_IN_PIXELS}px`,
    paddingRight: '75%',
    width: ASIDE_WIDTH,
    position: 'relative',
  },
  hour: {
    display: 'block',
    content: '" "',
    borderTop: BORDER,
  },
  timeValue: {
    position: 'absolute',
    top: '-6px',
    left: '30%',
    color: '#455768',
    fontSize: '14px',
    direction: 'ltr',
  },
}));
