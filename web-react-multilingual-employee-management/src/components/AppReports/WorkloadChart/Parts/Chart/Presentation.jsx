import React, { useRef, useEffect } from 'react';
import { useStyles } from '../../styles';
import { ChartTools } from '../../tools';

const ChartPresentation = (props) => {
  const { chartData } = props;
  const canvasRef = useRef(null);
  const classes = useStyles();

  useEffect(() => {
    // ************* to make text and lines accurate and prevent blurrines
    canvasRef.current.width = canvasRef.current.clientWidth;
    canvasRef.current.height = canvasRef.current.clientHeight;
    // ***********************************************************
    const canvas = new ChartTools(chartData, canvasRef.current);
    canvas.createChartPresentation();
  }, [chartData]);

  return <canvas ref={canvasRef} className={classes.presentation}></canvas>;
};

export default ChartPresentation;
