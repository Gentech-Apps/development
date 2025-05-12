/*******/
// this component requiered props:
// closePopup
/*******/

import React, { Component } from 'react';
import ReactHtmlParser, {
  processNodes,
  convertNodeToElement,
  htmlparser2,
} from 'react-html-parser';
import '../../../sass/errorPopup/errorPopup.scss';

class ErrorPopup extends Component {
  render() {
    const { afterConfirmationError, updatePopup } = this.props;

    return (
      <div className="popup__error" style={{ zIndex: 9999 }}>
        <div className="custom__popup__error">
          <div className="custom__popup__error__content">
            <p
              style={{
                textAlign: 'center',
                marginBottom: '20px',
                fontSize: '16px',
                color: 'black',
              }}
            >
              {afterConfirmationError ? ReactHtmlParser(afterConfirmationError) : 'אירעה שגיאה'}
            </p>
            <button
              onClick={() => {
                updatePopup(false);
              }}
            >
              אישור
            </button>
          </div>
        </div>
      </div>
    );
  }
}

export default ErrorPopup;
