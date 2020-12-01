const { shell } = require('electron');

const openInBrowser = (url) => {
  // Electron exposes shell object and the openExternal function allows users to open url in their default browser.
  shell.openExternal(url);
};

export default openInBrowser;
