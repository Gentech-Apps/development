export const daysEnglish = ['Sun', 'Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat'];

export const FACTORY_DEFAULT = {
  mps: 'hour',
  process_duration: 'hour',
  order_quantity: 'יחידות',
  timezone: 'Asia/Jerusalem',
};

export const FACTORY_MPS_VIEW = ['week', 'day'];

export const DEEPARTMENT_MPS_VIEW = ['weekly', 'monthly'];

export const SUB_DEPARTMENT_DEFAULT = {
  units: 'יח',
};

export const NOTIFICATION_TYPE = ['DelayedConstant', 'CollectionStageDone'];

export const FORM_TYPE_ORDER = [
  { name: 'normal', code: '0' },
  { name: 'special', code: '1' },
  { name: 'service', code: '7' },
  { name: 'normal - Metalpressdoors', code: '0M' },
  { name: 'special - Metalpressdoors', code: '1M' },
  { name: 'service - Metalpressdoors', code: '7M' },
];

export const USER_PRIVILEGES = [
  // {name:"only view", code:'500'},
  { name: 'per user', code: '500' },
  { name: 'no financials', code: '100' },
  { name: 'admin', code: 'admin' },
  { name: 'view only', code: '200' },
];
