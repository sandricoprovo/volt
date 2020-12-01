import React from 'react';
import PropTypes from 'prop-types';
import { HashRouter as Router, Link } from 'react-router-dom';
import '../styles/sidebar.css';
import Logo from '../images/logo.png';

const Sidebar = ({ showAddModal, toggleView }) => (
  <section className="sidebar__container">
    <img src={Logo} alt="" />
    <div className="sidebar__btn-container">
      <button
        className="sidebar__action-btn"
        onClick={showAddModal}
        type="button"
      >
        Add Link
      </button>
      <button
        className="sidebar__action-btn"
        onClick={toggleView}
        type="button"
      >
        Switch View
      </button>
    </div>
    <div>
      <Router>
        <button className="sidebar__view-btn" type="button">
          <Link
            to="/"
            style={{
              textDecoration: 'none',
              color: 'color: var(--highlight-color)',
            }}
          >
            Links
          </Link>
        </button>
        <button className="sidebar__view-btn" type="button">
          <Link
            to="/settings"
            style={{
              textDecoration: 'none',
              color: 'color: var(--highlight-color)',
            }}
          >
            Settings
          </Link>
        </button>
      </Router>
    </div>
  </section>
);

// Props Validation
Sidebar.propTypes = {
  showAddModal: PropTypes.any,
  toggleView: PropTypes.func,
};

export default Sidebar;
