import React, { Component } from 'react';
import exitIcom from '../../images/general/exit.svg';
import { connect } from 'react-redux';
import * as actions from '../../actions/actions';

class ConstantPopup extends Component {
  componentDidMount() {
    window.addEventListener('keydown', this.handleKeys);
  }

  componentWillUnmount() {
    window.removeEventListener('keydown', this.handleKeys);
  }

  handleKeys = (e) => {
    if (e.keyCode === 13) {
      this.props.spreadingTrue();
    } else if (e.keyCode === 27) {
      this.props.spreadingFalse();
    }
  };

  openWarningPopup = async () => {
    // resetReposition sets OnDragPopUp active
    // const { resetReposition } = this.props
    // if (resetReposition) {
    //   resetReposition()
    // } else {
    //   if (this.props.login.user.reason_popup) {
    //     this.props.updateWarningPopup(true)
    //   } else {
    //     this.props.popupActionHandler('yes')
    //   }
    //   // if (this.props.orders.isRecipientReasone) {
    //   //   this.props.updateWarningPopup(true)
    //   // } else {
    //   //   this.props.popupActionHandler('yes')
    //   // }
    // }
    if (this.props.login.user.reason_popup) {
      if (this.props.handleWarningPopup) {
        // update for monthly and weekly view
        this.props.handleWarningPopup(true);
      } else {
        this.props.updateWarningPopup(true);
      }
    } else {
      this.props.popupActionHandler('yes');
    }

    this.props.updateConstantPopup(false);
  };

  spradingActions = (boolean) => {
    // debugger;

    let { updateConstantToSpred } = this.props;

    if (updateConstantToSpred) updateConstantToSpred(true);

    // if (this.props.login.user.reason_popup) {
    //   this.props.updateWarningPopup(true)
    // }

    this.props.updateConstantPopup(false);

    if (boolean) {
      this.props.spreadingTrue();
    } else {
      this.props.spreadingFalse();
    }
  };

  render() {
    return (
      <div className="custom__popup" style={{ zIndex: 9999 }}>
        <aside className="custom__popup__curtain"></aside>
        <div className="custom__popup__content custom__popup__warnings__submit-section">
          {this.props.cancleSpreading ? (
            <div className="exit__icon__reason__popup">
              <img
                style={{ cursor: 'pointer' }}
                onClick={() => {
                  this.props.cancleSpreading();
                }}
                src={exitIcom}
                alt="exit"
              />
            </div>
          ) : null}
          <p
            style={{
              textAlign: 'center',
              marginBottom: '20px',
              fontSize: '16px',
              color: 'black',
            }}
          >
            {/* האם תרצה לפרוס מחדש? */}
            האם לשנות מועד מסירה‎?
          </p>
          <span>
            <button
              onClick={() => {
                this.spradingActions(false);
              }}
            >
              לא
            </button>
            <button
              onClick={() => {
                this.spradingActions(true);
              }}
            >
              כן
            </button>
          </span>
          <button
            className="reset__button"
            onClick={() => {
              this.openWarningPopup();
            }}
          >
            איפוס - שנה ואפס פריסה
          </button>
        </div>
      </div>
    );
  }
}

function mapStateToProps({ orders, login, monthResource }) {
  return { orders, login, monthResource };
}

export default connect(mapStateToProps, actions)(ConstantPopup);
