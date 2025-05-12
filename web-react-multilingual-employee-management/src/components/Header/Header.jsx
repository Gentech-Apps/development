import React, { Component } from 'react';
import '../../sass/header/header.scss';
import ReservationPopup from './Parts/ReservationPopup/ReservationPopup';
import { polyfill } from 'es6-promise';
import { connect } from 'react-redux';
import * as actions from '../../actions/actions';
import { withRouter } from 'react-router-dom';
import { appGetOrders, getOrders, getSearchAutoComplete } from '../../functions/api/orders';
import { CSVLink } from 'react-csv';
import {
  getFavoriteProcessSteps,
  getProcessSteps,
  getOrderInputForPopup,
  getSalesAndProjectManager,
  getUsersByFactoryId,
} from '../../functions/api/popup';
import { BrowserRouter as Router, Link } from 'react-router-dom';
import ErrorPopup from '../NavBar/ErrorPopup/ErrorPopup';
import csv_icon from '../../images/general/newExcel.svg';
import InfiniteScroll from 'react-infinite-scroller';
import Checkbox from '@material-ui/core/Checkbox';
import CheckBoxOutlineBlankIcon from '@material-ui/icons/CheckBoxOutlineBlank';
import CheckBoxIcon from '@material-ui/icons/CheckBox';
import { withStyles } from '@material-ui/core/styles';
import { PER_USER, VIEW_ONLY } from '../../tools/keys/variables';
import { mobileMaxWidth } from '../../constants/responsive-pop-up';
import { ORDERS_QUANTITY_START_PAGE } from '../../constants/orders-pagination';
import { getSearchAutoCompleteCustomer } from '../../functions/api/customer-page';
import { getCustomerInfoById } from '../../actions/actions';

polyfill();

const CustomCheckbox = withStyles({
  root: {
    color: '#0091ff',
    padding: '4px',
    '&$checked': {
      color: '#0091ff',
    },
  },
  checked: {},
})((props) => <Checkbox color="default" {...props} />);

const CUSTOMERS_PAGE = 'customers-table';
const CUSTOMER_PAGE_BY_ID = 'customers-page';
const TASKS_REPORT = 'tasks-report';

class Header extends Component {
  constructor() {
    super();
    this.state = {
      selected: '',
      showPopup: false,
      show_error_popup: false,
      error_text: '',
      last_value: '',
      value: window.location.search
        ? decodeURI(window.location.search.replace('?order_number=', ''))
        : '',
      steps_process_from_db: [],
      favorite_steps_process_from_db: [],
      get_order_input_popup: [],
      show_managers: false,
      selected_manager_drop_down: '',
      sales_managers_from_db: [],
      project_managers_from_db: [],
      auto_complete_arr: [],
      show_auto_complete: false,
      auto_complete_page: 0,
      loadMoreaAutoComplete: false,
      auto_comp_value: '',
      show_reports: false,
      selected_report_page: '',
      first_enter: true,
      showResources: false,
      selectedResourceDropDown: '',
      resources: [],
      mobile: window.innerWidth <= mobileMaxWidth,
    };
  }

  upadePopup = () => {
    this.props.setOrderIdForPopup('');
    this.props.resetPopupData();
  };

  togglePopup = (boolean) => {
    this.props.showMainPopup(boolean);
  };

  handleClickOutside = (event) => {
    if (
      this.wrapperRefManager &&
      !this.wrapperRefManager.contains(event.target) &&
      event.target.id !== 'header__project__manager' &&
      event.target.id !== 'manager__header__tab' &&
      event.target.className !== 'fas fa-sort-up'
    ) {
      this.setState({ show_managers: false });
    }

    if (
      this.wrapperRefUser &&
      !this.wrapperRefUser.contains(event.target) &&
      event.target.id !== 'resources_select' &&
      event.target.id !== 'user__header__tab' &&
      event.target.className !== 'fas fa-sort-up'
    ) {
      this.setState({ showResources: false });
    }

    if (this.wrapperRef && !this.wrapperRef.contains(event.target)) {
      this.setState({
        auto_complete_arr: [],
        show_auto_complete: false,
        auto_complete_page: 0,
        loadMoreaAutoComplete: false,
      });
    }

    if (
      this.wrapperRefReports &&
      !this.wrapperRefReports.contains(event.target) &&
      event.target.className !== 'reports__dropdown' &&
      event.target.className !== 'fas fa-sort-up'
    ) {
      this.setState({ show_reports: false });
    }
  };

  setWrapperRef = (node) => {
    this.wrapperRef = node;
  };

  setWrapperRefManager = (node) => {
    this.wrapperRefManager = node;
  };

  setWrapperRefUser = (node) => {
    this.wrapperRefUser = node;
  };

  setWrapperRefReports = (node) => {
    this.wrapperRefReports = node;
  };

  handleResize = (e) => {
    this.setState({ mobile: window.innerWidth <= mobileMaxWidth });
  };

  componentWillUnmount() {
    window.removeEventListener('resize', this.changeLocationWhenMobile);
    window.removeEventListener('resize', this.handleResize);
    window.removeEventListener('mousedown', this.handleClickOutside);
  }

