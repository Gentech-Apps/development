import React, { Component } from 'react';
import Checkbox from '@material-ui/core/Checkbox';
import CheckBoxOutlineBlankIcon from '@material-ui/icons/CheckBoxOutlineBlank';
import CheckBoxIcon from '@material-ui/icons/CheckBox';
import { withStyles } from '@material-ui/core/styles';
import Loader from '../../LoaderNew/Loader';
import '../../../sass/multiselectdropdown/_multiselectdropdown.scss';
import { calculateUsers } from '../tools';
import Edit from '../../../images/updatepopup/edit.svg';
import { PROJECT_MANAGER } from '../../../constants/translations/updateProcessPopUp';

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

class MultiSelectDropDown extends Component {
  constructor() {
    super();

    this.state = {
      menuActive: false,
    };
  }

  // outside click
  componentDidMount() {
    document.addEventListener('mousedown', this.handleClickOutside);
  }

  componentWillUnmount() {
    document.removeEventListener('mousedown', this.handleClickOutside);
  }

  setWrapperRef = (node) => {
    this.wrapperRef = node;
  };

  handleClickOutside = (event) => {
    if (this.wrapperRef && !this.wrapperRef.contains(event.target)) {
      this.setState({ menuActive: false });
    }
  };
  //

  toggleMenu = () => {
    if (this.props.disableDrag) return;
    this.setState((prevState) => ({
      menuActive: !prevState.menuActive,
    }));
  };

  handleResourceChoose = (position1, position2) => {
    const { resourcesList } = this.props;
    let newState = resourcesList.map((item) => item);
    newState[position1].resources[position2].current = !newState[position1].resources[position2]
      .current;
    // calculate selected resources
    const resourcesQuntity = calculateUsers(resourcesList);
    this.props.updateProcessPopupStateHandler({ resourcesList: newState, resourcesQuntity });
  };

  render() {
    const { menuActive } = this.state;
    const { resourcesList, resourcesLoader, disableDrag, isMetalpress, proccess } = this.props;
    const pm_name = resourcesList.find((item) => item.sub_department.project_manager)
      ?.sub_department.name;

    let newNameArray = resourcesList.map((item) => item);
    // let resourcesNameString = newNameArray.map(item=>item.resources.map(subitem=>subitem.current ? subitem.full_name + ' / ':null)).join(' ').replace(/,/gi, '');
    // resourcesNameString = resourcesNameString.substr(0, resourcesNameString.length - 2)
    let resources_name = newNameArray.reduce((name_obj, item) => {
      return item.resources.reduce((name_l, inItem) => {
        if (inItem.current) {
          name_l[inItem._id] = inItem.full_name;
        }
        return name_l;
      }, name_obj);
    }, {});

    let resourcesNameString = Object.entries(resources_name).reduce((name, [key, value]) => {
      return (name += name ? ` / ${value}` : `${value}`);
    }, '');

    return (
      <div className="multiselect-dropdown" ref={this.setWrapperRef}>
        {resourcesLoader ? (
          <section
            className={
              isMetalpress ? 'multiselect-dropdown__selected-row' : 'multiselect-dropdown__selected'
            }
            onClick={() => {
              this.toggleMenu();
            }}
          >
            <Loader
              style={{
                transform: 'scale(0.4) translateX(80%)',
                position: 'relative',
                height: '20px',
                width: '55%',
              }}
            />
          </section>
        ) : (
          <section
            className={
              isMetalpress ? 'multiselect-dropdown__selected-row' : 'multiselect-dropdown__selected'
            }
            onClick={() => {
              this.toggleMenu();
            }}
            style={disableDrag ? { cursor: 'initial' } : { cursor: 'pointer' }}
          >
            <p>{resourcesNameString || 'אין עובד'}</p>
            <figure>
              <img src={Edit} alt="edit-resource" />
            </figure>
          </section>
        )}

        <section
          className={
            menuActive
              ? 'multiselect-dropdown__menu multiselect-dropdown__menu--active'
              : 'multiselect-dropdown__menu'
          }
        >
          {resourcesList.map((department, departmentIndex) => (
            <div
              className="multiselect-dropdown__menu__department"
              key={departmentIndex}
              style={resourcesList.length === 1 ? { margin: '0' } : {}}
            >
              <header>
                <p>{department.sub_department.name}</p>
              </header>
              <main>
                {department.resources.map((resource, resourceIndex) => (
                  <div key={resourceIndex}>
                    <CustomCheckbox
                      checked={resource.current}
                      size="small"
                      icon={<CheckBoxOutlineBlankIcon fontSize="small" />}
                      checkedIcon={<CheckBoxIcon fontSize="small" />}
                      value="checkedI"
                      onChange={() => {
                        this.handleResourceChoose(departmentIndex, resourceIndex);
                      }}
                    />
                    <p>{resource.full_name}</p>
                  </div>
                ))}
              </main>
            </div>
          ))}
        </section>
      </div>
    );
  }
}

export default MultiSelectDropDown;
