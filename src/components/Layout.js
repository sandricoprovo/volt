import React from 'react';
import PropTypes from 'prop-types';
import '../styles/layout.css';

const Layout = ({ children }) => (
  <main className="layout__container">{children}</main>
);

Layout.propTypes = {
  children: PropTypes.any,
};

export default Layout;
