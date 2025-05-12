import React, { Component } from 'react';
import PopupsDropdown from './updateProcessPopup/PopupsDropdown';
//variables
import { constantDropdownReasonsOptions } from '../../tools/keys/variables';

class ReasonPopup extends Component {
  constructor() {
    super();

    this.state = {
      //form state
      reason: '',
      approveName: '',
    };
  }

  updateForm = (name, valueObject) => {
    this.setState({
      [name]: valueObject,
    });
  };

  render() {
    const { reason, approveName } = this.state;
    const { handleSpreadWithReason, cancelPopup } = this.props;
    return (
      <div className="custom__popup">
        <aside className="custom__popup__curtain"></aside>
        <div className="custom__popup__content">
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
                cancelPopup();
              }}
            >
              ביטול
            </button>
            <button
              className={reason && approveName ? '' : 'custom__popup__content__submit--disabled'}
              type="submit"
              onClick={() => {
                handleSpreadWithReason({ reason, approveName });
              }}
            >
              אישור
            </button>
          </span>
        </div>
      </div>
    );
  }
}

export default ReasonPopup;
