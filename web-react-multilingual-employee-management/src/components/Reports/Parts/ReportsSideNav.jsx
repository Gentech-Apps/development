import React, { Component } from 'react';
import '../../../sass/reports/reports.scss';
import moment from 'moment';
import 'moment/locale/he';
import { CSVLink, CSVDownload } from 'react-csv';
import RangeDatePicker from './RangeDatePicker';
import { SvgIcon } from '@material-ui/core';
import EventIcon from '@material-ui/icons/Event';

class ReportsSideNav extends Component {
  setRange = (timestamp) => {
    this.props.setRange(timestamp);
  };

  openRangeDp = () => {
    document.getElementsByClassName('open__datepicker__btn')[0].click();
  };

  render() {
    const { csvData, timestamp, isGenerated } = this.props;

    return (
      <div className="reports-page__side-nav">
        <header>
          <h6>טווח תאריכים</h6>
          <div>{moment(timestamp.from).format('DD/MM/YYYY')}</div>
          <p>עד</p>
          <div>{moment(timestamp.to).format('DD/MM/YYYY')}</div>
          <button
            onClick={() => {
              this.openRangeDp();
            }}
          >
            <SvgIcon component={EventIcon} />
            <p>שינוי טווח תאריכים</p>
          </button>
          <aside className="reports-page__side-nav__calendar">
            <RangeDatePicker sendTimeToMother={this.setRange} value={timestamp} />
          </aside>
        </header>
        <section
          className={`reports-page__side-nav__middle-section ${!isGenerated ? 'disabled' : ''}`}
        >
          <button
            disabled={!isGenerated}
            onClick={() => {
              this.props.generateReport();
            }}
          >
            הצג
          </button>
        </section>
        <section className="reports-page__side-nav__export-section">
          <h6>ייצא דו”ח</h6>
          <CSVLink data={csvData} filename={'דוחות.csv'}>
            יצא כאקסל
          </CSVLink>
        </section>
      </div>
    );
  }
}

export default ReportsSideNav;
