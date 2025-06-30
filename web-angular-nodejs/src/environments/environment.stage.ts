export const environment = {
  production: false,
  apiUrl: window['env']['apiUrl'] || 'http://localhost:8082/',
  apiUrl2: window['env']['apiUrl2'] || 'http://localhost:8080/',
  baseUrl: window['env']['baseUrl'] || 'http://localhosst:4200/',
  focusOutDisabled: window['env']['focusOutDisabled'] || false,
  namespace: 'root',
  environment: 'staging',
};
