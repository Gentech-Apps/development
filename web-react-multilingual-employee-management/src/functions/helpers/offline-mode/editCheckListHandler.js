import { CACHED_CHECK_LISTS_DATA } from '../../../constants/offline-mode';

export const editCheckListHandler = (layer, parent_system_id, check_list) => {
  const { actual_system_id: actualSystemId } = check_list;
  const systemLayers = JSON.parse(localStorage.getItem(CACHED_CHECK_LISTS_DATA))?.result;
  const newSystemLayers = updateCheckList(systemLayers, check_list, actualSystemId);

  const newResponce = {
    ok: true,
    result: newSystemLayers,
  };

  localStorage.setItem(CACHED_CHECK_LISTS_DATA, JSON.stringify(newResponce));

  return newSystemLayers;
};

const updateCheckList = (systems, checkList, actualSystemId) => {
  for (const layer of systems) {
    for (const { systems: systemCheckList } of layer.systems) {
      const index = systemCheckList.findIndex((system) => system._id === actualSystemId);
      if (index !== -1) {
        systemCheckList[index].check_list = checkList;
        return systems;
      }
    }
  }
  return systems;
};
