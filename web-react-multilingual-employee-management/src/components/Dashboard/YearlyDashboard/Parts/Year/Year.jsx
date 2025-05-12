import React, { Component } from 'react';
import { connect } from 'react-redux';
import * as actions from '../../../../../actions/actions';

class Year extends Component {
  findRangOfYear = () => {
    let last_index = this.props.orders.weeks_array.length - 1;
    let start_year = this.props.orders.weeks_array[0].year;
    let end_year = this.props.orders.weeks_array[last_index].year;
    let range_of_years;

    if (start_year === end_year) {
      range_of_years = start_year;
    } else {
      range_of_years = start_year + '-' + end_year;
    }

    return range_of_years;
  };

  render() {
    return (
      <div className="year__section" id="year_section">
        <div> {this.findRangOfYear()}</div>
      </div>
    );
  }
}

function mapStateToProps({ router, orders }) {
  return { router, orders };
}

export default connect(mapStateToProps, actions)(Year);
