import { globalStyles } from '../../../../globalStyles';
import {
  BACK_TO_ONLINE_HI,
  CONNECTED_NO_INTERNET_HI,
  NO_INTERNET_CONNECTION_HI,
} from '../../../../utils/constants';

export const NetworkDetails = {
  carrier: '', //airtel
  cellularGeneration: '', //4g
  isConnectionExpensive: true, //true/false
};

export const NetworkStatus = {
  details: NetworkDetails,
  isConnected: true, //true/false
  isInternetReachable: true, //true/false
  isWifiEnabled: true, //true/false
  type: '', //cellular / wifi
};

export const networkInitialState = {
  networkStatus: NetworkStatus,
  bgColor: globalStyles.primary.color,
  textColor: globalStyles.secondary.color,
  text: BACK_TO_ONLINE_HI,
  toggle: false,
};

export const NetworkData = {
  connected: {
    background_color: globalStyles.primary.color, //green',//'#4CAF50',
    text_color: globalStyles.secondary.color,
    text: BACK_TO_ONLINE_HI,
  },
  internetReachable: {
    background_color: globalStyles.dark.color, //'#FFF55C', //'#FFEB3B',
    text_color: globalStyles.secondary.color,
    text: CONNECTED_NO_INTERNET_HI,
  },
  disconnected: {
    background_color: globalStyles.negative.color,
    text_color: globalStyles.secondary.color,
    text: NO_INTERNET_CONNECTION_HI,
  },
};
