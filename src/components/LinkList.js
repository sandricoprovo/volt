import React, { useState, useEffect } from 'react';
import PropTypes from 'prop-types';
import '../styles/linkList.css';

// Imported Components
import AddLinkModal from './AddLink';
import Link from './Link';
import Loading from './Loading';

// Util Functions
import { getMetaTitle } from '../utils/getMetaTitle';

const LinkList = ({
  showModal,
  toggleModal,
  saveLink,
  archiveLink,
  deleteLink,
  linksList,
  currentView,
}) => {
  const [listComponents, setListComponents] = useState([]);
  const [isLoading, setIsLoading] = useState(false);

  useEffect(() => {
    // setting isMounted to true to handle cleanup
    let isMounted = true;
    // Setting loading state to false
    setIsLoading(true);
    if (isMounted) {
      // creating components array list
      const listing = linksList.map(async (link, index) => {
        const linkTitle = await getMetaTitle(link.url);
        return (
          <Link
            key={index}
            id={index}
            title={linkTitle}
            url={link.url}
            timestamp={link.timeStamp}
            toggleArchive={archiveLink}
            deleteLink={deleteLink}
            currentView={currentView}
          />
        );
      });
      Promise.all(listing).then((list) => {
        setIsLoading(false); // Setting loading state to false
        setListComponents(list); // Setting state with list components
      });
    }
    // Effect cleanup
    return () => (isMounted = false);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [linksList]);

  // Conditonally set empty text
  let emptyListText;
  if (currentView === 'links') {
    emptyListText = 'Click the add button to add a new link.';
  } else if (currentView === 'archived') {
    emptyListText = 'No archived links.';
  }

  // Conditionally loading the page component based on status of links list.
  let loadedComponent;
  if (isLoading) {
    loadedComponent = <Loading />;
  } else if (linksList.length <= 0) {
    loadedComponent = (
      <p
        style={{
          color: 'var(--highlight-color)',
          marginTop: '22%',
        }}
      >
        {emptyListText}
      </p>
    );
  } else {
    loadedComponent = listComponents;
  }

  return (
    <main className="list__container">
      <h1 className="list__header">
        {currentView.charAt(0).toUpperCase() + currentView.slice(1)}
      </h1>
      <div
        style={{
          display: 'flex',
          flexDirection: 'column',
          justifyContent: 'flex-start',
          alignItems: 'center',
        }}
      >
        <AddLinkModal
          isOpen={showModal}
          toggleSelf={toggleModal}
          saveLink={saveLink}
        />
        {loadedComponent}
      </div>
      <p className="list__count">Total Number of Links: {linksList.length}</p>
    </main>
  );
};
// Props Validation
LinkList.propTypes = {
  showModal: PropTypes.bool,
  toggleModal: PropTypes.func,
  saveLink: PropTypes.func,
  archiveLink: PropTypes.func,
  deleteLink: PropTypes.func,
  linksList: PropTypes.array,
  currentView: PropTypes.string,
};

export default LinkList;
