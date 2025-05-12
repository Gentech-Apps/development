/*******/
// this component requiered props:
// popupActionHandler - function, gets 1 param of type string:, 'yes' or 'no' if yes handle confirmation click and if not handle cancel click
// this component optional props:
// afterConfirmationError - string : the error message
/*******/

import React, { Component } from 'react';
import ReactHtmlParser from 'react-html-parser';
//components
import { connect } from 'react-redux';
import PopupsDropdown from './updateProcessPopup/PopupsDropdown';
//sass
import '../../sass/popups/_ondrag_popup.scss';
//variables
import { constantDropdownReasonsOptions } from '../../tools/keys/variables';
//img
import ErrImg from '../../images/updatepopup/colide.svg';
class OnDragPopup extends Component {
  constructor() {
    super();

    this.state = {
      //form state
      reason: '',
      approveName: '',
    };
  }

  updateForm = (name, item) => {
    console.log(name, item);
    this.setState({
      [name]: item,
    });
  };

  submit = (e) => {
    e.preventDefault();
  };

  componentWillReceiveProps(nextProps) {
    console.log(nextProps);
  }

  render() {
    const {
      afterConfirmationError,
      popupActionHandler,
      warningApiPayload,
      warnings,
      login,
    } = this.props;
    const { reason, approveName } = this.state;
    const reasonPopup = login.user.reason_popup;
    const showReasonPopUp =
      reasonPopup ||
      (reasonPopup &&
        warningApiPayload &&
        warningApiPayload.process &&
        warningApiPayload.process.constant &&
        !afterConfirmationError &&
        warnings &&
        warnings.length === 0);

    // return ((showReasonPopUp || afterConfirmationError) ?
    return (
      <div className="custom__popup">
        <aside className="custom__popup__curtain"></aside>
        {showReasonPopUp ? (
          <form
            className="custom__popup__content"
            onSubmit={(e) => {
              this.submit(e);
            }}
          >
            <span className="custom__popup__content__form-group">
              <label>סיבת שינוי התאריך</label>
              <PopupsDropdown
                customStyles={{ width: '100%' }}
                value={reason.name}
                name={'reason'}
                placeholder={'בחר סיבה…'}
                options={constantDropdownReasonsOptions}
                handleChange={this.updateForm}
              />
            </span>
            <span className="custom__popup__content__form-group">
              <label>שם מאשר הדחייה</label>
              <PopupsDropdown
                customStyles={{ width: '100%' }}
                value={approveName.name}
                name={'approveName'}
                placeholder={'דוגמה תפעול…'}
                options={[
                  { name: 'מנהל מפעל', value: 'מנהל מפעל' },
                  { name: 'סמנכ"ל תפעול', value: 'סמנכ"ל תפעול' },
                ]}
                handleChange={this.updateForm}
              />
            </span>
            <span className="custom__popup__content__submit">
              <button
                onClick={() => {
                  popupActionHandler('no');
                }}
              >
                ביטול
              </button>
              <button
                className={reason && approveName ? '' : 'custom__popup__content__submit--disabled'}
                type="submit"
                onClick={() => {
                  popupActionHandler('yes', { reason, approveName });
                }}
              >
                אישור
              </button>
            </span>
          </form>
        ) : !afterConfirmationError && warnings && warnings.length > 0 ? (
          <div className="custom__popup__content custom__popup__warnings">
            <img src={ErrImg} alt="error" />
            <h1>העדכון יוצר עומס יתר.</h1>
            <h2>האם לשנות בכל זאת?</h2>
            {warnings && warnings.length > 0 ? (
              <div className="custom__popup__warnings__list">
                {warnings.map((warning) => {
                  return (
                    <div className="custom__popup__warnings__list__warning">
                      {warning.name + ' - ' + warning.type}
                    </div>
                  );
                })}
              </div>
            ) : null}
            <section className="custom__popup__warnings__submit-section">
              <button
                onClick={() => {
                  popupActionHandler('no');
                }}
              >
                ביטול
              </button>
              <button
                onClick={() => {
                  popupActionHandler('yes');
                }}
              >
                אישור
              </button>
            </section>
          </div>
        ) : (
          <div className="custom__popup__content custom__popup__warnings__submit-section">
            <p
              style={{
                textAlign: 'center',
                marginBottom: '20px',
                fontSize: '16px',
                color: 'black',
              }}
            >
              {ReactHtmlParser(afterConfirmationError) || '***'}
            </p>
            <button
              onClick={() => {
                popupActionHandler('no');
              }}
            >
              ביטול
            </button>
          </div>
        )}
      </div>
    );
    // : null)
  }
}

function mapStateToProps({ login }) {
  return { login };
}

export default connect(mapStateToProps, null)(OnDragPopup);
