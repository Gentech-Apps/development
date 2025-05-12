import React, { Component } from 'react';
import { Droppable, Draggable } from 'react-beautiful-dnd';

class WeeklyCompletions extends Component {
  openUpdateMenu = (process) => {
    this.props.openUpdateMenu(process);
  };

  render() {
    const { weeklyOrders, daysOffNumber } = this.props;
    let completionsArray = weeklyOrders.map((item) => [].concat.apply([], item.processes));
    completionsArray = [].concat.apply([], completionsArray);

    return (
      <div
        className="month-view-page__completions week-view-page__completions"
        style={{ width: `calc( 100% / ${7 - daysOffNumber + 2})` }}
      >
        <header>השלמות</header>
        <Droppable droppableId="completions__droppable">
          {(provided) => (
            <section
              className="month-view-page__completions__droppable"
              ref={provided.innerRef}
              {...provided.droppableProps}
            >
              {completionsArray.map((data, index) => {
                if (data.backlog && !data.done)
                  return (
                    <Draggable draggableId={data._id} index={index} key={data._id}>
                      {(provided) => (
                        <div
                          onClick={() => {
                            this.openUpdateMenu(data);
                          }}
                          className="month-view-page__completions__draggable"
                          {...provided.draggableProps}
                          {...provided.dragHandleProps}
                          ref={provided.innerRef}
                        >
                          <section>
                            <div>
                              {data.order_number} - {data.client_name}
                            </div>
                            <div>{data.process_name}</div>
                            <div>
                              הושלמו {data.finished} מתוך {data.quantity}
                            </div>
                          </section>
                        </div>
                      )}
                    </Draggable>
                  );
              })}
            </section>
          )}
        </Droppable>
      </div>
    );
  }
}

export default WeeklyCompletions;
