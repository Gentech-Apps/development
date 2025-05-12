import React, { Component } from 'react';
import { withRouter } from 'react-router-dom';
import '../../../../../sass/calender/calender.scss';
import DragAndDrop from '../DragAndDrop/DragAndDrop';
import 'rc-slider/assets/index.css';
import { polyfill } from 'es6-promise';
import { getOrders, getOrdersCount, appGetOrders } from '../../../../../functions/api/orders';
import { addColumnWeeksGenerator } from '../../../../../functions/data/demo_project';
import {
  addMonthsToWeeksArr,
  findRangOfDatesFromWeeksArr,
} from '../../../../../functions/data/weeks_generator';
import { connect } from 'react-redux';
import * as actions from '../../../../../actions/actions';
import InfiniteScroll from 'react-infinite-scroller';
import Year from '../Year/Year';
import Weeks from '../Weeks/Weeks';
import Loader from '../../../../LoaderNew/Loader';
import {
  ORDERS_QUANTITY_START_PAGE,
  PAGINATION_LIMIT,
} from '../../../../../constants/orders-pagination';

let uniqid = require('uniqid');
polyfill();

class Calender extends Component {
  constructor(props) {
    super(props);
    this.state = {
      current_week: 9,
      orders_data: props.orders.orders,
      dates_arr: [],
      scroller_toggle_x: true,
      empty_screen: false,
      api_order_page_num: 0,
      orders_count: 0,
      orders_per_page: ORDERS_QUANTITY_START_PAGE,
      page_number_multipal_by_orders: 0,
      loadMoreItems: true,
      checkStickySideBar: false,
      are_more_weeks_in_weeks_array: false,
      draggable_process_for_popup: {},
      reposition_body: {},
      order_befor_reposition: {},
      warning_message: '',
      warnings: [],
      width: '',
      first_load: true,
      is_drag: false,
    };
  }

  componentWillUnmount() {
    window.removeEventListener('resize', this.onWindowResize);
  }

  async componentDidMount() {
    await this.getYearlyOrders();
    window.addEventListener('resize', this.onWindowResize);
  }

  componentWillReceiveProps(nextProps) {
    const { process } = this.props;

    if (
      this.props.login.selectedDepartment !== nextProps.login.selectedDepartment ||
      this.props.login.selectedManager !== nextProps.login.selectedManager ||
      process.show_bids !== nextProps.process.show_bids
      // ||
      // this.props.login.selectedResource !==
      // nextProps.login.selectedResource
    ) {
      setTimeout(() => {
        this.getYearlyOrders();
      }, 0);
    }

    if (this.props.data_changed !== nextProps.data_changed) {
      setTimeout(() => {
        this.getYearlyOrders();
      }, 0);
    }

    if (process.show_first_uncomplete_process !== nextProps.process.show_first_uncomplete_process) {
      if (Object.keys(this.props.orders.orders).length <= 8) {
        this.addMoreOrdersWhenScrollDown();
      } else {
        setTimeout(() => {
          this.props.upadteLoaderPopup(false);
        }, 0);
      }
    }
  }

  shouldComponentUpdate(nextProps, nextState) {
    let next = Object.keys(nextProps.orders.orders);
    let prev = Object.keys(this.props.orders.orders);

    if (nextState.empty_screen || nextProps.orders.orders !== this.props.orders.orders) {
      return true;
    }
    return (
      nextProps.orders.orders === [] ||
      //if the orders keys not the same
      JSON.stringify(next.sort()) !== JSON.stringify(prev.sort())
    );
  }

