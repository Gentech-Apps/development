import React, { Component } from 'react';
import { Droppable, Draggable } from 'react-beautiful-dnd';

class ResourceCompletions extends Component {
  handleProcessMenu = (data, date) => {
    this.props.initProccessUpdatePopup(data, date);
  };

  render() {
    const { datesArray, daysOffNumber } = this.props;
    let i = 0;
    // extract only proccesses and merge to one array then sort it by backlog (otherwise buggy because api of dnd)
    let proccessesArray1 = datesArray.map((day) => {
      return day.dayData;
    });
    proccessesArray1 = [].concat.apply([], proccessesArray1);
    let proccessesArray = [];
    proccessesArray1.map((p) => {
      if (p !== undefined) {
        p.value.map((item) => {
          if (item.proccess.backlog) {
            proccessesArray.push(item);
          }
        });
      }
    });
    proccessesArray = proccessesArray.sort(function (a, b) {
      return new Date(a.due_date).getTime() - new Date(b.due_date).getTime();
    });
    return (
      <div
        className="month-view-page__completions"
        style={{ width: `calc( 98% / ${7 - daysOffNumber + 1})` }}
      >
        <header>השלמות</header>
        <Droppable droppableId="completions__droppable">
          {(provided) => (
            <section
              className="month-view-page__completions__droppable"
              ref={provided.innerRef}
              {...provided.droppableProps}
            >
              {proccessesArray.map((data, index) => {
                return (
                  <Draggable
                    draggableId={data.proccess._id + '_' + data.user._id}
                    index={i++}
                    key={data.proccess._id}
                  >
                    {(provided) => (
                      <div
                        onClick={() => {
                          this.handleProcessMenu(data, null);
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
                          <div>{data.proccess.process_name}</div>
                          <div>
                            הושלמו {data.proccess.finished} מתוך {data.proccess.quantity}
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

export default ResourceCompletions;
