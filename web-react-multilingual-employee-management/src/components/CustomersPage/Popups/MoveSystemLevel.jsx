import { ContactsOutlined } from '@material-ui/icons';
import React from 'react';
import { useRef } from 'react';
import { useState, useEffect } from 'react';
import { CUSTOMERS_PAGE } from '../../../constants/translations/customersPage';
import { getAllSystemsById, updateSystems } from '../../../functions/api/customer-page';
import DialogPopup from '../../reused-components/DialogPopup/dialogPopup';
import { CustomizedAutocompleteSelectGroup } from '../reused_components/inputs/CustomizedAutocompleteSelect';
import PopUpButtons from '../reused_components/PopUpButtons';

const MoveSystemLevel = ({
  customer_id,
  isOpen,
  handleClosePopup,
  system_id,
  systemUpdated,
  system,
}) => {
  const { parent_system_id, layer } = system;
  const { MOVE_SYSTEMS_LAYER } = CUSTOMERS_PAGE;
  const system_info_ref = useRef({});
  const [systems, setSystems] = useState(null);
  const [loading, setLoading] = useState(false);
  const [systemValue, setSystemValue] = useState('');

  useEffect(() => {
    const getSystems = async () => {
      const result = await getAllSystemsById(customer_id, layer - 1, parent_system_id);
      if (result.ok) {
        setSystems(result.result);
      }
    };
    customer_id && getSystems();
  }, [customer_id]);

  const handleClose = (e) => {
    handleClosePopup(false);
  };

  const handleCancel = (e) => {
    handleClosePopup(false);
  };

  const handleCloseAndSave = async () => {
    setLoading((prev) => !prev);
    let { current, future } = system_info_ref.current;
    if (current) {
      let response = await updateSystems(current);
      const { name, ...data } = future;
      systemUpdated({ result: data, parent_system: data._id, message: response.result.message });
      setLoading((prev) => !prev);
    }
    handleClose(false);
  };

  const changeHandler = (data) => {
    system_info_ref.current = data
      ? {
          current: {
            _id: system_id,
            parent_system_id: data._id,
            layer: data.layer + 1,
          },
          future: {
            ...data,
          },
        }
      : {};
  };

  return (
    <DialogPopup
      handleClose={handleClose}
      width={'40%'}
      height={'fit-content'}
      isOpen={isOpen}
      handleCancel={handleClose}
      title={MOVE_SYSTEMS_LAYER}
      actions={
        <PopUpButtons
          handleClose={handleClose}
          handleCloseAndSave={handleCloseAndSave}
          loading={loading}
        />
      }
      content={
        <CustomizedAutocompleteSelectGroup
          label={CUSTOMERS_PAGE.SYSTEMS}
          value={systemValue}
          changeHandler={changeHandler}
          options={systems}
        />
      }
    />
  );
};

export default MoveSystemLevel;
