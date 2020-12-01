/* eslint-disable no-shadow */
import React, { useState, useEffect } from 'react';
import { HashRouter as Router, Route, Switch } from 'react-router-dom';
import { ipcRenderer } from 'electron';

// util functions
import updateAppHighlight from '../utils/updateAppHighlight';

// Imported components
import Layout from './Layout';
import Sidebar from './Sidebar';
import LinkList from './LinkList';
import Settings from './Settings';

const App = () => {
  const [isModalOpen, setModalOpen] = useState(false);
  const [viewLinks, setViewLinks] = useState([]);
  const [currentView, setCurrentView] = useState('links');
  const [currentConfig, setCurrentConfig] = useState({});

  // Setting the viewLinks set on first render
  useEffect(() => {
    // Getting current config object
    ipcRenderer.invoke('db:read-config').then((config) => {
      // Update theme files colour with config variable
      updateAppHighlight(config.highlightColor);
      // Update config state with config object
      setCurrentConfig(config);
    });
    // Setting the current links shown on the page based on the current view state.
    ipcRenderer.invoke('db:read-links', currentView).then((links) => {
      setViewLinks(links);
    });
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [currentView]);

  // toggleModal() : checks to see if the add link modal is currently open, and shows or hides based on current state.
  const toggleAddModal = () => {
    if (!isModalOpen) setModalOpen(true);
    else setModalOpen(false);
  };

  // saveLink(form,input field) : this functions takes in the save link form to stop the default, and then proceeds to validate the passed link. If not valid, an error message is returned. If valid, the functions creates a new link object and sends it to the DB class for saving, while also sending a success message back.
  const saveLink = (event, linkInput) => {
    event.preventDefault();
    const linkUrl = linkInput.value;
    // Making sure pasted input is valid url
    if (!/(www|http:|https:)+[^\s]+[\w]/.test(linkUrl)) {
      return 'Oops! Please enter a valid link.';
    }
    // Date and time sting formatting options
    const longFormatOptions = {
      timeZone: Intl.DateTimeFormat().resolvedOptions().timeZone,
      month: 'long',
      day: 'numeric',
      weekday: 'long',
      year: 'numeric',
      hour: 'numeric',
      minute: 'numeric',
      second: 'numeric',
    };
    // Uses international date time to get and format date and time string
    const userCurrentTime = new Intl.DateTimeFormat(
      'en-US',
      longFormatOptions
    ).format(new Date());
    // New link with timestamp
    const newLink = {
      timeStamp: userCurrentTime,
      url: linkUrl,
    };

    // Saving new link to DB, then get the new links list and sets it to state
    ipcRenderer.invoke('db:add', newLink).then((links) => {
      setViewLinks(links);
    });

    // Add a set timeout so modal doesn't immediate close. Gives time for user to read success response.
    setTimeout(() => {
      // resetting modal link input field to blank
      linkInput.value = '';
      setModalOpen(false);
    }, 1500);

    return 'Link successfully added!';
  };

  // archiveLink(id) : takes in the ID of the clicked link, and archives or unarchives it based on the current view. Example: if the current view is showing archived links, then this button show unarchive a link.
  const archiveLink = (linkId) => {
    if (currentView === 'archived') {
      ipcRenderer.invoke('db:archive', currentView, linkId).then((links) => {
        setViewLinks(links);
      });
    } else if (currentView === 'links') {
      ipcRenderer.invoke('db:archive', currentView, linkId).then((links) => {
        setViewLinks(links);
      });
    }
  };

  // toggleView() : toggles the current view between live and archived links based on the current view.
  const toggleView = () => {
    // Setting current component view and list view
    if (currentView === 'links') {
      setCurrentView('archived');
      // Sending requests to ipcMain via ipcRenderer
      ipcRenderer.invoke('db:read-links', 'archived').then((links) => {
        setViewLinks(links);
      });
    } else {
      setCurrentView('links');
      // Sending requests to ipcMain via ipcRenderer
      ipcRenderer.invoke('db:read-links', 'links').then((links) => {
        setViewLinks(links);
      });
    }
  };

  // updateHighlightColor(form, color string) : takes in the form to prevent default, and the validates the color code string. If valid, the string is sent to the DB class for updating and a success message is returned. If not valid, an error message is returned.
  const updateHighlightColor = (event, colorCode) => {
    event.preventDefault();
    // Use regex to check if entered color code is valid
    const colorCodeRegex = /^(?:#|0x)(?:[a-f0-9]{3}|[a-f0-9]{6})\b|(?:rgb|hsl)a?\([^)]*\)$/;
    if (!colorCodeRegex.test(colorCode.toLowerCase())) {
      return 'Oops! Please enter a valid color code.';
    }
    // Sending change to ipcMain if code is valid
    ipcRenderer.invoke('db:accent', 'config', colorCode).then((config) => {
      setCurrentConfig(config);
    });
    return 'Color changed successfully!';
  };

  // deleteLink(id) : takes in the ID of the clicked link, and deletes it from either the links or archive collection.
  const deleteLink = (linkId) => {
    if (currentView === 'archived') {
      ipcRenderer.invoke('db:delete', currentView, linkId).then((links) => {
        setViewLinks(links);
      });
    } else if (currentView === 'links') {
      ipcRenderer.invoke('db:delete', currentView, linkId).then((links) => {
        setViewLinks(links);
      });
    }
  };

  /** ipcRenderer global keyboard shortcuts */
  // Open the add link modal
  ipcRenderer.on('modal:open', () => setModalOpen(true));

  return (
    <Layout>
      <Router>
        <Sidebar showAddModal={toggleAddModal} toggleView={toggleView} />
        <Switch>
          <Route path="/settings">
            <Settings
              changeHighlight={updateHighlightColor}
              config={currentConfig}
            />
          </Route>
          <Route exact path="/">
            <LinkList
              currentView={currentView}
              linksList={viewLinks}
              showModal={isModalOpen}
              toggleModal={toggleAddModal}
              saveLink={saveLink}
              archiveLink={archiveLink}
              deleteLink={deleteLink}
            />
          </Route>
        </Switch>
      </Router>
    </Layout>
  );
};

export default App;
