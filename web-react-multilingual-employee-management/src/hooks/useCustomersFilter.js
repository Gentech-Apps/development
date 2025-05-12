import { useState, useEffect } from 'react';

export const useCustomersFilter = (data, filterQuery) => {
  const [result, setResult] = useState([]);

  const checkCustomer = (query) => (customer) => {
    const { address, city, contact_name, customer_number, email, name, phone } = customer;
    const upperCaseQuery = query.toUpperCase();
    const setToUpperCase = (value) => (typeof value === 'string' ? value.toUpperCase() : value);

    if (
      setToUpperCase(address) === upperCaseQuery ||
      setToUpperCase(city) === upperCaseQuery ||
      setToUpperCase(contact_name) === upperCaseQuery ||
      setToUpperCase(customer_number) === upperCaseQuery ||
      setToUpperCase(email) === upperCaseQuery ||
      setToUpperCase(name) === upperCaseQuery ||
      setToUpperCase(phone) === upperCaseQuery
    )
      return customer;
  };

  useEffect(() => {
    const filterData = () => {
      if (filterQuery) {
        const filteredData = data?.filter?.(checkCustomer(filterQuery));
        setResult(filteredData);
        return;
      }
      setResult(data);
    };
    filterData();
  }, [data, filterQuery]);

  return result;
};
