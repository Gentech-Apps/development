import { Typography } from '@material-ui/core';
import { Grid } from '@material-ui/core';
import React, { useState, useEffect } from 'react';
import Loader from '../../LoaderNew/Loader';
import SideBar from '../../SideBar/SideBar';
import { YEAR_FINANCIAL_CHART } from '../../../constants/translations/order-tasks-report';
import ReportDatePicker from '../reusableComponents/ReportDatePicker';
import * as moment from 'moment';
import { YEAR_REPORT } from '../../../constants';
import { generalGetRequest } from '../../../functions/api/general';
import AnnualFinancialHeader from './Parts/AnnualFinancialHeader';
import { BarChart } from './Parts/BarChart';

const useFinancialReport = () => {
  const [isLoading, setIsLoading] = useState(true);
  const [date, setDate] = useState(moment().startOf(YEAR_REPORT).toDate());
  const [report, setReport] = useState('');

  useEffect(() => {
    const getReport = async () => {
      !isLoading && setIsLoading(true);
      const responce = await generalGetRequest(`/system/reports/financial-chart?date=${date}`);
      if (responce.ok && responce.result) {
        console.log('RESULT >>> ', responce.result);
        setReport(responce.result);
        setIsLoading(false);
      }
    };
    getReport();
  }, [date]);

  const increaseDateHandler = () => {
    const newDate = moment(date).add(1, YEAR_REPORT).toDate();
    setDate(newDate);
  };

  const decreaseDateHandler = () => {
    const newDate = moment(date).subtract(1, YEAR_REPORT).toDate();
    setDate(newDate);
  };

  return {
    decreaseDateHandler,
    increaseDateHandler,
    date,
    isLoading,
    report,
  };
};

const FinancialChart = () => {
  const {
    decreaseDateHandler,
    increaseDateHandler,
    date,
    isLoading,
    report,
  } = useFinancialReport();

  return (
    <div className="backlogs-reports">
      <SideBar />
      <section className="backlogs-reports__main">
        <header>
          <Typography variant="h5">{YEAR_FINANCIAL_CHART}</Typography>
          <ReportDatePicker
            increaseStartDateHandler={increaseDateHandler}
            decreaseStartDateHandler={decreaseDateHandler}
            startDate={date}
          />
        </header>
        {isLoading ? (
          <Loader />
        ) : (
          <>
            <Grid>
              <AnnualFinancialHeader total_actual_plan={report.total_actual_plan} />
            </Grid>
            <Grid
              style={{
                // borderBottom: '1px solid black',
                direction: 'ltr',
                margin: 'auto',
              }}
            >
              {/* {report ? <code>
            {JSON.stringify(report)}
          </code> : null} */}
              <BarChart chartData={report} />
            </Grid>
          </>
        )}
      </section>
    </div>
  );
};

export default FinancialChart;
