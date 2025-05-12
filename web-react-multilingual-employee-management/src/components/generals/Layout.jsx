import React from 'react';
import { connect } from 'react-redux';
import DialogWrapper from './DialogWrapper';
import { compose } from 'redux';
import NavBar from '../NavBar/NavBar';
import HeaderAdmin from '../AdminPanel/HeaderAdmin';
import Header from '../Header/Header';

class Layout extends React.Component {
  render() {
    const { isAdmin } = this.props;
    return (
      <div className={`layout-main`}>
        <NavBar isAdmin={isAdmin} />
        {!isAdmin ? <Header /> : <HeaderAdmin {...this.props} />}
        {this.props.children}
      </div>
    );
  }
}

function mapStateToProps(state) {
  return {};
}

const mapDispatchToProps = {};

export default compose(connect(mapStateToProps, mapDispatchToProps), DialogWrapper)(Layout);