  changeLocationWhenMobile = () => {
    const dynamicFactoryName = this.props.login.user.factory_name;
    if (window.innerWidth <= 800) {
      let location_for_redirect = this.findLocationPath();
      if (
        (!location_for_redirect.includes(`/${dynamicFactoryName}/monthly-resources`) &&
          location_for_redirect.includes(`/${dynamicFactoryName}/monthly`)) ||
        location_for_redirect.includes(`/${dynamicFactoryName}/daily`)
      ) {
        return;
      } else {
        let redirect = `/${dynamicFactoryName}/monthly/${new Date()}`;
        this.props.history.push(redirect);
      }
    }
  };

  componentDidMount = async () => {
    let { first_enter } = this.state;

    window.addEventListener('resize', this.changeLocationWhenMobile);
    window.addEventListener('resize', this.handleResize);
    this.handleResize();

    if (window.innerWidth <= 800) {
      if (first_enter) {
        this.changeLocationWhenMobile();
        this.setState({
          first_enter: false,
        });
      }
    }

    document.addEventListener('mousedown', this.handleClickOutside);

    //for popup component:
    let process_steps_data = await getProcessSteps();

    if (process_steps_data.length > 0) {
      this.setState({
        steps_process_from_db: process_steps_data,
      });
    } else {
      this.setState({
        steps_process_from_db: [],
      });
    }

    let get_favorite_process_steps = await getFavoriteProcessSteps();
    if (get_favorite_process_steps.length > 0 && get_favorite_process_steps[0].stages.length > 0) {
      this.setState({
        favorite_steps_process_from_db: get_favorite_process_steps[0].stages,
      });
    } else {
      this.setState({
        favorite_steps_process_from_db: [],
      });
    }

    let get_order_input_popup = await getOrderInputForPopup();
    if (get_order_input_popup.length > 0) {
      this.setState({
        get_order_input_popup,
      });
    } else {
      this.setState({
        get_order_input_popup: [],
      });
    }

    //project and salses menagers:
    let sales_and_project_manager_data = await getSalesAndProjectManager();
    let filter_project_manager;
    let filter_sales_managers;

    if (sales_and_project_manager_data.length > 0) {
      filter_project_manager = sales_and_project_manager_data.filter((m) => m.project_manager);
      filter_sales_managers = sales_and_project_manager_data.filter((m) => m.full == 'נציג מכירות');
    }

    if (filter_sales_managers) {
      if (filter_sales_managers.length > 0) {
        this.setState({
          sales_managers_from_db: filter_sales_managers[0].employees,
        });
      } else {
        this.setState({
          sales_managers_from_db: [],
        });
      }
    } else {
      this.setState({
        sales_managers_from_db: [],
      });
    }

    if (filter_project_manager) {
      if (filter_project_manager.length > 0) {
        this.setState({
          project_managers_from_db: filter_project_manager[0].employees,
        });
      } else {
        this.setState({
          project_managers_from_db: [],
        });
      }
    } else {
      this.setState({
        project_managers_from_db: [],
      });
    }

    let res = await getUsersByFactoryId(this.props.login.user.factory_id);
    if (res && res.length > 0) {
      this.props.setResources(res);
      this.setState({ resources: res });
    }

    this.setState({ currentLocation: this.props.location.pathname });
  };

  componentDidUpdate(prevProps, prevState) {
    if (prevProps.location.pathname !== this.props.location.pathname) {
      this.findLocationPath();
    }

    if (prevProps.route.route_location !== this.props.route.route_location) {
      this.findLocationPath();
    }

    if (prevProps.alertPopup.show_popup !== this.props.alertPopup.show_popup) {
      if (this.props.alertPopup.show_popup) {
        this.updateErrorPopup(true, this.props.alertPopup.alert_message);

        //Reset the popup for reuse:
        this.props.alertPopupToggle(false);
      }
    }

    if (prevProps.location.pathname !== this.props.location.pathname) {
      this.setState({ currentLocation: this.props.location.pathname });
    }

    const { autocompleteOptions } = this.props.customersPage;
    const { autocompleteOptions: prevAutocompleteOptions } = prevProps.customersPage;
    if (autocompleteOptions && autocompleteOptions !== prevAutocompleteOptions) {
      this.setState({
        auto_complete_arr: autocompleteOptions,
        show_auto_complete: autocompleteOptions.length ? true : false,
      });
    }

    const { tasksAutocompleteOptions } = this.props.taskReports;
    const { tasksAutocompleteOptions: prevTasksAutocompleteOptions } = prevProps.taskReports;
    if (tasksAutocompleteOptions && tasksAutocompleteOptions !== prevTasksAutocompleteOptions) {
      this.setState({
        auto_complete_arr: tasksAutocompleteOptions,
        show_auto_complete: tasksAutocompleteOptions.length ? true : false,
      });
    }
  }

