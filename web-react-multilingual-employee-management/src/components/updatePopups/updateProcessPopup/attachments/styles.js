import { makeStyles } from '@material-ui/core/styles';

export const useStyles = makeStyles({
  fileContainer: {
    border: '2px solid #0091ff',
    borderRadius: '4px',
    padding: '10px',
    marginBottom: '10px',
    display: 'flex',
    justifyContent: 'space-between',
  },
  filesHolder: {
    height: '80%',
    overflow: 'auto',
  },
  link: {
    color: '#0091ff',
  },
  backLink: {
    color: '#0091ff',
    width: '100%',
    textAlign: 'center',
    fontSize: '20px',
  },
  backLinkWrapper: {
    height: '10%',
    padding: '15px',
  },
  fileInputHolder: {
    width: '100%',
    display: 'flex',
    justifyContent: 'center',
  },
  loaderWrapper: {
    display: 'flex',
    justifyContent: 'center',
  },
});
