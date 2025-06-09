export interface networkState {
  networkStatus?: NetworkStatus;
  bgColor?: string;
  textColor?: string;
  text?: string;
  toggle?: boolean;
}

export interface NetworkStatus {
  details?: NetworkDetails;
  isConnected?: boolean;
  isInternetReachable?: boolean;
  isWifiEnabled?: boolean;
  type?: string;
}

export interface NetworkDetails {
  carrier?: string;
  cellularGeneration?: string;
  isConnectionExpensive?: boolean;
}
