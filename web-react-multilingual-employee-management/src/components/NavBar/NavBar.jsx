import React, { Component } from 'react';
import '../../sass/navBar/navBar.scss';
import alerts from './images/alerts.svg';
import setting from './images/setting.svg';
import need_help from './images/need-help.svg';
import menu_icon from './images/menu-icon.svg';
import { polyfill } from 'es6-promise';
import { withRouter } from 'react-router-dom';
//vars
import { PER_USER } from '../../tools/keys/variables';
//redux configs
import { connect } from 'react-redux';
import * as actions from '../../actions/actions';
//functions
import Logout from '../Logout/Logout';
import { getDepartments } from '../../functions/api/orders';
import { getSearchAutoComplete } from '../../functions/api/orders';
//images
import navIcon1 from '../../images/departments/icon1.svg';
import navIcon2 from '../../images/departments/icon2.svg';
import navIcon3 from '../../images/departments/icon3.svg';
import navIcon4 from '../../images/departments/icon4.svg';
import navIcon5 from '../../images/departments/icon5.svg';
import navIcon6 from '../../images/departments/icon6.svg';
import navIcon7 from '../../images/departments/icon7.svg';
import navIcon8 from '../../images/departments/icon8.svg';
import navIcon9 from '../../images/departments/icon9.svg';
//icons
import { SvgIcon } from '@material-ui/core';
import SearchIcon from '@material-ui/icons/Search';
import ClearIcon from '@material-ui/icons/Clear';
import uniqid from 'uniqid';
import { Link } from 'react-router-dom';
import { uniqueValueFilterById } from '../../functions/helpers/uniqueValueFilterById';
import { getLogo } from '../../functions/helpers/getLogo';

polyfill();

class navBar extends Component {
  constructor(props) {
    super(props);
    this.state = {
      user_drop_down: false,
      is_logout: false,
      activeMenu: false,
      searchResults: [],
      searchPage: 0,
      searchLimit: 10,
      searchValue: '',
      blockFetchingData: false,
      mobileSearchInitialized: false,
      perUser: false,
      images: [
        navIcon1,
        navIcon2,
        navIcon3,
        navIcon4,
        navIcon5,
        navIcon6,
        navIcon7,
        navIcon8,
        navIcon9,
      ],
    };
  }

  setSelectedSearch = async (item) => {
    // components knows to detect url change and filter accordingly
    this.props.history.push(window.location.pathname + '?order_number=' + item.order_number);
    this.setState({ mobileSearchInitialized: false });
  };

  async componentWillMount() {
    document.addEventListener('mousedown', this.handleClickOutside);
    let res = await getDepartments();
    //hot fix for duplicated menu items from backend (need to fix on backend)
    const uniqueRes = uniqueValueFilterById(res.result, 'name');
    if (res.ok) {
      this.props.saveDepartments(uniqueRes);
    }

    if (this.props.login.user.privileges && this.props.login.user.privileges.includes(PER_USER)) {
      this.setState({ perUser: true });
    }
  }

  toggleMenu = () => {
    this.setState((prevState) => ({
      activeMenu: !prevState.activeMenu,
    }));
  };

  toggleUser = () => {
    const { user_drop_down } = this.state;
    this.setState({
      user_drop_down: !user_drop_down,
    });
  };

  toggleLogout = () => {
    this.setState({
      is_logout: true,
    });
    localStorage.clear();
  };

  componentWillUnmount() {
    document.removeEventListener('mousedown', this.handleClickOutside);
  }

  setWrapperRef = (node) => {
    this.wrapperRef = node;
  };

  setWrapperRefLogout = (node) => {
    this.wrapperRefLogout = node;
  };

  handleClickOutside = (event) => {
    if (
      this.wrapperRefLogout &&
      !this.wrapperRefLogout.contains(event.target) &&
      event.target.className !== 'arrow__down' &&
      event.target.className !== 'user__name'
    ) {
      this.setState({ user_drop_down: false });
    }

    if (
      this.wrapperRef &&
      !this.wrapperRef.contains(event.target) &&
      event.target.className !== 'menu__icon' &&
      event.target.className !== 'menu__icon__img'
    ) {
      this.setState({ activeMenu: false });
    }
  };