  getYearlyOrders = async () => {
    let { orders_per_page, loadMoreItems } = this.state;
    let { process } = this.props;
    let selectedDepartment = this.props.login.selectedDepartment._id;
    let employee_id = this.props.login.selectedManager._id;
    let started = process.show_bids;
    // let selectedResource = this.props.login.selectedResource
    if (!loadMoreItems) {
      this.setState({
        loadMoreItems: true,
      });
    }

    let orders_data;
    this.props.upadteLoaderPopup(true);

    //if search:
    if (window.location.search) {
      let value = window.location.search.replace('?order_number=', '');
      orders_data = await appGetOrders(
        '',
        '',
        'XL',
        value,
        selectedDepartment,
        employee_id,
        started,
        '',
      );
    } else {
      orders_data = await getOrders(
        'XL',
        orders_per_page,
        '0',
        '1',
        selectedDepartment,
        employee_id,
        started,
        '',
        // selectedResource
      );
    }
    this.props.upadteLoaderPopup(false);
    let get_orders_count = await getOrdersCount();
    if (!orders_data || orders_data.orders.length === 0 || Object.keys(orders_data).length === 0) {
      this.props.setPageNumberForGetOrders(0);
      // this.props.upadteLoaderPopup(false);

      if (employee_id) {
        this.props.setOrders([]);
      }

      this.setState({
        empty_screen: true,
      });

      return;
    } else {
      // this.props.upadteLoaderPopup(false);
      this.setState({
        empty_screen: false,
        orders_count: get_orders_count,
      });

      if (orders_data.orders) {
        this.setState({});

        this.props.setPageNumberForGetOrders(0);
        this.props.setOrdersAndWeeksData(orders_data); //send to redux!!   or to call addOrder() to add order to the array
      }
    }

    this.checkIfNoHorizontalScroll(); //put if statment theer!!!1 on the calender class

    this.checkIfNoVerticalScroll();
  };

  onWindowResize = () => {
    this.checkIfNoVerticalScroll();
  };

  makeSideAndDatesBarSticky = () => {
    // find the container width and put the width to the childs for the sticky sidebar - chrom!
    let column__wraaper__container = document.getElementById('column__wraaper__container'); // find the container width and put the width to the childs for the sticky sidebar - chrom!
    if (column__wraaper__container) {
      let column__wraaper__container_width = column__wraaper__container.offsetWidth;

      // top__calender__container
      var top__calender__container = document.querySelectorAll('#top__calender__container');
      for (let i = 0; i < top__calender__container.length; i++) {
        top__calender__container[i].style.width = column__wraaper__container_width + 'px';
      }

      const box__container = document.querySelectorAll('#projects__box__container');
      for (let i = 0; i < box__container.length; i++) {
        box__container[i].style.width = column__wraaper__container_width + 'px';
      }
    }
  };

  addWeeksWhenScrollLeft = () => {
    let mps_days = this.props.login.user.mps_view && this.props.login.user.mps_view === 'day';
    let off_days = this.props.login.user.off_days;
    let new_week_arr = addMonthsToWeeksArr(7, this.props.orders.weeks_array, mps_days, off_days); // 7 = 2 months more = add 8 colums
    let new_orders_data_with_more_columns = addColumnWeeksGenerator(
      8,
      this.props.orders.orders,
      off_days.length,
      this.props.login.user.mps_view,
    );
    let order_weeks_obj = {
      weeks_array: new_week_arr,
      orders: new_orders_data_with_more_columns,
    };
    this.props.setOrdersAndWeeksData(order_weeks_obj);

    this.setState(
      {
        scroller_toggle_x: false,
        are_more_weeks_in_weeks_array: true,
      },
      () => {
        setTimeout(() => {
          this.setState({
            scroller_toggle_x: true,
            checkStickySideBar: true,
          });
        }, 0);
      },
    );
  };

  checkIfNoVerticalScroll = () => {
    let scroll_element = document.getElementById('calender_container');
    let scroll_height = scroll_element?.scrollHeight;
    var scroll_element_window_height = scroll_element?.offsetHeight;
    let top_div_element = document.getElementById('top_div');
    let rect_y = top_div_element?.getBoundingClientRect();
    let positive_rect_y = Math.abs(rect_y?.top || 0);

    let difference_between_y_axis = scroll_height - positive_rect_y - scroll_element_window_height;
    if (difference_between_y_axis < -100) {
      this.addMoreOrdersWhenScrollDown();
    } else {
    }
  };

  checkIfNoHorizontalScroll = () => {
    let column_wraaper_container = document.getElementById('column__wraaper__container');

    let scroll_element = document.getElementById('calender_container');

    if (column_wraaper_container === null) {
      return;
    }
    let column_wraaper_container_width = column_wraaper_container.offsetWidth;
    if (scroll_element === null) {
      return;
    }
    let scroll_element_window_width = scroll_element.offsetWidth;
    if (scroll_element_window_width > column_wraaper_container_width) {
      this.addWeeksWhenScrollLeft();
    }
  };

