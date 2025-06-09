import AsyncStorage from '@react-native-async-storage/async-storage';

export const setState = async (key: string, value: string) => {
  try {
    await AsyncStorage.setItem(key, value);
  } catch (e) {
    console.warn('Unable to State Error: ', e);
  }
};

export const getState = async (key: string) => {
  try {
    const value = await AsyncStorage.getItem(key);
    return value;
  } catch (e) {
    console.warn('Unable to Get Error: ', e);
  }
};

export const removeState = async () => {
  try {
    await AsyncStorage.removeItem('auth');
  } catch (e) {
    console.warn('Unable to Store Error: ', e);
  }
};
