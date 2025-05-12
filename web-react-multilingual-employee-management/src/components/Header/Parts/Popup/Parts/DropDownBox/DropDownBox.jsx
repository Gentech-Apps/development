import React, { Component } from 'react';
import '../../../../../../sass/DropDownBox/DropDownBox.scss';
import { polyfill } from 'es6-promise';
polyfill();

//*****  props:  *****

// validate_all_form ={} for validate
// title={"כותרת"}
// data={} date for the drop down   data.name
// updateForm={updateForm} update
// name={"name of the input"}
// validate_message={"יש לבחור נציג מכירות"}

class DropDownBox extends Component {
  constructor(props) {
    super(props);
    this.state = {
      selected_step: props.selected_step,
      selected: true,
      is_validate: true,
    };
  }

  componentWillReceiveProps(nextProps) {
    let { validate_all_form } = this.props;
    if (nextProps.validate_all_form !== validate_all_form) {
      this.validateForm();
    }
  }

  validateForm = () => {
    let { selected_step } = this.state;

    if (selected_step === '') {
      this.setState({
        is_validate: false,
      });
    }
  };

  hideValidateMessage = () => {
    this.setState({
      is_validate: true,
    });
  };

  toggle = () => {
    const { selected } = this.state;
    this.setState({
      selected: !selected,
    });
  };

  closeSelectedBox = () => {
    this.setState({
      selected: true,
    });
  };

  selectStep = (option) => {
    const { updateForm, name } = this.props;

    if (option.name == 'בוטלה') {
      updateForm('cancelled', true);
    } else if (option.name == 'מיוחדת') {
      updateForm(name, 'מיוחדת');
    } else {
      updateForm(name, option._id);
    }

    this.hideValidateMessage();

    this.toggle();
    this.setState({
      selected_step: option.name,
    });
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

  // clickAndScroll =()=>{
  //   setTimeout(function(){
  //     let element = document.querySelector("#drop__down__box--active")
  //     if(element !== null ){
  //       element.scrollIntoView(false)
  //     }

  //     },100);

  // }

  clickAndScroll = () => {
    //this function  for the main popup
    //if title = false - the component not in the main popup
    const { title } = this.props;
    if (title) {
      setTimeout(function () {
        let element = document.querySelector('#drop__down__box--active');
        let scroll_element = document.querySelector('.popup__right__inputs__container');

        if (element !== null) {
          let element_top = element.getBoundingClientRect();

          if (element_top.bottom > 498) {
            scroll_element.scrollTop += scroll_element.offsetTop;
          }
        }
      }, 100);
    } else {
      return;
    }
  };

  render() {
    const { data, step, placeholder, title, validate_message } = this.props;
    const { selected, selected_step, is_validate } = this.state;
    return (
      <div className="input__container">
        {title ? <div>{title}</div> : null}
        <div ref={this.setWrapperRef} className="drop__down__box__container">
          <section className="drop__down__box" onClick={this.clickAndScroll}>
            <header onClick={this.toggle} className="drop__down__header__select">
              <div className="drop__down__box__icon">
                <div>{selected_step ? selected_step : placeholder ? placeholder : ''}</div>
                {selected ? (
                  <div className="drop__down__box__arrow__icon">
                    {' '}
                    <i className="fas fa-sort-down"></i>
                  </div>
                ) : (
                  <div>
                    {' '}
                    <i className="fas fa-sort-up"></i>
                  </div>
                )}
              </div>
            </header>
            <ul
              id={selected ? 'drop__down__box--off' : 'drop__down__box--active'}
              className="drop__down__list"
            >
              {data.map((o, index) => {
                return (
                  <li className="drop__down__option" onClick={() => this.selectStep(o)} key={index}>
                    <span className="option__text">{o.name}</span>
                  </li>
                );
              })}
            </ul>
          </section>
        </div>
        {is_validate ? ' ' : <div className="validate__message">{validate_message}</div>}
      </div>
    );
  }
}

export default DropDownBox;
