import React, { Component } from 'react';
import CircularProgress from '@material-ui/core/CircularProgress';
import '../../sass/PopupLoader/PopupLoader.scss';

class PopupLoader extends Component {
  render() {
    return (
      <div className="loader__container">
        <div className="loader">
          <CircularProgress size={60} />
        </div>
      </div>
    );
  }
}

export default PopupLoader;
