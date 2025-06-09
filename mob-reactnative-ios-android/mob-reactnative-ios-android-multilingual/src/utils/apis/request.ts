import { UserState } from '../../store/rootState';
import { BAD_GATEWAY_HI, NOT_FOUND_HI, NO_INTERNET_CONNECTION_HI } from '../constants';
import { Toaster, fetchFromStore } from '../helpers/utils';

export const getUserData = async (): Promise<UserState> => {
  let userData = await fetchFromStore('user');
  const user = JSON.parse(userData);
  return user;
};

export const defaultHeader = async (customHeader: HeadersInit_): Promise<HeadersInit_> => {
  const user = await getUserData();
  return {
    ...customHeader,
    'Content-Type': 'application/json',
    Authorization: 'Token ' + (user?.token ?? ''),
  };
};

export const finalizePayload = async (payload: RequestInit): Promise<RequestInit> => {
  return {
    headers: await defaultHeader(payload.headers),
    ...payload,
  };
};

export const request = async (url: string, customPayload: RequestInit): Promise<any> => {
  try {
    const payload: RequestInit = await finalizePayload(customPayload);
    const response = await fetch(url, payload);
    if (response.status === 200) {
      return await response.json();
    } else if (response.status === 404) {
      Toaster(NOT_FOUND_HI);
    } else if (response.status === 502) {
      Toaster(BAD_GATEWAY_HI);
    }
    return false;
  } catch (error) {
    const errorString = String(error);
    if (errorString.includes('Network request failed')) {
      Toaster(NO_INTERNET_CONNECTION_HI);
    }
    return error;
  }
};
