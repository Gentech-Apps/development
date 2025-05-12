export class ChartTools {
  FRAME_MARGIN = 20;
  CHART_LINE_WIDTH = 3;
  CANVAS_START = 0;
  MARGIN_BOTTOM = 8;
  OVERLOADED_MARK_DIAMETER = 10;
  FONT_SIZE = 14;
  TEXT_TEXT_PADDING_BOTTOM = 4;
  FULL_DAY = 1;

  constructor(chartData, canvas) {
    this.context = canvas?.getContext('2d');
    this.CANVAS_HEIGHT = canvas?.height; /*includes FRAM_MARGIN */
    this.RED_LINE_Y_COORDINATE = canvas?.height * 0.5; /* center of canvas height */
    this.CANVAS_WIDTH = canvas?.width;
    // chart days
    this.chartData = chartData;
    this.chartPeriodWidth = (canvas?.width - 20) / chartData?.length;
  }

  createFrameLines() {
    this.context.beginPath();
    this.context.lineWidth = 3;
    this.context.strokeStyle = 'black';
    this.context.moveTo(this.FRAME_MARGIN, this.CANVAS_START);
    this.context.lineTo(this.FRAME_MARGIN, this.CANVAS_HEIGHT - this.FRAME_MARGIN);
    this.context.lineTo(this.CANVAS_WIDTH, this.CANVAS_HEIGHT - this.FRAME_MARGIN);
    this.context.stroke();
  }

  crateMaxWorkloadMark() {
    this.context.beginPath(); // Start a new path
    this.context.setLineDash([7, 5]);
    this.context.moveTo(this.FRAME_MARGIN, this.RED_LINE_Y_COORDINATE); // Move the pen to (30, 50)
    this.context.lineTo(this.CANVAS_WIDTH, this.RED_LINE_Y_COORDINATE); // Draw a line to (150, 100)
    this.context.lineWidth = 1;
    this.context.strokeStyle = 'red';
    this.context.stroke();
    // add 100 % text
    this.context.font = `${this.FONT_SIZE}px Arial`;
    this.context.fillStyle = 'red';
    this.context.textAlign = 'end';
    this.context.fillText(
      '% 100',
      this.FRAME_MARGIN * 2,
      this.RED_LINE_Y_COORDINATE - this.MARGIN_BOTTOM,
    );
  }

  createXMarks() {
    this.context.font = `${this.FONT_SIZE}px Arial`;
    this.context.fillStyle = 'black';
    this.context.textAlign = 'center';
    this.chartData.forEach((period_xAndWorkload, index) => {
      const { period_x, workload } = period_xAndWorkload;
      this.createRedOverloadedMark(workload, index);
      this.context.fillText(
        String(period_x),
        this.calculateX(index),
        this.CANVAS_HEIGHT - this.TEXT_TEXT_PADDING_BOTTOM,
      );
      this.context.fillStyle = 'black';
    });
  }

  createRedOverloadedMark(workload, index) {
    // if overloaded write into red rounded mark
    if (Number(workload) > this.FULL_DAY) {
      this.context.fillStyle = 'red';
      this.context.beginPath();
      this.context.arc(
        this.calculateX(index),
        this.CANVAS_HEIGHT - this.OVERLOADED_MARK_DIAMETER / 2 - this.TEXT_TEXT_PADDING_BOTTOM,
        this.OVERLOADED_MARK_DIAMETER,
        0,
        Math.PI * 2,
      );
      this.context.closePath();
      this.context.fill();
      this.context.fillStyle = 'white';
    }
  }

  calculateRedLineYCoordinate() {
    const workloads = this.chartData.map((i) => i.workload);
    const maxWorkload = Math.max(...workloads);
    const maxWorkloadIsGreaterThan200Percent = maxWorkload > 2;
    if (maxWorkloadIsGreaterThan200Percent) {
      // calculate red line Y position heigth
      const roundedMaxWorkload = Math.ceil(
        maxWorkload,
      ); /*maxWorkload > 5 ? 3 : Math.ceil(maxWorkload) */
      this.RED_LINE_Y_COORDINATE = Math.round(
        (this.CANVAS_HEIGHT / roundedMaxWorkload) * (roundedMaxWorkload - 1),
      );
    }
  }

  calculateX(index) {
    const startX = !index
      ? this.chartPeriodWidth / 2
      : index * this.chartPeriodWidth + this.chartPeriodWidth / 2;
    return Math.round(startX + this.FRAME_MARGIN);
  }

  drawDiagram() {
    this.context.beginPath();
    this.context.lineWidth = 3;
    this.context.lineJoin = 'round';
    this.context.strokeStyle = 'rgba(0, 145, 255, 0.9)';
    this.context.setLineDash([]);

    this.chartData.forEach((item, index, array) => {
      const { workload, period_x } = item;
      const xCoord = this.calculateX(index);
      // calculation starts from top left corner
      const yCoord =
        this.RED_LINE_Y_COORDINATE +
        Math.floor(
          (1 - workload) * (this.CANVAS_HEIGHT - this.RED_LINE_Y_COORDINATE - this.FRAME_MARGIN),
        );
      const firstPoint = !index;
      const isLastPoint = array.length - 1 === index;
      if (firstPoint) {
        this.context.moveTo(this.FRAME_MARGIN, yCoord);
        this.context.lineTo(xCoord, yCoord);
      } else if (isLastPoint) {
        this.context.lineTo(xCoord, yCoord);
        this.context.lineTo(this.CANVAS_WIDTH, yCoord);
        // close lines path to fill with color
        this.context.lineTo(this.CANVAS_WIDTH, this.CANVAS_HEIGHT - this.FRAME_MARGIN);
        this.context.lineTo(this.FRAME_MARGIN, this.CANVAS_HEIGHT - this.FRAME_MARGIN);
        this.context.closePath();
        this.context.fillStyle = 'rgba(0, 145, 255, 0.1)';
        this.context.fill();
      } else {
        this.context.lineTo(xCoord, yCoord);
      }
    });

    this.context.stroke();
  }

  createChartPresentation() {
    this.calculateRedLineYCoordinate();
    this.crateMaxWorkloadMark();
    this.createXMarks();
    this.drawDiagram();
    this.createFrameLines();
  }

  getOverloaded(chartData) {
    // filter overloaded periods
    const overloadedPeriods = chartData.filter((period) => {
      const { workload } = period;
      if (Number(workload) > this.FULL_DAY) return period;
    });
    // get days or month numbers
    const overloaded = overloadedPeriods.map((i) => i.period_x);
    const overloadedValue = overloaded.join(', ');
    return overloadedValue;
  }
}