  selectDepartment = (item) => {
    this.props.saveSelectedDepartment(item);
    let search = window.location.search;

    const location = this.props.history.location?.pathname;
    // if on daily-vertical-processes only update state
    if (location.includes('daily-vertical-processes')) {
      this.setState({ activeMenu: false });
      return;
    }
    // if on monthly-resources only update state
    if (location.includes('monthly-resources')) {
      this.setState({ activeMenu: false });
      return;
    }
    //dynamic url factory name
    const dynamicFactoryName = this.props.login.user.factory_name;

    let newView = item.view;
    if (window.innerWidth <= 800) {
      newView = 'monthly';
    }
    this.setState({ activeMenu: false });
    if (
      this.props.login.user.privileges.length === 0 ||
      (this.props.login.user.privileges.includes(PER_USER) &&
        this.props.login.user.privileges.length === 1)
    )
      this.props.history.push(`/${dynamicFactoryName}/${newView + search}`);
  };

  //   SEARCH FUNCTIONALLITIES
  handleInputSearch = (e) => {
    if (!e.target.value) {
      this.setState({
        searchResults: [],
        searchValue: '',
      });
      return;
    }

    this.setState(
      {
        searchValue: e.target.value,
      },
      async () => {
        const { searchPage, searchLimit, searchValue } = this.state;
        let searchRes = await getSearchAutoComplete(searchPage, searchValue, searchLimit);

        if (searchRes.ok) {
          this.setState({
            searchResults: searchRes.result,
          });
        } else {
        }
      },
    );
  };

  clearSearch = () => {
    this.setState({ mobileSearchInitialized: false, searchValue: '' }, () => {
      let indexOfSearch = window.location.href.indexOf('?order_number=');
      this.props.history.push(indexOfSearch);
    });
  };

  fetchMoreDataInSearch = (e) => {
    let obj = e.target;
    let newPage = this.state.searchPage + this.state.searchLimit;
    const { blockFetchingData } = this.state;
    if (obj.scrollTop >= obj.scrollHeight - obj.offsetHeight - 50 && !blockFetchingData) {
      this.setState(
        {
          searchPage: newPage,
          blockFetchingData: true,
        },
        async () => {
          const { searchPage, searchLimit, searchValue, searchResults } = this.state;
          let searchRes = await getSearchAutoComplete(searchPage, searchValue, searchLimit);
          if (searchRes.ok) {
            if (searchRes.result.length === 0) {
              this.setState({ blockFetchingData: true });
            } else {
              let newResults = searchResults.map((item) => item).concat(searchRes.result);
              this.setState({
                searchResults: newResults,
                blockFetchingData: false,
              });
            }
          } else {
            console.log('error handeling here');
          }
        },
      );
    }
  };

