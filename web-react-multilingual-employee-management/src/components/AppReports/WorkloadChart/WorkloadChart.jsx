import { Typography } from '@material-ui/core';
import { Grid } from '@material-ui/core';
import React, { useState } from 'react';
import Loader from '../../LoaderNew/Loader';
import SideBar from '../../SideBar/SideBar';
import {
  DEPARTMENT,
  MONTH_WORKLOAD_CHART,
  YEAR_WORKLOAD_CHART,
} from '../../../constants/translations/order-tasks-report';
import Chart from './Parts/Chart/Chart';
import CustomizedSelect from './Parts/Select';
import ReportDatePicker from './Parts/DatePicker';
import { MONTH_REPORT } from '../../../constants';
import { useChartReport, useDepartmentsOptions, useReportType } from '../../../hooks/chartReport';

const WorkloadChart = () => {
  const reportType = useReportType();

  const departmentsOptions = useDepartmentsOptions();

  const [selectedDepartmentId, setSelectedDepartmentId] = useState('');

  const {
    charts,
    isLoading,
    startDate,
    increaseStartDateHandler,
    decreaseStartDateHandler,
  } = useChartReport(reportType, selectedDepartmentId);

  const changeDepartmentHandler = (e) => setSelectedDepartmentId(e.target.value);

  return (
    <div className="backlogs-reports">
      <SideBar />
      <section className="backlogs-reports__main">
        <header>
          <Typography variant="h5">
            {MONTH_REPORT ? MONTH_WORKLOAD_CHART : YEAR_WORKLOAD_CHART}
          </Typography>
          <CustomizedSelect
            value={selectedDepartmentId}
            label={DEPARTMENT}
            changeHandler={changeDepartmentHandler}
            options={departmentsOptions}
          />
          <ReportDatePicker
            reportType={reportType}
            increaseStartDateHandler={increaseStartDateHandler}
            decreaseStartDateHandler={decreaseStartDateHandler}
            startDate={startDate}
          />
        </header>
        {isLoading ? (
          <Loader />
        ) : (
          <Grid className="backlog-report-scroll">
            {charts
              ? charts.map((chartData) => (
                  <Chart key={chartData.sub_department_id} chartData={chartData} />
                ))
              : null}
          </Grid>
        )}
      </section>
    </div>
  );
};

export default WorkloadChart;