  onScroll = async () => {
    this.makeSideAndDatesBarSticky();

    let scroll_element = document.getElementById('calender_container');
    let { dates_arr, scroller_toggle_x, orders_data } = this.state;
    let scroll_width = scroll_element.scrollWidth; //max width of all the scroll container
    // var scroll_element_window_width = scroll_element.offsetWidth;

    //************** for horizontal scroll **************
    let column1_element = document.getElementById('column-1');
    if (column1_element) {
      let rect = column1_element.getBoundingClientRect();
      let current_rect_without_difference = rect.left + 329; // current scroll position - horizontal

      let difference_between_x_axis = scroll_width - current_rect_without_difference; // the  diffrance between max width and the current position of the scroller

      let num = 100;
      if (difference_between_x_axis < num && scroller_toggle_x) {
        this.addWeeksWhenScrollLeft();
      } else if (difference_between_x_axis < num && scroller_toggle_x === false) {
        scroll_element.scrollLeft += 900;
      }
    }
  };

  //for the scroll down! - ****(!)  2

  addMoreOrdersWhenScrollDown = async () => {
    let { are_more_weeks_in_weeks_array } = this.state;
    let { process } = this.props;
    // block the new push
    if (this.props.orders.block || window.location.search) {
      return;
    }
    let get_new_orders_data;
    // let limit_num = orders_per_page;
    // let limit_num = 5;

    let page_num;
    page_num = this.props.orders.page;

    this.setState({
      loadMoreItems: false,
    });

    let page_num_multiplied_with_limit = ORDERS_QUANTITY_START_PAGE + page_num * PAGINATION_LIMIT;
    this.props.setPageNumberForGetOrders(page_num_multiplied_with_limit);

    //if the user use scroll left function - true :
    this.props.upadteLoaderPopup(true);
    let selectedDepartment = this.props.login.selectedDepartment._id;
    let employee_id = this.props.login.selectedManager._id;
    let started = process.show_bids;

    if (are_more_weeks_in_weeks_array) {
      let range_of_dates = findRangOfDatesFromWeeksArr(this.props.orders.weeks_array);
      let new_end_of_week_array = range_of_dates.end;

      get_new_orders_data = await getOrders(
        'XL',
        PAGINATION_LIMIT,
        page_num_multiplied_with_limit,
        '1',
        selectedDepartment,
        employee_id,
        started,
        new_end_of_week_array,
      );
    } else {
      get_new_orders_data = await getOrders(
        'XL',
        PAGINATION_LIMIT,
        page_num_multiplied_with_limit,
        '1',
        selectedDepartment,
        employee_id,
        started,
      );
    }

    if (Object.keys(get_new_orders_data).length === 0) {
      this.props.upadteLoaderPopup(false);
      return; // if the get req not good
    }
    if (Object.keys(get_new_orders_data.orders || {}).length === 0) {
      this.props.upadteLoaderPopup(false);

      //set state that can't scrool more
    } else {
      this.pushOrdersToOrdersArr(get_new_orders_data);
      // this.setState({ api_order_page_num: page_num });   /// check if ok
      //make get req with next page with the same limit
    }
  };

  // scroll down ****(!) 3****
  pushOrdersToOrdersArr = async (get_new_orders_data) => {
    //old orders
    let get_corrent_orders_data_copy = JSON.parse(JSON.stringify(this.props.orders.orders));

    //new orders
    let get_new_orders_data_copy = JSON.parse(JSON.stringify(get_new_orders_data.orders));

    let new_orders_keys = Object.keys(get_new_orders_data_copy);

    for (let order_key of new_orders_keys) {
      get_corrent_orders_data_copy[order_key] = get_new_orders_data_copy[order_key];
    }

    this.setState({
      loadMoreItems: true,
    });

    this.props.upadteLoaderPopup(false);
    this.props.setOrders(get_corrent_orders_data_copy);
  };

  doubleClick = () => {
    document.removeEventListener('mousemove', this.mousePosition);
  };

  mouseDown = () => {
    setTimeout(() => {
      if (this.state.is_drag) {
        return;
      } else {
        document.addEventListener('mousemove', this.mousePosition);
      }
    }, 0);
  };