  findLocationPath = () => {
    let location_path = window.location.pathname;
    location_path = decodeURIComponent(location_path);

    //dynamic url factory name
    const dynamicFactoryName = this.props.login.user.factory_name;

    if (location_path.includes(`/${dynamicFactoryName}/yearly`)) {
      this.setState({
        selected: 'תוכנית שנתית',
        selected_report_page: '',
      });
    } else if (location_path.includes(`/${dynamicFactoryName}/monthly-resources`)) {
      this.setState({
        selected: 'חודשית משאבים',
        selected_report_page: '',
      });
    } else if (location_path.includes(`/${dynamicFactoryName}/monthly`)) {
      this.setState({
        selected: 'תוכנית חודשית',
        selected_report_page: '',
      });
    } else if (location_path.includes(`/${dynamicFactoryName}/weekly`)) {
      this.setState({
        selected: 'תוכנית שבועית',
        selected_report_page: '',
      });
    } else if (location_path.includes(`/${dynamicFactoryName}/daily-vertical-processes`)) {
      this.setState({
        selected: 'משאבים',
      });
    } else if (location_path.includes(`/${dynamicFactoryName}/daily`)) {
      this.setState({
        selected: 'תוכנית יומית',
        selected_report_page: '',
      });
    } else if (location_path.includes(`/${dynamicFactoryName}/bids`)) {
      this.setState({
        selected: 'דוחות',
      });
    } else if (location_path.includes(`/${dynamicFactoryName}/general-review`)) {
      this.setState({
        selected: 'דוחות',
      });
    } else if (
      location_path.includes(`/${dynamicFactoryName}/backlogs`) ||
      location_path.includes(`/${dynamicFactoryName}/year-financial-chart`) ||
      location_path.includes(`/${dynamicFactoryName}/year-workload-chart`) ||
      location_path.includes(`/${dynamicFactoryName}/month-workload-chart`) ||
      location_path.includes(`/${dynamicFactoryName}/tasks-report`) ||
      location_path.includes(`/${dynamicFactoryName}/reports`) ||
      location_path.includes(`/${dynamicFactoryName}/ongoing-orders`)
    ) {
      this.setState({
        selected: 'דוחות',
      });
    } else if (location_path.includes(`/${dynamicFactoryName}/${CUSTOMERS_PAGE}`)) {
      this.setState({
        selected: 'CUSTOMERS_PAGE',
      });
    }

    return location_path;
  };

  handleChange = async (value) => {
    const { auto_complete_arr, show_auto_complete, searchValue, currentLocation } = this.state;

    if (this.doesCurrentLocationInclude(TASKS_REPORT)) {
      if (!value) {
        this.props.setValueForTasksReportFiltering(value);
        this.props.setQueryForTasksReportAutocomplete(value);
      } else {
        this.props.setQueryForTasksReportAutocomplete(value);
        this.setState({
          auto_complete_arr,
          show_auto_complete,
        });
      }
      this.setState({ value });
    } else {
      this.setState({
        value,
        auto_complete_page: 0,
      });

      if (value === '') {
        this.props.history.push(window.location.pathname);

        this.setState({
          auto_complete_arr: [],
          show_auto_complete: false,
          auto_complete_page: 0,
          loadMoreaAutoComplete: false,
        });
      }

      if (value !== this.state.value && value.toString().trim() != '') {
        setTimeout(async () => {
          this.autoCompleteSearch(value);
        }, 0);
      }
    }
  };

  autoCompleteSearch = async (value, is_scroll = false, is_customer_table = false) => {
    const { auto_complete_page, auto_complete_arr, loadMoreaAutoComplete } = this.state;
    const limit = 20;
    let result_auto_comp;
    if (value === this.state.value) {
      if (
        this.doesCurrentLocationInclude(CUSTOMERS_PAGE) ||
        this.doesCurrentLocationInclude(CUSTOMER_PAGE_BY_ID)
      ) {
        result_auto_comp = await getSearchAutoCompleteCustomer(
          auto_complete_page,
          value.toString().trim(),
          limit,
        );
      } else {
        result_auto_comp = await getSearchAutoComplete(
          auto_complete_page,
          value.toString().trim(),
          limit,
        );
      }

      if (result_auto_comp.ok && result_auto_comp.result.length > 0 && auto_complete_page === 0) {
        this.setState({
          auto_complete_arr: is_scroll
            ? Object.entries(
                [...this.state.auto_complete_arr, ...result_auto_comp.result].reduce(
                  (prev, current) => {
                    prev[current._id] = current;
                    return prev;
                  },
                  {},
                ),
              ).map(([key, value]) => value)
            : result_auto_comp.result,
          show_auto_complete: true,
          auto_complete_page: is_scroll ? auto_complete_page + limit : auto_complete_page,
          auto_comp_value: result_auto_comp.result[0].order_number,
        });

        if (result_auto_comp.result.length < limit) {
          this.setState({
            loadMoreaAutoComplete: false,
          });
        } else {
          this.setState({
            loadMoreaAutoComplete: true,
          });
        }
      } else if (
        result_auto_comp.ok &&
        result_auto_comp.result.length > 0 &&
        auto_complete_page > 0
      ) {
        this.setState({
          auto_complete_arr: result_auto_comp.result,
          auto_complete_page: auto_complete_page + limit,
          loadMoreaAutoComplete: true,
        });
      } else if (
        !result_auto_comp.ok ||
        (result_auto_comp.result.length === 0 && auto_complete_page === 0)
      ) {
        this.setState({
          auto_complete_arr: [],
          show_auto_complete: false,
          auto_complete_page: 0,
          loadMoreaAutoComplete: false,
        });
      }
    }
  };

