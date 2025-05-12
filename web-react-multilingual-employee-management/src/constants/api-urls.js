import { getCookie } from '../tools/cookies/cookie';
import { API } from '../tools/keys/keys';

export function createHeaders() {
  const token_from_cookie = getCookie('login_cookie');
  return {
    'access-token': token_from_cookie,
  };
}

export const api = {
  admin: {
    factories: {
      allFactories: `${API}/admin/factories`,
      getById: (id) => `${API}/admin/factory/get-document?_id=${id}`,
      create: `${API}/admin/factory/create`,
      update: `${API}/admin/factory/update`,
      uploadLogo: `${API}/admin/factory/upload-logo`,
    },
    departments: {
      allDepartments: `${API}/admin/departments`,
      getById: (id) => `${API}/admin/department/get-document?_id=${id}`,
      getByFilter: (filter) => `${API}/admin/departments/filter?${filter}`,
      getByFactoryId: (factory_id) =>
        `${API}/admin/departments/get_by_factory_id?factory_id=${factory_id}`,
      create: `${API}/admin/department/create`,
      update: `${API}/admin/department/update`,
      drop: (id) => `${API}/admin/department/drop?_id=${id}`,
    },
    subDepartments: {
      allSubDepartments: `${API}/admin/sub_departments`,
      getById: (id) => `${API}/admin/sub_department/get-document?_id=${id}`,
      getByFilter: (filter) => `${API}/admin/sub_department/filter?${filter}`,
      getByFactoryId: (factory_id) =>
        `${API}/admin/sub_department/get_by_factory_id?factory_id=${factory_id}`,
      getByDepartmentId: (department_id) =>
        `${API}/admin/sub_department/get_by_department_id?department_id=${department_id}`,
      create: `${API}/admin/sub_department/create`,
      update: `${API}/admin/sub_department/update`,
      drop: (id) => `${API}/admin/sub_department/drop?_id=${id}`,
    },
    resources: {
      allResources: `${API}/admin/resources`,
      getById: (id) => `${API}/admin/resource/get-document?_id=${id}`,
      getByFilter: (filter) => `${API}/admin/resource/filter?${filter}`,
      getByFactoryId: (factory_id) =>
        `${API}/admin/resources/get_by_factory_id?factory_id=${factory_id}`,
      create: `${API}/admin/resource/create`,
      update: `${API}/admin/resource/update`,
      drop: (_id) => `${API}/admin/resource/remove?_id=${_id}`,
    },
    recipients: {
      allRecipients: `${API}/admin/recipients`,
      getById: (id) => `${API}/admin/recipient/get-document?_id=${id}`,
      getByFactoryId: (factory_id) =>
        `${API}/admin/recipients/get_by_factory_id?factory_id=${factory_id}`,
      create: `${API}/admin/recipient/create`,
      update: `${API}/admin/recipient/update`,
      getByFilter: (filter) => `${API}/admin/recipients/filter?${filter}`,
    },
    orderTypes: {
      allOrderTypes: `${API}/admin/order-types`,
      getById: (id) => `${API}/admin/order-type/get-document?_id=${id}`,
      getByFactoryId: (factory_id) =>
        `${API}/admin/order-types/get_by_factory_id?factory_id=${factory_id}`,
      getByFilter: (filter) => `${API}/admin/order-types/filter?${filter}`,
      create: `${API}/admin/order-type/create`,
      update: `${API}/admin/order-type/update`,
    },
    processes: {
      allProcesses: `${API}/admin/processes`,
      allWithoutProcesses: `${API}/admin/processes-without-delete`,
      getById: (id) => `${API}/admin/process/get-document?_id=${id}`,
      getByFactoryId: (factory_id) =>
        `${API}/admin/processes/get_by_factory_id?factory_id=${factory_id}`,
      getByFilter: (filter) => `${API}/admin/processes/filter?${filter}`,
      getBySubDepartmentId: (sub_department_id) =>
        `${API}/admin/processes/get_by_sub_department_id?sub_department_id=${sub_department_id}`,
      create: `${API}/admin/process/create`,
      createProcessWithOrders: `${API}/admin/process/createProcessWithOrders`,
      update: `${API}/admin/process/update`,
      updateProcessWithOrders: `${API}/admin/process/updateProcessWithOrders`,
      deleteProcessWithOrders: `${API}/admin/process/deleteProcessWithOrders`,
      delete: `${API}/admin/process/delete`,
    },

    orders: {
      allOrders: `${API}/admin/orders`,
      getById: (id) => `${API}/admin/order/get-document?_id=${id}`,
      getByFactoryId: (factory_id) =>
        `${API}/admin/orders/get_by_factory_id?factory_id=${factory_id}`,
      getOngoingOrders: (factory_id, limit, skip) =>
        `${API}/system/order/ongoing?factory_id=${factory_id}&limit=${limit}&skip=${skip}`,
      create: `${API}/admin/order/create`,
      update: `${API}/admin/order/update`,
    },

    orderProcesses: {
      allOrderProcesses: (params) =>
        `${API}/admin/order_processes?skip=${params.skip}&limit=${params.limit}`,
      getById: (id) => `${API}/admin/order_process/get-document?_id=${id}`,
      getByFactoryId: (factory_id) =>
        `${API}/admin/order_processes/get_by_factory_id?factory_id=${factory_id}`,
      getByFilter: (filter) => `${API}/admin/order_processes/filter?${filter}`,
      create: `${API}/admin/order_process/create`,
      update: `${API}/admin/order_process/update`,
    },
    orderCategories: {
      allOrderCategories: `${API}/admin/order-categories`,
      getById: (id) => `${API}/admin/order-category/get-document?_id=${id}`,
      getByFactoryId: (factory_id) =>
        `${API}/admin/order-categories/get_by_factory_id?factory_id=${factory_id}`,
      getByFilter: (filter) => `${API}/admin/order-categories/filter?${filter}`,
      create: `${API}/admin/order-category/create`,
      update: `${API}/admin/order-category/update`,
    },
    users: {
      getById: (id) => `${API}/admin/user/get-document?_id=${id}`,
      getByFactoryId: (factory_id) =>
        `${API}/admin/users/get_by_factory_id?factory_id=${factory_id}`,
      getByFilter: (filter) => `${API}/admin/users/filter?${filter}`,
      create: `${API}/admin/user/create`,
      update: `${API}/admin/user/update`,
      changePassword: `${API}/admin/user/change_password`,
    },
    orderCollectionStages: {
      getById: (id) => `${API}/admin/order_collection_stage/get-document?_id=${id}`,
      getByFilter: (filter) => `${API}/admin/order_collection_stages/filter?${filter}`,
      create: `${API}/admin/order_collection_stage/create`,
      update: `${API}/admin/order_collection_stage/update`,
    },
    systems: {
      updateInputs: `${API}/admin/systems/update-system-input`,
      updateCheckList: `${API}/admin/systems/update-check-list`,
      create: `${API}/admin/systems/create-system`,
    },
  },
  customersPage: {
    getCustomersDataRequest: () => `${API}/system/customer-page/get-all-customers`,
    createNewCustomerRequest: () => `${API}/system/customer-page/create-new-customer`,
    getCustomerInfo: (id) => `${API}/system/customer-page/get-customer-by-id?_id=${id}`,
    addNewTopLevelSystem: () => `${API}/system/customer-page/add-top-level-system`,
    // editActualSystem:() => `${API}/system/customer-page/edit-actual-system`,
    // deleteActualSystem:({actual_system_id}) => `/system/customer-page/delete-actual-system?actual_system_id=${actual_system_id}`,
  },
  user: {
    updateCollectionStagesInFinancialReport: {
      updateInvoiceOrder: `${API}/system/order/update-invoice-issued-field`,
      updatePaymentReceived: `${API}/system/order/update-payment-received-field`,
    },
  },
};