  mousePosition = (e) => {
    let scroll_element = document.getElementById('calender_container');
    if (e.target.className === 'holiday' || e.target.className === 'holiday__list__title') {
      document.removeEventListener('mousemove', this.mousePosition);
      return;
    }

    if (this.state.is_drag) {
      if (
        e.target.className === 'sc-kgoBCf bNSnpA task__containe' ||
        e.target.className === 'process__data__container' ||
        e.target.className === 'drag__icon'
      ) {
        document.removeEventListener('mousemove', this.mousePosition);
        return;
      }
    }

    if (
      e.target.id === 'calender_container' ||
      e.target.id === 'task__list' ||
      e.target.id === 'side__bar__box'
    ) {
      let scroll_speed = Math.abs(e.movementX) * 3;
      if (e.movementX < 0) {
        scroll_element.scrollLeft += scroll_speed;
      } else {
        scroll_element.scrollLeft -= scroll_speed;
      }
    } else {
      // document.removeEventListener("mousemove", this.mousePosition);
      // return
    }
  };

  mouseUp = () => {
    setTimeout(() => {
      document.removeEventListener('mousemove', this.mousePosition);
    }, 0);

    document.removeEventListener('mousemove', this.mousePosition);
  };

  is_drag_update = (boolean) => {
    this.setState({
      is_drag: boolean,
    });
  };

  render() {
    const { orders_data, empty_screen, loadMoreItems } = this.state;

    const {
      updateWarningMessage,
      updateWarningsArray,
      updateStateForWarningPopup,
      updateOrderData,
      openUpdateMenuPopup,
      updateOrderBefoReposition,
      user_or_order_type,
    } = this.props;

    let width = '';
    let projects__box__container = document.getElementById('projects__box__container');

    if (projects__box__container) {
      let column__wraaper__container = document.getElementById('column__wraaper__container');
      let new_width = column__wraaper__container.offsetWidth + 992;
      column__wraaper__container.style.width = new_width + 'px';
      width = column__wraaper__container.style.width;
    }
    return this.props.orders.loaded || empty_screen ? (
      empty_screen ? (
        <div className="empty_screen_container">
          <div> אנא הוסף לקוח חדש למערכת</div>
        </div>
      ) : (
        <div>
          <Year />
          <div className="background_line" />
          <div
            onMouseDown={this.mouseDown}
            onMouseUp={this.mouseUp}
            onScroll={this.onScroll}
            onDoubleClick={this.doubleClick}
            className="calender__section"
            id="calender_container"
          >
            <InfiniteScroll
              pageStart={0}
              loadMore={this.addMoreOrdersWhenScrollDown}
              hasMore={this.props.orders.block ? false : loadMoreItems}
              useWindow={false}
              getScrollParent={() => document.getElementById('calender_container')}
            >
              <div id="top_div" />
              <div className="top__calender__container" id="top__calender__container">
                <div className="side__bar__titles" id="side__bar">
                  <div className="week__list__title">רשימת שבועות</div>
                  <div className="holiday__list__title">חגים / חופשים</div>
                  <div className="side__bar__buttons">
                    <span>הכל</span>
                    <span>הצעות</span>
                    <span>הזמנות</span>
                  </div>
                </div>

                <Weeks />
              </div>

              <div className="main__box__container">
                <div className="projects__box" id="project__box">
                  {Object.keys(this.props.orders.orders).map((p, i) => (
                    <DragAndDrop
                      is_drag_update={this.is_drag_update}
                      updateOrderBefoReposition={updateOrderBefoReposition}
                      width={width}
                      openUpdateMenuPopup={openUpdateMenuPopup}
                      order_befor_reposition={this.state.order_befor_reposition}
                      updateWarningsArray={updateWarningsArray}
                      updateWarningMessage={updateWarningMessage}
                      updateStateForWarningPopup={updateStateForWarningPopup}
                      upadteLoader={this.upadteLoader}
                      updateOrderData={updateOrderData}
                      updateOrderDataInTheFirstDrag={this.updateOrderDataInTheFirstDrag}
                      dates_arr={this.props.orders.weeks_array}
                      id={p.order_id}
                      key={uniqid()}
                      order={p}
                      zIndex={orders_data.length + 40 + i}
                      mpsView={this.props.login.user ? this.props.login.user.mps_view : null}
                      user_or_order_type={user_or_order_type}
                    />
                  ))}
                </div>
              </div>
            </InfiniteScroll>
          </div>
        </div>
      )
    ) : (
      <div className="loader">
        <Loader />
      </div>
    );
  }
}

function mapStateToProps({ router, orders, login, process }) {
  return { router, orders, login, process };
}

export default withRouter(connect(mapStateToProps, actions)(Calender));
