import React, { Component } from 'react';
import exitIcom from '../../images/general/exit.svg';
import { withRouter } from 'react-router-dom';
import { connect } from 'react-redux';
import { PER_USER, NO_FINANCIALS } from '../../tools/keys/variables';

class SpreadingPopup extends Component {
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

  render() {
    const isPerUserPrivilege = !!this.props.login.user.privileges.find(
      (i) => i === PER_USER || i === NO_FINANCIALS,
    );
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
                this.props.spreadingFalse();
              }}
            >
              לא
            </button>
            <button
              disabled={isPerUserPrivilege}
              style={isPerUserPrivilege ? { backgroundColor: 'grey', cursor: 'not-allowed' } : {}}
              onClick={() => {
                this.props.spreadingTrue();
              }}
            >
              כן
            </button>
          </span>
        </div>
      </div>
    );
  }
}

function mapStateToProps({ login }) {
  return { login };
}
export default withRouter(connect(mapStateToProps, null)(SpreadingPopup));
