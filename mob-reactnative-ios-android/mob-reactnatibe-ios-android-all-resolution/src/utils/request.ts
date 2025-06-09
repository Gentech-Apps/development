import AsyncStorage from '@react-native-async-storage/async-storage';

export class ResponseError extends Error {
  public response: Response;

  constructor(response: Response) {
    super(response.statusText);
    this.response = response;
  }
}

const defaultOptions = async () => {
  // const sessionToken = await AsyncStorage.getItem('sessionToken');
  return {
    headers: { 'Content-Type': 'application/json' },
  };
};

async function checkStatus(response: Response) {
  if (response.status >= 200 && response.status < 300) {
    return response;
  }
  const error = new ResponseError(response);
  const res = await response.text();
  error.message = res;
  error.response = response;
  throw error;
}

function parseJSON(response: Response) {
  if (response.status === 204 || response.status === 205) {
    return null;
  }
  return response.json();
}

export async function request(
  url: string,
  options?: RequestInit,
): Promise<{} | { err: ResponseError }> {
  const payload = { ...defaultOptions(), ...options };

  const fetchResponse = await fetch(url, payload);
  const response = await checkStatus(fetchResponse);
  return parseJSON(response);
}
