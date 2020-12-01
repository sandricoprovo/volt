import React from 'react';
import propTypes from 'prop-types';
import '../styles/link.css';

// Util Functions
import openInBrowser from '../utils/openInBrowser';

const Link = ({
  id,
  title,
  url,
  timestamp,
  toggleArchive,
  currentView,
  deleteLink,
}) => (
  <div className="link__container" data-linkid={id}>
    <h1 className="link__title">{title}</h1>
    <h2 className="link__timestamp">Saved on {timestamp}</h2>
    <button
      className="link__btn link__view-btn"
      onClick={() => openInBrowser(url)}
      type="button"
    >
      View Page
    </button>
    <button
      className="link__btn link__archive-btn"
      onClick={() => toggleArchive(id)}
      type="button"
    >
      {currentView === 'links' ? 'Archive' : 'Unarchive'}
    </button>
    <button
      className="link__btn link__archive-btn"
      onClick={() => deleteLink(id)}
      type="button"
    >
      Delete
    </button>
  </div>
);

// Props Validation
Link.propTypes = {
  id: propTypes.number,
  title: propTypes.string,
  url: propTypes.string,
  timestamp: propTypes.string,
  toggleArchive: propTypes.func,
  deleteLink: propTypes.func,
  currentView: propTypes.string,
};

export default Link;