  loadMoreaAutoCompleteSearch = () => {
    const { value, loadMoreaAutoComplete } = this.state;
    this.setState(
      {
        loadMoreaAutoComplete: !loadMoreaAutoComplete,
      },
      () => {
        this.autoCompleteSearch(value, true);
      },
    );
  };

  cleanSearch = async () => {
    const {
      orders,
      setValueForCustomersFiltering,
      setQueryForAutocomplete,
      setValueForTasksReportFiltering,
      setQueryForTasksReportAutocomplete,
    } = this.props;
    this.props.updateMonthResourceApi({ orderNumber: '' });
    if (
      this.doesCurrentLocationInclude(CUSTOMERS_PAGE) ||
      this.doesCurrentLocationInclude(CUSTOMER_PAGE_BY_ID)
    ) {
      this.setState({ value: '' }, (value) => {
        setValueForCustomersFiltering(value);
        setQueryForAutocomplete(value);
      });
    } else if (this.doesCurrentLocationInclude(TASKS_REPORT)) {
      this.setState({ value: '' }, (value) => {
        setValueForTasksReportFiltering(value);
        setQueryForTasksReportAutocomplete(value);
      });
    } else {
      this.props.history.push(window.location.pathname);
      this.setState({
        value: '',
        show_auto_complete: false,
        auto_comp_value: '',
        auto_complete_arr: [],
      });
      this.props.upadteLoaderPopup(true);
      let selectedDepartment = this.props.login.selectedDepartment._id;
      let employee_id = this.props.login.selectedManager;
      let started = '';
      let orders_data = await getOrders(
        'XL',
        orders.order_per_page,
        '0',
        '1',
        selectedDepartment,
        employee_id,
        started,
      );
      if (orders_data.orders.length === 0 || Object.keys(orders_data).length === 0) {
        this.props.upadteLoaderPopup(false);
        //show empty screen
        return;
      } else {
        this.props.upadteLoaderPopup(false);
        this.props.setPageNumberForGetOrders(0);
        this.props.setOrdersAndWeeksData(orders_data); //send to redux!!   or to call addOrder() to add order to the array
      }
    }
  };

  doesCurrentLocationInclude = (path) => {
    const currentLocation = this.state?.currentLocation || window.location.href;
    return currentLocation.includes(path);
  };

  initSearch = async () => {
    const { value, auto_comp_value } = this.state;
    let employee_id = this.props.login.selectedManager;
    if (value) {
      if (
        this.doesCurrentLocationInclude(CUSTOMERS_PAGE) ||
        this.doesCurrentLocationInclude(CUSTOMER_PAGE_BY_ID)
      ) {
        this.props.setValueForCustomersFiltering(value);
      } else if (this.doesCurrentLocationInclude(TASKS_REPORT)) {
        this.props.setValueForTasksReportFiltering(value);
      } else {
        let new_value = value;
        if (auto_comp_value) {
          new_value = auto_comp_value;
        }
        this.props.history.push(window.location.pathname + '?order_number=' + new_value);
        this.props.upadteLoaderPopup(true);
        if (new_value) {
          this.props.updateMonthResourceApi({ orderNumber: new_value });
        }
        if (this.props.process.show_bids) {
          //cancle the bids checkbox!
          this.props.bidsToggle();
        }

        let selectedDepartment = this.props.login.selectedDepartment._id;
        let started = '';
        let search_orders = await appGetOrders(
          '',
          '',
          'XL',
          new_value,
          selectedDepartment,
          employee_id,
          started,
          '',
        );

        // if no orders value in the system
        if (Object.keys(search_orders).length === 0 || search_orders.orders.length === 0) {
          this.props.upadteLoaderPopup(false);
          let error_text = 'ההזמנה לא קיימת במערכת';
          this.updateErrorPopup(true, error_text);
          this.props.history.push(window.location.pathname);
        } else {
          this.props.upadteLoaderPopup(false);
          this.props.setOrdersAndWeeksData(search_orders, true);
        }
      }
    } else {
      this.props.cancelBlock();
      this.cleanSearch();
      this.props.history.push(window.location.pathname);
    }
  };

  clickOrderSearch = (order_num) => {
    this.setState(
      {
        value: order_num,
        show_auto_complete: false,
        auto_complete_arr: [],
        auto_complete_page: 0,
        auto_comp_value: order_num,
      },
      () => {
        this.initSearch();
      },
    );
  };