  render() {
    const { departments, selectedDepartment, user } = this.props.login;
    const {
      activeMenu,
      images,
      is_logout,
      mobileSearchInitialized,
      searchResults,
      searchValue,
      perUser,
    } = this.state;
    let selectedDepartmentPicked = Object.keys(selectedDepartment).length;
    return (
      <div className="nav__bar" style={mobileSearchInitialized ? { overflow: 'hidden' } : {}}>
        <aside
          className={
            activeMenu ? 'nav__bar__curtain nav__bar__curtain--active' : 'nav__bar__curtain'
          }
        />

        <div className="nav__bar__right">
          <span
            className="menu__icon"
            onClick={() => {
              this.toggleMenu();
            }}
          >
            <img className="menu__icon__img" src={menu_icon} alt="arrow" />
          </span>

          <div className="menu__text">
            {selectedDepartmentPicked ? selectedDepartment.name : 'תכנון'}
          </div>
          {departments.length > 0 ? (
            <ul
              ref={this.setWrapperRef}
              className={
                activeMenu
                  ? 'nav__bar__right__departments--active nav__bar__right__departments'
                  : 'nav__bar__right__departments'
              }
            >
              {!perUser &&
                departments.map((item, index) => {
                  return (
                    <li
                      key={uniqid()}
                      onClick={() => {
                        // !perUser &&
                        this.selectDepartment(item);
                      }}
                      style={item._id === selectedDepartment._id ? { borderColor: '#243748' } : {}}
                    >
                      <img src={images[index]} alt="arrow" />
                      {item.name}
                    </li>
                  );
                })}
              {!perUser && (
                <li
                  onClick={() => {
                    this.selectDepartment({
                      view: 'yearly',
                      name: 'תכנון',
                      _id: '',
                    });
                  }}
                  style={!selectedDepartment._id ? { borderColor: '#243748' } : {}}
                >
                  <img src={images[images.length - 1]} alt="arrow" />
                  תכנון
                </li>
              )}

              <footer
                className="nav__bar__right__departments__footer"
                onClick={() => {
                  this.toggleMenu();
                  this.toggleLogout();
                }}
              >
                <a className="logout__link" href={`/`}>
                  התנתק מהמערכת
                </a>{' '}
              </footer>
            </ul>
          ) : null}
          {/* search mobile */}
          <div
            className={
              mobileSearchInitialized
                ? 'nav__mobile__search nav__mobile__search--active'
                : 'nav__mobile__search'
            }
            onClick={() => {
              this.setState({ mobileSearchInitialized: true });
            }}
          >
            <SvgIcon component={SearchIcon} />
          </div>

          <div
            className={
              mobileSearchInitialized
                ? 'nav__mobile__search__bg nav__mobile__search__bg--active'
                : 'nav__mobile__search__bg'
            }
          ></div>

          <input
            value={searchValue}
            onChange={(e) => {
              this.handleInputSearch(e);
            }}
            type="text"
            placeholder="חיפוש"
            className={
              mobileSearchInitialized
                ? 'nav__mobile__search__input nav__mobile__search__input--active'
                : 'nav__mobile__search__input'
            }
          />

          <SvgIcon
            onClick={() => {
              this.clearSearch();
            }}
            component={ClearIcon}
            className={
              mobileSearchInitialized
                ? 'nav__mobile__search__cancel nav__mobile__search__cancel--active'
                : 'nav__mobile__search__cancel'
            }
          />

          <ul
            className={
              searchValue.length > 0 && mobileSearchInitialized
                ? 'nav__mobile__search__results nav__mobile__search__results--active'
                : 'nav__mobile__search__results'
            }
            onScroll={(e) => {
              this.fetchMoreDataInSearch(e);
            }}
          >
            {searchResults && searchResults.length > 0
              ? searchResults.map((item) => (
                  <li
                    onClick={() => {
                      this.setSelectedSearch(item);
                    }}
                  >
                    <p>{item.client_name}</p>
                    <p>{item.order_number}</p>
                  </li>
                ))
              : null}
          </ul>

          <aside
            className={
              mobileSearchInitialized
                ? 'nav__mobile__search__curtain nav__mobile__search__curtain--active '
                : 'nav__mobile__search__curtain'
            }
            onClick={() => {
              this.setState({ mobileSearchInitialized: false });
            }}
          />
          {/* end search mobile */}
        </div>
        {/* TO DO - take logo from base  */}
        <div className="nav__logo">
          <img
            style={
              decodeURIComponent(window.location.pathname).includes('מטלפרס')
                ? { maxWidth: 'none' }
                : {}
            }
            className="logo"
            src={getLogo(this.props.login.user)}
            alt="logo"
          />
        </div>

        <div className="nav__bar__left">
          <div className="user__dropdown__container">
            <div className="user__container" onClick={() => this.toggleUser()}>
              <div className="user__name">{user.full_name}</div>
            </div>
          </div>

          <div className="line" />

          {this.props.isAdmin && (
            <Link to={`/admin`}>
              <div
                className="user__admin__container"
                onClick={() => {
                  this.toggleAdmin();
                }}
              >
                <div className="user__admin"> admin </div>
              </div>
            </Link>
          )}

          <div className="nav__bar__icons">
            <img src={need_help} alt="need help" />
            <img src={setting} alt="setting" />
            <img src={alerts} alt="alerts" />
          </div>
        </div>
        {is_logout ? <Logout /> : null}
      </div>
    );
  }
}

function mapStateToProps({ login, monthResource }) {
  return { login, monthResource };
}

export default withRouter(connect(mapStateToProps, actions)(navBar));
