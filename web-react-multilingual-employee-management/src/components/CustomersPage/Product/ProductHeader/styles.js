import makeStyles from '@material-ui/core/styles/makeStyles';

export const useStyles = makeStyles((theme) => ({
  // headerHolder:{
  //     padding:'15px'
  // },
  backToQuoteLink: {
    display: 'flex',
    alignItems: 'center',
  },
  headerText: {
    marginBottom: '15px',
  },
  link: {
    color: '#0091ff',
    cursor: 'pointer',
  },
}));

export const defaultColor = {
  color: '#0091ff',
  border: '1px solid #0091ff',
  borderRadius: '100%',
  marginLeft: '20px',
  fontSize: '1rem',
};
