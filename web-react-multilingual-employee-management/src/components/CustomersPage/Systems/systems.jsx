import React, { useState } from 'react';
import { DragDropContext, Droppable, Draggable } from 'react-beautiful-dnd';
import { changeSystemsOrder } from '../../../functions/api/orders';
import { Grid } from '@material-ui/core';
import System from './system';
import { MAX_TAB_CONTENT_HEIGHT } from '../../../constants/customers-page';
import { makeStyles } from '@material-ui/core';
import { useSelector } from 'react-redux';

const useStyles = makeStyles((theme) => ({
  collapse: {
    display: 'flex',
    flexDirection: 'column',
    width: '100%',
  },
  firstLayerCollapse: {
    maxHeight: MAX_TAB_CONTENT_HEIGHT,
    overflowY: 'auto',
  },
}));

const Systems = (props) => {
  const classes = useStyles();
  const {
    selectSystemHandler,
    selectedSystemId,
    currentLayer,
    systems,
    updateSiblings,
    customer,
    system_close_ref,
    setSystemCloseRef,
  } = props;
  const [expanded, setExpanded] = useState('');
  const all_systems_layer = useSelector((state) => state.monthResource.check_list);
  const isFirstLayer = currentLayer === 1;
  const check_list_layer = (_id) => {
    let [layer] = systems;
    const system_layer = all_systems_layer?.find((item) => item.layer === layer.layer);
    let check = [];
    const dd = system_layer?.systems?.map((item) => {
      const d = item?.systems.map((innerItem) => {
        if (innerItem.actual_system_id === _id) {
          check = innerItem;
        }
      });
    });
    return check;
  };
  const dragEndHandler = async (result) => {
    const { source, destination, draggableId } = result;
    const systemsBeforeDragAndDrop = [...systems];

    if (!destination || !navigator.onLine) {
      return;
    }
    // update systems order
    const systemsCopy = [...systems];
    const [deletedSystem] = systemsCopy.splice(source.index, 1);
    systemsCopy.splice(destination.index, 0, deletedSystem);
    updateSiblings(systemsCopy);

    // get systems ids list (systems order)
    const systemsOrder = systems.map((system) => system._id);
    // sort systems ids according to changes
    systemsOrder.splice(source.index, 1);
    systemsOrder.splice(destination.index, 0, draggableId);
    // send systems ids as systems in object list on server
    const responce = await changeSystemsOrder({ systems: systemsOrder });
    // if responce === false - set systems as they were before drag and drop
    if (!responce.result) {
      updateSiblings(systemsBeforeDragAndDrop);
    }
  };

  const createIdFromLayerAndParentSystemId = (layer, parentSystemId) => {
    const SPLIT_SYMBOL = ':';
    return `${layer}${SPLIT_SYMBOL}${parentSystemId}`;
  };

  return systems ? (
    <DragDropContext onDragEnd={(result) => dragEndHandler(result)}>
      <Droppable droppableId={createIdFromLayerAndParentSystemId(currentLayer, selectedSystemId)}>
        {(provided) => (
          <Grid
            className={`${classes.collapse} ${isFirstLayer ? classes.firstLayerCollapse : ''}`}
            ref={provided.innerRef}
          >
            {systems?.map((system, idx) => (
              <Draggable draggableId={system._id} index={idx} key={system._id}>
                {(p) => (
                  <System
                    key={system._id}
                    allSystemsLayer={all_systems_layer}
                    systemCheckList={check_list_layer(system._id)}
                    system={system}
                    selectSystemHandler={selectSystemHandler}
                    systems={systems}
                    expanded={expanded}
                    setExpanded={setExpanded}
                    dragHandleProps={p.dragHandleProps}
                    innerRef={p.innerRef}
                    draggableProps={p.draggableProps}
                    updateSiblings={updateSiblings}
                    customer={customer}
                    system_close_ref={system_close_ref}
                    setSystemCloseRef={setSystemCloseRef}
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
