import React, { useEffect, useRef } from 'react';
import { useDispatch } from 'react-redux';
import { setRouteLocation } from '../../../../actions/route_action';

export const BarChart = (props) => {
  const dispatch = useDispatch();
  const canvasRef = useRef(null);
  let LINE_PADDING = 0;
  let LEFT_PADDING = 0;
  const BAR_WIDTH = 12;
  let TOTAL_HEIGHT_OF_EVERY_LINE_Y = 0;
  let BAR_MAX_HEIGHT = 0;
  let HEIGHT_DIVIDEND = 0;
  const X_LABEL_BOX_SIZE = 30;

  useEffect(() => {
    const data = props.chartData.report;
    LEFT_PADDING = canvasRef.current.width / data.length;
    LINE_PADDING =
      (canvasRef.current.width - (LEFT_PADDING * 2 + BAR_WIDTH * (data.length - 1))) / data.length;
    initiateChart();
  }, []);

  const initiateChart = () => {
    const context = canvasRef.current.getContext('2d');
    createYLabe(context);
    BAR_MAX_HEIGHT = TOTAL_HEIGHT_OF_EVERY_LINE_Y / 100;
    HEIGHT_DIVIDEND = props.chartData.newYAxis[0] / BAR_MAX_HEIGHT;
    createBar(context);
  };

  const createBar = (context) => {
    let data = props.chartData.report;
    let y_axis_data = props.chartData.newYAxis;
    let canvas_width = canvasRef.current.width;
    let canvas_height = canvasRef.current.height - X_LABEL_BOX_SIZE;
    let x_line_padding = LEFT_PADDING;
    //create x and y axis line
    (() => {
      let x_line = canvas_width;
      let y_line = canvas_height;
      context.beginPath();
      context.moveTo(x_line_padding, 0);
      context.lineTo(x_line_padding, y_line);
      context.lineTo(x_line, y_line);
      context.strokeStyle = 'lightgrey';
      context.stroke();
    })();

    // create bar
    let width = BAR_WIDTH;
    let bar_starting_position = x_line_padding + LINE_PADDING;
    context.beginPath();
    context.letterSpacing = '0px';
    data.forEach((item) => {
      let actual_num = Number(item.total_planned); //Number(item.total_actual);
      let planned_num = Number(item.total_actual); //Number(item.total_planned);
      let actual_height = Number(actual_num / HEIGHT_DIVIDEND) * 100;
      context.fillStyle = item.planed_color;
      context.fillRect(bar_starting_position, canvas_height - actual_height, width, actual_height);
      context.fillStyle = 'black';
      context.font = '12px sans-serif';
      context.save();
      if (y_axis_data[10] < Math.ceil(actual_num)) {
        context.translate(
          bar_starting_position - 14,
          TOTAL_HEIGHT_OF_EVERY_LINE_Y - actual_height + 15,
        );
      } else {
        context.translate(
          bar_starting_position - 6,
          TOTAL_HEIGHT_OF_EVERY_LINE_Y - actual_height + 0,
        );
      }
      context.rotate((-0.7 * Math.PI) / 2);
      context.fillText((Math.ceil(actual_num) || '').toLocaleString(), 0, 0);
      bar_starting_position += width;
      context.restore();
      context.save();
      let planed_height = (planned_num / HEIGHT_DIVIDEND) * 100;
      context.fillStyle = '#0091ff';
      context.fillRect(bar_starting_position, canvas_height - planed_height, width, planed_height);
      context.fillStyle = 'black';
      context.font = '13px sans-serif';
      context.restore();
      context.save();
      let panned_data_rotation_x = 0;
      let panned_data_rotation_y = 0;
      if (Math.ceil(planned_num) >= Math.ceil(actual_num)) {
        panned_data_rotation_x = planned_num - actual_num >= y_axis_data[10] * 2 ? -15 : 9;
        panned_data_rotation_y = planned_num - actual_num >= y_axis_data[10] * 2 ? 28 : -2;
      }
      context.translate(
        bar_starting_position + panned_data_rotation_x,
        TOTAL_HEIGHT_OF_EVERY_LINE_Y - planed_height + panned_data_rotation_y,
      );
      context.rotate((-0.7 * Math.PI) / 2);
      context.fillText((Math.ceil(planned_num) || '').toLocaleString(), 0, 0);
      context.restore();
      bar_starting_position = barNextPosition(bar_starting_position);
    });

    // Create x label
    (() => {
      let x_name_starting_position = x_line_padding + (LINE_PADDING - 19.5);

      data.forEach((item) => {
        if (item.current) {
          context.beginPath();
          context.fillStyle = '#0091ffed';
          context.fill(roundedRect(x_name_starting_position, canvas_height + 7, 60, 20, 12));
        }

        context.fillStyle = item.current ? 'white' : 'black';
        context.font = '15px sans-serif';
        context.textAlign = 'center';
        context.letterSpacing = '0.5px';
        context.fillText(
          item.date || 'Na',
          x_name_starting_position + BAR_WIDTH / 2 + 24.5,
          canvas_height + 22.3,
        );
        x_name_starting_position = barNextPosition(x_name_starting_position + width);
      });
    })();
  };

  // Create y label text and line
  const createYLabe = (context) => {
    let data = props.chartData.newYAxis;
    let canvas_height = canvasRef.current.height - X_LABEL_BOX_SIZE;
    let canvas_width = canvasRef.current.width;
    let x_line = canvas_width;
    let y_line = canvas_height / data.length;
    data.forEach((item, index) => {
      TOTAL_HEIGHT_OF_EVERY_LINE_Y = y_line * (index + 1);
      if (index) {
        context.beginPath();
        context.moveTo(0, y_line * index);
        context.lineTo(x_line, y_line * index);
        context.strokeStyle = 'lightgrey';
        context.stroke();
        context.font = '15px sans-serif';
        context.letterSpacing = '0.5px';
        context.fillText((Math.ceil(item) || '').toLocaleString(), 5, y_line * index - 3);
      }
    });
  };

  const roundedRect = (x, y, width, height, radius) => {
    let path = new Path2D();
    path.moveTo(x + radius, y);
    path.lineTo(x + width - radius, y);
    path.quadraticCurveTo(x + width, y, x + width, y + radius);
    path.lineTo(x + width, y + height - radius);
    path.quadraticCurveTo(x + width, y + height, x + width - radius, y + height);
    path.lineTo(x + radius, y + height);
    path.quadraticCurveTo(x, y + height, x, y + height - radius);
    path.lineTo(x, y + radius);
    path.quadraticCurveTo(x, y, x + radius, y);
    path.closePath();
    return path;
  };

  const barNextPosition = (bar_starting_position) => {
    return (bar_starting_position += LINE_PADDING);
  };

  return <canvas width={1100} height={350} ref={canvasRef} />;
};
