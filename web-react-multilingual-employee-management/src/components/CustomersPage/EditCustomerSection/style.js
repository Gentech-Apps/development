export const useStyles = makeStyles((theme) => ({
  editCustomerSectionWrapper: {
    width: '100%',
    display: 'flex',
    justifyContent: 'space-between',
    padding: theme.spacing(2),
    backgroundColor: '#F7F7F7',
    border: '1px solid #CACBCC',
    borderRadius: '10px',
    marginBottom: theme.spacing(2),
  },
  alignItemsCenter: {
    display: 'flex',
    alignItems: 'center',
  },
  editCustomerTypography: {
    color: '#0091ff',
    paddingTop: '0',
    paddingBottom: '0',
    paddingLeft: theme.spacing(2),
    paddingRight: theme.spacing(2),
    fontFamily: ["'M PLUS 1p'", 'sans-serif'].join(','),
  },
  goBackButton: {
    backgroundColor: '#0091ff',
    borderRadius: '20px',
    color: '#ffffff',
    fontWeight: '500',
  },
  tabsWrapper: {
    width: 'calc(72% - 8px)',
  },
  tab: {
    padding: '5px',
    border: '1px solid #CACBCC',
    borderLeft: 'none',
  },
  leftTab: {
    padding: '5px',
    border: '1px solid #CACBCC',
    borderTopLeftRadius: '10px',
  },
  rightTab: {
    padding: '5px',
    border: '1px solid #CACBCC',
    borderTopRightRadius: '10px',
    borderLeft: 'none',
  },
  editImage: {
    cursor: 'pointer',
  },
}));