  clickCustomerSearch = (customer_id, customer_name) => {
    if (this.doesCurrentLocationInclude(CUSTOMER_PAGE_BY_ID)) {
      this.setState(
        {
          value: customer_name,
          show_auto_complete: false,
          auto_complete_arr: [],
          auto_complete_page: 0,
          auto_comp_value: customer_id,
        },
        () => {
          let old_id = window.location.pathname.substring(
            window.location.pathname.lastIndexOf('/') + 1,
          );
          this.props.history.push(window.location.pathname.replace(old_id, customer_id));
          this.props.match.params.customerIdentifier = customer_id;
        },
      );
    } else if (this.doesCurrentLocationInclude(CUSTOMERS_PAGE)) {
      this.setState(
        {
          value: customer_name,
          show_auto_complete: false,
          auto_complete_arr: [],
          auto_complete_page: 0,
          auto_comp_value: customer_id,
        },
        () => {
          this.initSearch();
        },
      );
    }
  };

  showErorrPopup = (boolean) => {
    this.setState({
      show_error_popup: boolean,
    });
  };

  updateErrorPopup = (boolean, error_text, isUpdateCall = false) => {
    this.setState({
      show_error_popup: boolean,
      error_text: error_text,
    });
    //automaticly scroll to top on daily view after adding new order
    if (this.props?.location?.pathname?.includes?.(`/yearly`)) {
      const calendar = document.getElementById('calender_container');
      if (calendar) {
        !isUpdateCall && calendar.scrollTo(0, 0);
      }
    }
  };

  enterKeyPress = (event) => {
    event.preventDefault();
    if (event.keyCode === 13) {
      document.getElementById('search_button').click();
    }
  };

  searchBarClick = (boolean) => {
    const { value, show_auto_complete } = this.state;
    let search_filed = document.getElementById('search__filed');
    if (boolean) {
      // if value - search auto coplete is on!
      if (
        value.toString().trim() != '' &&
        !this.doesCurrentLocationInclude(CUSTOMERS_PAGE) &&
        !this.doesCurrentLocationInclude(TASKS_REPORT)
      ) {
        this.autoCompleteSearch(value.toString().trim());
      }

      search_filed.addEventListener('keyup', this.enterKeyPress);
    } else {
      search_filed.removeEventListener('keydown', this.enterKeyPress);
    }
  };

  selectYearly = () => {
    this.setState({ selected: 'תוכנית שנתית' });
  };

  toggleManagers = () => {
    this.setState({
      show_managers: !this.state.show_managers,
    });
  };

  selectManager = (manager) => {
    const { saveSelectedManager } = this.props;
    if (manager) {
      saveSelectedManager(manager);
      this.setState({
        selected_manager_drop_down: manager.full_name,
      });
    } else {
      this.setState({
        selected_manager_drop_down: '',
      });
      saveSelectedManager('');
    }
    this.toggleManagers();
  };

  toggleResources = () => {
    this.setState({
      showResources: !this.state.showResources,
    });
  };

  selectResource = (resource) => {
    const { saveSelectedResource } = this.props;
    if (resource) {
      saveSelectedResource(resource._id);
      this.setState({
        selectedResourceDropDown: resource.full_name,
      });
    } else {
      saveSelectedResource('');
      this.setState({
        selectedResourceDropDown: '',
      });
    }
    this.toggleResources();
  };

  handleCheckbox = () => {
    this.props.upadteLoaderPopup(true);
    setTimeout(() => {
      this.props.firstUncompleteProcessToggle();
    }, 100);
  };

  handleBidsCheckbox = () => {
    this.props.upadteLoaderPopup(true);
    setTimeout(() => {
      this.props.bidsToggle();
    }, 100);
    this.props.upadteLoaderPopup(false);
  };

  toggleReports = () => {
    const { show_reports } = this.state;
    this.setState({
      show_reports: !show_reports,
    });
  };

