import React, { useCallback, useState, useEffect } from 'react';
import { DragDropContext, Droppable, Draggable } from 'react-beautiful-dnd';
import { changeSystemsOrder } from '../../../../../functions/api/orders';
import {
  CACHED_CHECK_LISTS_DATA,
  ELECTRICITY_BOX_LAYER,
} from '../../../../../constants/offline-mode';
import { Grid } from '@material-ui/core';
import System from './system';

const Systems = (props) => {
  const {
    selectSystemHandler,
    editSystemHandler,
    currentOrderId,
    selectedSystemId,
    currentLayer,
    updateProcessPopupStateHandler,
    systemLayers,
    systemsActive,
  } = props;

  const [expanded, setExpanded] = useState('');
  const [currentSystems, setCurrentSystems] = useState('');
  const [systemsOrderForDragAndDrop, setSystemsOrderForDragAndDrop] = useState('');

  useEffect(() => {
    const getCurrentSystems = (systems, layer, parentSystemId) => {
      const systemsGroupedByLayer = systems?.find?.((i) => i.layer === layer)?.systems || [];
      const systemsForDragAndDrop =
        systemsGroupedByLayer?.find?.((i) => i.parent_system_id === parentSystemId)?.systems || [];
      setCurrentSystems(systemsForDragAndDrop);
      const systemsOrder = systemsForDragAndDrop.map((i) => i._id);
      setSystemsOrderForDragAndDrop(systemsOrder);
    };
    systemLayers && getCurrentSystems(systemLayers, currentLayer, selectedSystemId);
  }, [systemLayers, currentLayer, selectedSystemId]);

  const dragEndHandler = async (result) => {
    const { source, destination, draggableId } = result;
    if (!destination || !navigator.onLine) {
      return;
    }
    const orderSystemsCopy = [...currentSystems];
    const actualSystemsCopy = [...systemsOrderForDragAndDrop];
    const [remove] = orderSystemsCopy.splice(source.index, 1);
    orderSystemsCopy.splice(destination.index, 0, remove);
    const [removeActualSystem] = actualSystemsCopy.splice(source.index, 1);
    actualSystemsCopy.splice(destination.index, 0, removeActualSystem);
    const body = {
      order_id: currentOrderId,
      systems: actualSystemsCopy,
      parent_system_id: selectedSystemId,
      layer: currentLayer,
    };
    const [editedCurrentSystems, editedSystemLayers] = sortSystemsAfterDragAndDrop(body);

    updateProcessPopupStateHandler({
      systemLayers: editedSystemLayers,
    });

    const newLayersData = {
      ok: true,
      result: editedSystemLayers,
    };

    const responce = await changeSystemsOrder(body);

    if (responce?.result) {
      localStorage.setItem(CACHED_CHECK_LISTS_DATA, JSON.stringify(newLayersData));
    } else {
      updateProcessPopupStateHandler({
        systemLayers,
      });
    }
  };

  const createIdFromLayerAndParentSystemId = (layer, parentSystemId) => {
    const SPLIT_SYMBOL = ':';
    return `${layer}${SPLIT_SYMBOL}${parentSystemId}`;
  };

  const sortSystemsAfterDragAndDrop = (body) => {
    const { systems: systemsId, parent_system_id, layer } = body;

    const copySystemLayers = [...systemLayers];
    const layerIndex = copySystemLayers.findIndex((i) => i.layer === layer);
    const systemsIndex = systemLayers[layerIndex].systems.findIndex(
      (i) => i.parent_system_id === parent_system_id,
    );
    const systems = copySystemLayers[layerIndex].systems[systemsIndex].systems;
    const newSystems = systemsId.map((systemId) =>
      systems.find((system) => system._id === systemId),
    );
    copySystemLayers[layerIndex].systems[systemsIndex].systems = newSystems;
    return [newSystems, copySystemLayers];
  };

  return currentSystems ? (
    <DragDropContext onDragEnd={(result) => dragEndHandler(result)}>
      <Droppable droppableId={createIdFromLayerAndParentSystemId(currentLayer, selectedSystemId)}>
        {(provided) => (
          <Grid style={{ display: 'flex', flexDirection: 'column' }} ref={provided.innerRef}>
            {currentSystems?.map((system, idx) => (
              <Draggable draggableId={system._id} index={idx} key={system._id}>
                {(p) => (
                  <System
                    key={system._id}
                    system={system}
                    systems={systemLayers}
                    editSystemHandler={editSystemHandler}
                    // updateSystems={updateSystems}
                    selectSystemHandler={selectSystemHandler}
                    systemsActive={systemsActive}
                    expanded={expanded}
                    setExpanded={setExpanded}
                    updateProcessPopupStateHandler={updateProcessPopupStateHandler}
                    currentOrderId={currentOrderId}
                    dragHandleProps={p.dragHandleProps}
                    innerRef={p.innerRef}
                    draggableProps={p.draggableProps}
                  />
                )}
              </Draggable>
            ))}
          </Grid>
        )}
      </Droppable>
    </DragDropContext>
  ) : null;
};

export default Systems;
