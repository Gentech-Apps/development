export const environment = {
  production: true,
  apiUrl: window['env']['apiUrl'] ||   '<url>/api/',
  apiUrl2: window['env']['apiUrl2'] || '<url>/compiler/',
  baseUrl: window['env']['baseUrl'] || '<url>',
  focusOutDisabled: window['env']['focusOutDisabled'] || false,
  namespace: 'root',
  environment: 'production',
};
