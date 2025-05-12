import React, { Component } from 'react';
import ClockIcon from '../../../../images/general/white-clock.svg';

class Clock extends React.Component {
  constructor(props) {
    super(props);
    this.state = { date: new Date() };
  }

  componentDidMount() {
    this.timerID = setInterval(() => this.tick(), 1000);
  }

  componentWillUnmount() {
    clearInterval(this.timerID);
  }

  tick() {
    this.setState({
      date: new Date(),
    });
  }

  render() {
    return (
      <div className="daily-view-page__calender__header__right--clock">
        <h2>{this.state.date.toLocaleTimeString('he-is')}</h2>
        <img src={ClockIcon} alt="time" />
      </div>
    );
  }
}

export default Clock;
