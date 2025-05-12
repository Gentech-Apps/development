import { useState, useEffect, useRef } from 'react';
import { generalGetRequest } from '../functions/api/general';

export const useCustomerSystems = (customerId, orderSystems) => {
  const template = useRef();
  const [systems, setSystems] = useState('');

  useEffect(() => {
    const setFirstLayerSystems = (layers) => {
      return layers.map((i) => {
        if (i.layer !== 1) {
          const newLayer = { ...i, systems: [] };
          return newLayer;
        }
        return i;
      });
    };

    const getSystems = async () => {
      const responce = await generalGetRequest(
        `/system/customer/find-all-systems-related-to-customer?customer_id=${customerId}`,
      );
      if (responce?.result) {
        const firstLayerSystems = setFirstLayerSystems(responce.result);
        // setSystems(firstLayerSystems)
        template.current = responce.result;
        setSystems(responce.result);
      }
    };
    customerId && getSystems();
  }, [customerId]);

  useEffect(() => {
    if (template.current) {
      const selectedSystems = [];
      orderSystems.forEach((i) => {
        const { layer, systems } = i;
        let allSystems = [];
        systems.forEach((i) => (allSystems = [...allSystems, ...i.systems]));

        selectedSystems.push({
          layer,
          systems: allSystems,
        });
      });

      const options = template.current.map((level) => {
        const { layer, systems } = level;
        if (layer === 1) {
          return level;
        } else {
          const selectedHigherLevel = selectedSystems.find((i) => i.layer === layer - 1);
          if (selectedHigherLevel) {
            const filteredOptions = systems.filter((i) => {
              const { parent_system_id } = i;
              const doSystemExist = selectedHigherLevel.systems.find((i) => i === parent_system_id);
              if (doSystemExist) return i;
            });
            const newLevel = { ...level, systems: filteredOptions };
            return newLevel;
          }
          return { ...level, systems: [] };
        }
      });

      // setSystems(options)
    }
  }, [orderSystems]);

  return systems;
};
