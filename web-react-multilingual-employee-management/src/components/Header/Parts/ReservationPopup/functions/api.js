import axios from 'axios';
import Cookies from 'js-cookie';
import moment from 'moment';
import { API } from '../../../../../tools/keys/keys';

export const getCookie = (name) => Cookies.get(name);

export const generalGetRequest = async (urlParam) => {
  const token_from_cookie = getCookie('login_cookie');
  const headers = {
    'access-token': token_from_cookie,
  };

  const url = `${API + urlParam}`;

  try {
    const res = await axios({
      method: 'get',
      url,
      headers,
    });
    return res.data;
  } catch (err) {
    console.log('Error has been occured in GET request', err);
    if (err) return undefined;
  }
};

export const generalPostRequest = async (body, urlParam) => {
  const token_from_cookie = getCookie('login_cookie');
  const headers = {
    'access-token': token_from_cookie,
  };

  const url = `${API + urlParam}`;

  try {
    const res = await axios({
      method: 'post',
      url,
      headers,
      data: body,
    });
    return res.data;
  } catch (err) {
    console.log('Error has been occured in POST request', err);
    if (err) return undefined;
  }
};
