import { makeStyles } from '@material-ui/core/styles';
import { BUTTONS_SECTION_HEIGHT } from '../../../../../constants/digital-signature';

export const useStyles = makeStyles((theme) => ({
  container: {
    display: 'flex',
  },
  holder: {
    width: '50%',
    display: 'flex',
    height: '100% !important',
    justifyContent: 'space-between',
  },
  buttonsWrapper: {
    display: 'flex',
    justifyContent: 'space-between',
    padding: '15px 30px',
  },
  button: {
    width: '100px',
    height: '36px',
    borderRadius: '100px',
    border: 'none',
    fontSize: '14px',
  },
  okButton: {
    backgroundColor: 'rgb(0, 145, 255)',
    color: '#ffffff',
  },
  cancelButton: {
    backgroundColor: 'rgba(0, 145, 255, 0.1)',
    color: '#0091ff',
  },
  canvas: {
    height: '100%',
    width: '100%',
    maxHeight: `calc(100% - ${BUTTONS_SECTION_HEIGHT}px)`,
    border: '3px solid #0091ff',
    borderRadius: '10px',
  },
}));
