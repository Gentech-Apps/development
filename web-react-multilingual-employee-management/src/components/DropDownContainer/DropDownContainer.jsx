import React, { Component } from 'react';
import '../../sass/dropDownContainer/dropDownContainer.scss';
import { polyfill } from 'es6-promise';
polyfill();

class DropDownContainer extends Component {
  constructor(props) {
    super(props);
    this.state = {
      selected_item: '',
      selected: true,
      first_element_drop_down: false,
    };
  }

  toggle = () => {
    const { selected } = this.state;
    this.setState(
      {
        selected: !selected,
      },
      () => {
        this.fixedFirstOrderDropDown();
      },
    );
  };

  //check

  fixedFirstOrderDropDown = () => {
    const { selected } = this.state;

    let column__wraaper__container = document.getElementById('drop__down__section--active');
    if (column__wraaper__container !== null) {
      let first_element = document.getElementById('project__box').firstElementChild;

      if (first_element.contains(column__wraaper__container)) {
        this.setState({
          first_element_drop_down_px: first_element.offsetHeight,
        });
        if (first_element.offsetHeight < 200) {
          first_element.style.height = +100 + column__wraaper__container.offsetHeight + 'px';
          this.setState({
            first_element_drop_down: true,
          });
        }
      }
    }
  };

  closeFixedFirstOrderDropDown = () => {
    const { first_element_drop_down, first_element_drop_down_px } = this.state;

    if (first_element_drop_down) {
      let first_element = document.getElementById('project__box').firstElementChild;
      first_element.style.height = '100%';
      // first_element.style.height =+ first_element_drop_down_px + "px"
      this.setState({
        first_element_drop_down: false,
      });
    }
  };

  closeSelectedBox = () => {
    this.setState(
      {
        selected: true,
      },
      () => {
        this.closeFixedFirstOrderDropDown();
      },
    );
  };

  selectStep = async (option) => {
    const { name, replaceFunc, current_item, current_item_text } = this.props;

    this.toggle();
    this.setState({
      selected_item: option.full_name,
    });

    let result = await replaceFunc(option, current_item);

    if (result === false) {
      this.setState({
        selected_item: current_item_text,
      });
    }
  };

  setWrapperRef = (node) => {
    this.wrapperRef = node;
  };
  componentDidMount() {
    document.addEventListener('mousedown', this.handleClickOutside);
  }
  componentWillUnmount() {
    document.removeEventListener('mousedown', this.handleClickOutside);
  }

  handleClickOutside = (event) => {
    if (this.wrapperRef && !this.wrapperRef.contains(event.target)) {
      this.closeSelectedBox();
    }
  };

  render() {
    const { items, current_item, current_item_text, item, color } = this.props;
    const { selected, selected_item, is_validate } = this.state;

    return (
      <div ref={this.setWrapperRef} className="drop__down__main__container">
        <section className="drop__down__section">
          <header onClick={this.toggle} className="drop__down__header">
            <div className="selected__name">{selected_item || current_item_text}</div>
            <span className="drop__down__section__icon" style={{ color: color }}>
              {selected ? <i className="fas fa-sort-down"></i> : <i className="fas fa-sort-up"></i>}
            </span>
          </header>
          <ul
            id={selected ? 'drop__down__section--off' : 'drop__down__section--active'}
            className="drop__down__list__items"
            style={{ color: '#5d5959' }}
          >
            {items.map((o, index) => {
              return (
                <li className="drop__down__item" onClick={() => this.selectStep(o)} key={index}>
                  <span
                    style={{ fontWeight: o.current ? 'bold' : '' }}
                    className="option__text__item"
                  >
                    {o.full_name}
                  </span>
                </li>
              );
            })}
          </ul>
        </section>
      </div>
    );
  }
}

export default DropDownContainer;
