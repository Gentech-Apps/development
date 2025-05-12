import React, { useCallback } from 'react';
import { CUSTOMERS_PAGE } from '../../../../constants/translations/customersPage';
import CustomizedMultipleSystemsSelect from '../../reused_components/inputs/CustomizedMultipleSystemsSelect';
import { SystemsLayer } from './functions';

const SystemLevels = (props) => {
  const {
    systemLayers /* all systems that customer has grouped by layer */,
    orderSystems /* array of selected systems id according to layers */,
    setOrderSystems /* update systems for creating order */,
  } = props;

  const changeHandler = useCallback(
    (layer) => (systems) => {
      // group systems by parent system id
      const groupedByParentSystem = {};
      const systemsGroupedbyLayer = [];

      systems.forEach((i) => {
        const { parent_system_id = null, _id } = i;
        if (groupedByParentSystem[parent_system_id]) {
          groupedByParentSystem[parent_system_id].push(_id);
        } else {
          groupedByParentSystem[parent_system_id] = [_id];
        }
      });

      for (let [parent_system_id, systems] of Object.entries(groupedByParentSystem)) {
        const groupedByParent = {
          parent_system_id,
          systems,
        };
        systemsGroupedbyLayer.push(groupedByParent);
      }

      const orderSystemsCopy = [...orderSystems];
      const selectedLayer = orderSystemsCopy.find((i) => i.layer === layer);
      if (selectedLayer) {
        selectedLayer.systems = systemsGroupedbyLayer;
      } else {
        const newLayerData = { layer, systems: systemsGroupedbyLayer };
        const newLayer = new SystemsLayer(newLayerData);
        orderSystemsCopy.push(newLayer);
      }
      setOrderSystems(orderSystemsCopy);
    },
    [orderSystems],
  );

  return (
    <React.Fragment>
      {systemLayers?.map((layer) => {
        return <AddSelectedSystem key={layer._id} layer={layer} changeHandler={changeHandler} />;
      })}
    </React.Fragment>
  );
};

const AddSelectedSystem = (props) => {
  const { SYSTEMS, LAYER } = CUSTOMERS_PAGE;
  const { layer, changeHandler } = props;
  const { layer: layerNumber, systems } = layer;

  return (
    <CustomizedMultipleSystemsSelect
      label={LAYER + ' ' + layerNumber}
      changeHandler={changeHandler(layerNumber)}
      options={systems}
    />
  );
};

export default SystemLevels;
