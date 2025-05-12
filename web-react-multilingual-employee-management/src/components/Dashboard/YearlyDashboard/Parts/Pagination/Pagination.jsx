import React, { Component } from 'react';
import '../../../../../sass/pagination/pagination.scss';
import { getOrders, getOrdersCount } from '../../../../../functions/api/orders';

class Pagination extends Component {
  pageSum = () => {
    let { page_num, orders_count, orders_per_page } = this.props;
    let page_sum = orders_count / orders_per_page;
    return Math.ceil(page_sum);
  };

  paginationPageOrdersClick = async (prevOrNext) => {
    // "prev"  "next"

    let { orders_per_page, page_num, paginationPageOrders, updateShowPopupLoader } = this.props;

    let limit_num = orders_per_page;
    let page_number = page_num; // 0
    let page_num_multiplied_with_limit;

    if (prevOrNext === 'next') {
      if (page_number === this.pageSum()) {
        // IF THE PAGE IS THE LAST PAGE

        return;
      } else {
        updateShowPopupLoader();
        page_number += 1;

        page_num_multiplied_with_limit = page_number * limit_num;
        paginationPageOrders(limit_num, page_num_multiplied_with_limit, prevOrNext);
      }
    } else {
      if (page_number === 0) {
        return;
      } else {
        if (page_number === 1) {
          updateShowPopupLoader();
          page_number -= 1;
          paginationPageOrders(limit_num, 0, prevOrNext);
        } else {
          updateShowPopupLoader();
          page_number -= 1;
          console.log(page_number);
          page_num_multiplied_with_limit = page_number * limit_num; // 1 * 10
          paginationPageOrders(limit_num, page_num_multiplied_with_limit, prevOrNext);
        }
      }
    }
  };

  render() {
    let { page_num, orders_count } = this.props;
    return (
      <div className="pagination__container">
        <div>עמוד</div>
        <div className="page__num__pagination"> {page_num + 1} </div>
        <div>מתוך {this.pageSum()}</div>
        <div className="arrows__pagination">
          <div
            onClick={() => {
              this.paginationPageOrdersClick('prev');
            }}
            id="next_pagination"
            className="arrow__right__pagination"
            style={{ backgroundColor: page_num > 0 ? '#0091ff' : null }}
          >
            <i className="fas fa-chevron-right"></i>
          </div>
          <div
            onClick={() => {
              this.paginationPageOrdersClick('next');
            }}
            id="prev_pagination"
            className="arrow__left__pagination"
            style={{ backgroundColor: page_num < this.pageSum() ? '#0091ff' : null }}
          >
            <i className="fas fa-chevron-left"></i>
          </div>
        </div>
      </div>
    );
  }
}

export default Pagination;