  render() {
    const {
      selected,
      value,
      show_error_popup,
      error_text,
      steps_process_from_db,
      favorite_steps_process_from_db,
      get_order_input_popup,
      auto_complete_arr,
      show_auto_complete,
      show_managers,
      sales_managers_from_db,
      project_managers_from_db,
      selected_manager_drop_down,
      loadMoreaAutoComplete,
      show_reports,
      selected_report_page,
      // -------------
      showResources,
      selectedResourceDropDown,
      resources,
      mobile,
    } = this.state;

    const { mainPopup, login } = this.props;

    let search = window.location.search;
    if (!search) search = '';

    // set or selelected employee or "select employee " for screen space saving (there are too much items in header )
    let selected_manager_display_by_device = selected_manager_drop_down || `מנהל פרויקט`;
    let selectedResourceDisplayByDevice = selectedResourceDropDown || `שם עובד`;

    let urlToAdd = window.location.pathname.substr(window.location.pathname.lastIndexOf('/') + 1);

    let compareableData = new Date(decodeURIComponent(urlToAdd));
    if (compareableData instanceof Date && !isNaN(compareableData)) {
    } else {
      urlToAdd = false;
    }

    //dynamic url factory name
    const dynamicFactoryName = this.props.login.user.factory_name;

    return (
      <div className="header__line">
        {show_managers && mobile ? (
          <div className="managers__drop__down" onClick={() => this.toggleManagers()}>
            <ul id={show_managers ? 'manager__dropdown__active' : 'manager__dropdown__off'}>
              {project_managers_from_db.map((m) => (
                <li
                  id={login.selectedManager === m._id ? 'active__dropdown__tab' : null}
                  onClick={() => this.selectManager(m)}
                >
                  {m.full_name}
                </li>
              ))}
              <li
                id={login.selectedManager === '' ? 'active__dropdown__tab' : null}
                onClick={() => this.selectManager(false)}
              >
                הכל
              </li>
            </ul>
          </div>
        ) : null}

        {show_error_popup ? (
          <ErrorPopup afterConfirmationError={error_text} updatePopup={this.showErorrPopup} />
        ) : null}
        <div className="header__tabs">
          <Link
            style={
              this.props.login.user.privileges.includes(PER_USER) ||
              this.props.login.user.privileges.includes(VIEW_ONLY)
                ? {
                    color: 'currentColor',
                    cursor: 'not-allowed',
                    opacity: 0.5,
                    textDecoration: 'none',
                  }
                : null
            }
            onMouseOver={(e) => {
              e.target.style.color =
                (this.props.login.user.privileges.includes(PER_USER) ||
                  this.props.login.user.privileges.includes(VIEW_ONLY)) &&
                'currentColor';
            }}
            to={
              this.props.login.user.privileges.includes(PER_USER) ||
              this.props.login.user.privileges.includes(VIEW_ONLY)
                ? '#'
                : `/${dynamicFactoryName}/yearly${search}`
            }
          >
            {' '}
            <div
              id={
                selected === 'תוכנית שנתית' &&
                (!this.props.login.user.privileges.includes(PER_USER) ||
                  !this.props.login.user.privileges.includes(VIEW_ONLY))
                  ? 'header__selected'
                  : null
              }
              onClick={() =>
                this.props.login.user.privileges.includes(PER_USER) ||
                this.props.login.user.privileges.includes(VIEW_ONLY)
                  ? null
                  : this.selectYearly
              }
            >
              תוכנית שנתית
            </div>
          </Link>
          <Link
            to={
              urlToAdd
                ? `/${dynamicFactoryName}/monthly/${urlToAdd + search}`
                : `/${dynamicFactoryName}/monthly${search}`
            }
          >
            <div
              id={selected === 'תוכנית חודשית' ? 'header__selected' : null}
              onClick={() => this.setState({ selected: 'תוכנית חודשית' })}
            >
              תוכנית חודשית
            </div>
          </Link>
          <Link
            to={
              urlToAdd
                ? `/${dynamicFactoryName}/weekly/${urlToAdd + search}`
                : `/${dynamicFactoryName}/weekly${search}`
            }
          >
            <div
              id={selected === 'תוכנית שבועית' ? 'header__selected' : null}
              onClick={() => this.setState({ selected: 'תוכנית שבועית' })}
            >
              תוכנית שבועית
            </div>
          </Link>
          <Link
            to={
              urlToAdd
                ? `/${dynamicFactoryName}/daily/${urlToAdd + search}`
                : `/${dynamicFactoryName}/daily${search}`
            }
          >
            <div
              id={selected === 'תוכנית יומית' ? 'header__selected' : null}
              onClick={() => this.setState({ selected: 'תוכנית יומית' })}
            >
              <span className="daily__header__tab"> תוכנית יומית</span>
            </div>
          </Link>
          {/* daily vertical view */}
          {!mobile ? (
            <Link
              style={
                this.props.login.user.privileges.includes(PER_USER) ||
                this.props.login.user.privileges.includes(VIEW_ONLY)
                  ? {
                      color: 'currentColor',
                      cursor: 'not-allowed',
                      opacity: 0.5,
                      textDecoration: 'none',
                    }
                  : null
              }
              onMouseOver={(e) => {
                e.target.style.color =
                  (this.props.login.user.privileges.includes(PER_USER) ||
                    this.props.login.user.privileges.includes(VIEW_ONLY)) &&
                  'currentColor';
              }}
              to={
                this.props.login.user.privileges.includes(PER_USER) ||
                this.props.login.user.privileges.includes(VIEW_ONLY)
                  ? '#'
                  : `/${dynamicFactoryName}/daily-vertical-processes${search}`
              }
            >
              {' '}
              <div
                id={
                  selected === 'משאבים' &&
                  (!this.props.login.user.privileges.includes(PER_USER) ||
                    !this.props.login.user.privileges.includes(VIEW_ONLY))
                    ? 'header__selected'
                    : null
                }
                onClick={() =>
                  this.props.login.user.privileges.includes(PER_USER) ||
                  this.props.login.user.privileges.includes(VIEW_ONLY)
                    ? null
                    : this.setState({ selected: 'משאבים' })
                }
              >
                משאבים
              </div>
            </Link>
          ) : null}
          {/* monthly resource view */}
          {!mobile ? (
            <Link
              style={
                this.props.login.user.privileges.includes(PER_USER) ||
                this.props.login.user.privileges.includes(VIEW_ONLY)
                  ? {
                      color: 'currentColor',
                      cursor: 'not-allowed',
                      opacity: 0.5,
                      textDecoration: 'none',
                    }
                  : null
              }
              onMouseOver={(e) => {
                e.target.style.color =
                  (this.props.login.user.privileges.includes(PER_USER) ||
                    this.props.login.user.privileges.includes(VIEW_ONLY)) &&
                  'currentColor';
              }}
              to={
                this.props.login.user.privileges.includes(PER_USER) ||
                this.props.login.user.privileges.includes(VIEW_ONLY)
                  ? '#'
                  : urlToAdd
                  ? `/${dynamicFactoryName}/monthly-resources/${urlToAdd + search}`
                  : `/${dynamicFactoryName}/monthly-resources${search}`
              }
            >
              {' '}
              <div
                id={
                  selected === 'חודשית משאבים' &&
                  (!this.props.login.user.privileges.includes(PER_USER) ||
                    this.props.login.user.privileges.includes(VIEW_ONLY))
                    ? 'header__selected'
                    : null
                }
                onClick={() =>
                  this.props.login.user.privileges.includes(PER_USER) ||
                  this.props.login.user.privileges.includes(VIEW_ONLY)
                    ? null
                    : this.setState({ selected: 'חודשית משאבים' })
                }
              >
                חודשית משאבים
              </div>
            </Link>
          ) : null}

          {/* reports tab bar --- new*/}
          {!mobile ? (
            <Link className="reports__header__tab" to={`/${dynamicFactoryName}/backlogs`}>
              <div
                id={selected === 'דוחות' ? 'header__selected' : null}
                onClick={() => this.setState({ selected: 'דוחות' })}
              >
                <span className="daily__header__tab"> דוחות</span>
              </div>
            </Link>
          ) : null}

          {!this.props.login.user.privileges.includes(PER_USER) && !mobile ? (
            <Link
              style={
                this.props.login.user.privileges.includes(PER_USER)
                  ? {
                      color: 'currentColor',
                      cursor: 'not-allowed',
                      opacity: 0.5,
                      'text-decoration': 'none',
                    }
                  : null
              }
              to={`/${dynamicFactoryName}/customers-table`}
            >
              {' '}
              <div
                id={
                  selected === 'CUSTOMERS_PAGE' &&
                  !this.props.login.user.privileges.includes(PER_USER)
                    ? 'header__selected'
                    : null
                }
                onClick={() => this.setState({ selected: 'CUSTOMERS_PAGE' })}
              >
                <span className="daily__header__tab">לקוחות</span>
              </div>
            </Link>
          ) : null}

          {/* ---------------------------------------------------------------------------------------- */}

          <div className="div_with_auto_margin" style={{ padding: '12px 0' }}></div>
          <span className="header__boundary__line"></span>
          {/* ------------------------------- RESOURCES ----------------------------------------------------------------------------------------- */}
          {!this.props.login.user.privileges.includes(PER_USER) &&
            !(selected === 'תוכנית שנתית' || selected === 'דוחות') && (
              <div id="resources_select" onClick={this.toggleResources}>
                <div className="daily__header__tab" id="daily__header__tab__manager">
                  <div id="user__header__tab">{selectedResourceDropDown || `שם עובד`}</div>
                  {showResources ? (
                    <i className="fas fa-sort-up"></i>
                  ) : (
                    <i className="fas fa-sort-down"></i>
                  )}
                </div>
                {!mobile ? (
                  <ul
                    id={
                      showResources
                        ? 'resource__dropdown__desktop__active'
                        : 'resource__dropdown__desktop__off'
                    }
                    ref={this.setWrapperRefUser}
                  >
                    {resources.map((r) => (
                      <li
                        key={r._id}
                        id={login.selectedUser === r._id ? 'active__dropdown__tab' : null}
                        onClick={() => this.selectResource(r)}
                      >
                        {r.full_name}
                      </li>
                    ))}
                    <li
                      id={login.selectedUser === '' ? 'active__dropdown__tab' : null}
                      onClick={() => this.selectResource(false)}
                    >
                      הכל
                    </li>
                  </ul>
                ) : null}
              </div>
            )}
          {/* ---------------------------------------------------------------------------------------------------------------------------------------------- */}

          <div id="header__project__manager" onClick={() => this.toggleManagers()}>
            <div className="daily__header__tab" id="daily__header__tab__manager">
              <div id="manager__header__tab">{selected_manager_drop_down || `מנהל פרויקט`}</div>
              {show_managers ? (
                <i className="fas fa-sort-up"></i>
              ) : (
                <i className="fas fa-sort-down"></i>
              )}
            </div>
            {!mobile ? (
              <ul
                ref={this.setWrapperRefManager}
                id={
                  show_managers
                    ? 'manager__dropdown__desktop__active'
                    : 'manager__dropdown__desktop__off'
                }
              >
                {project_managers_from_db.map((m) => (
                  <li
                    key={m._id}
                    id={login.selectedManager._id === m._id ? 'active__dropdown__tab' : null}
                    onClick={() => this.selectManager(m)}
                  >
                    {m.full_name}
                  </li>
                ))}
                <li
                  id={login.selectedManager === '' ? 'active__dropdown__tab' : null}
                  onClick={() => this.selectManager(false)}
                >
                  הכל
                </li>
              </ul>
            ) : null}
          </div>
          {selected === 'תוכנית שנתית' || selected === 'תוכנית חודשית' ? (
            <div className="header__checkbox">
              <CustomCheckbox
                checked={this.props.process.show_first_uncomplete_process}
                size="small"
                value="small"
                icon={<CheckBoxOutlineBlankIcon fontSize="small" />}
                checkedIcon={<CheckBoxIcon fontSize="small" />}
                onChange={() => {
                  this.handleCheckbox();
                }}
              />
              <p>{'שלב נוכחי'}</p>
            </div>
          ) : null}

          {selected === 'תוכנית שנתית' ||
          selected === 'תוכנית חודשית' ||
          selected === 'תוכנית שבועית' ? (
            <div className="bids__checkbox">
              <CustomCheckbox
                checked={this.props.process.show_bids}
                size="small"
                value="small"
                icon={<CheckBoxOutlineBlankIcon fontSize="small" />}
                checkedIcon={<CheckBoxIcon fontSize="small" />}
                onChange={() => {
                  this.handleBidsCheckbox();
                }}
              />
              <p>{'הזמנות בלבד'}</p>
            </div>
          ) : null}
          {/* </div> */}
        </div>

        <div className="search__filed__add__client">
          <div>
            {selected === 'תוכנית שנתית' ||
            selected === 'תוכנית יומית' ||
            selected === 'הצעות מחיר' ||
            selected === 'סקירה כללית' ||
            selected === 'דו״חות' ? (
              ' '
            ) : (
              <div className="csv__button">
                <CSVLink
                  data={this.props.csv.data}
                  headers={this.props.csv.headers}
                  filename={this.props.csv.filename}
                >
                  <img className="csv__icon" src={csv_icon} alt="csv icon"></img>
                </CSVLink>
              </div>
            )}
          </div>

          <div className="search__filed" id="search__filed">
            <div className="search__icon">
              <i
                id="search_button"
                className="fas fa-search"
                onClick={() => {
                  this.initSearch();
                }}
              ></i>
            </div>
            <div className="search__input">
              <input
                className="search__input__filed"
                type="text"
                placeholder="חיפוש חופשי"
                value={value}
                onChange={(e) => {
                  this.handleChange(e.target.value);
                }}
              ></input>
            </div>
            {value !== '' ? (
              <div
                className="clean__search"
                onClick={(e) => {
                  e.stopPropagation();
                  this.cleanSearch();
                }}
              >
                <i className="fas fa-times"></i>
              </div>
            ) : null}
          </div>
          <ul
            ref={this.setWrapperRef}
            id={show_auto_complete ? 'search__dropdown__active' : 'search__dropdown__off'}
          >
            <InfiniteScroll
              pageStart={1}
              loadMore={this.loadMoreaAutoCompleteSearch}
              hasMore={loadMoreaAutoComplete}
              useWindow={false}
            >
              {/* For Order | Customer Search: At task-reports | customer-table */}
              {!(
                this.doesCurrentLocationInclude(CUSTOMERS_PAGE) ||
                this.doesCurrentLocationInclude(CUSTOMER_PAGE_BY_ID)
              ) &&
                auto_complete_arr.map((o, i) => (
                  <li
                    key={i}
                    onClick={() => {
                      this.clickOrderSearch(o.order_number);
                    }}
                  >
                    <div>{o.client_name}</div>
                    <div>{o.order_number}</div>
                  </li>
                ))}
              {/* For Customer Search: At customer-page/:id */}
              {(this.doesCurrentLocationInclude(CUSTOMERS_PAGE) ||
                this.doesCurrentLocationInclude(CUSTOMER_PAGE_BY_ID)) &&
                auto_complete_arr?.map((o, i) => (
                  <li
                    key={i}
                    onClick={() => {
                      this.clickCustomerSearch(o._id, o.name);
                    }}
                  >
                    <div>{o.customer_number}</div>
                    <div>{o.name}</div>
                  </li>
                ))}
            </InfiniteScroll>
          </ul>

          <div
            onMouseDown={() => {
              this.upadePopup();
            }}
            onClick={() => {
              this.togglePopup(true);
            }}
            className="add__client"
          >
            <span className="add_client__text">הוסף הזמנה</span>
          </div>
        </div>

        {mainPopup.show_popup ? (
          <ReservationPopup
            closePopup={() => {
              this.togglePopup(false);
            }}
            updateErrorPopup={this.updateErrorPopup}
          />
        ) : null}
      </div>
    );
  }
}

function mapStateToProps({
  router,
  route,
  orders,
  csv,
  mainPopup,
  login,
  process,
  alertPopup,
  customersPage,
  taskReports,
}) {
  return {
    router,
    route,
    orders,
    csv,
    mainPopup,
    login,
    process,
    alertPopup,
    customersPage,
    taskReports,
  };
}
export default withRouter(connect(mapStateToProps, actions)(Header));
