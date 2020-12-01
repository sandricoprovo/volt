/* eslint-disable array-callback-return */
const electron = require('electron');
const path = require('path');
const fs = require('fs');

// Parses a JSON string into a JS object
function parseDataFile(filePath, defaults) {
  try {
    return JSON.parse(fs.readFileSync(filePath));
  } catch (error) {
    return defaults;
  }
}

class VoltDB {
  constructor(config) {
    const userDataPath = (electron.app || electron.remote.app).getPath(
      'userData'
    );
    this.path = path.join(userDataPath, `${config.dbName}.json`);
    this.data = parseDataFile(this.path, config.collections);
  }

  // Gets the data of a property
  get(key) {
    return this.data[key];
  }

  // Set the data of a property
  set(key, linkObj) {
    // Pushing new link onto array of links
    this.data[key].push(linkObj);
    // Writing new links array to JSON file
    fs.writeFileSync(this.path, JSON.stringify(this.data));
  }

  // Archiving a collection link
  archive(key, linkId) {
    // Removing link collection based on view
    const [movedLink] = this.data[key].splice(linkId, 1);
    if (key === 'links') {
      // Moving the selected link to the archived links array
      this.data.archived.push(movedLink);
    } else {
      // Moving the selected link to the links array
      this.data.links.push(movedLink);
    }
    // Writing changes to JSON DB
    fs.writeFileSync(this.path, JSON.stringify(this.data));
  }

  // Setting App Highlight Colour
  changeHighlight(key, colorCode) {
    // Updating color config
    this.data[key].highlightColor = colorCode;
    // Writing changes to JSON DB
    fs.writeFileSync(this.path, JSON.stringify(this.data));
  }

  // Delete Link from DB
  delete(key, id) {
    // Removing deleted link from the collection
    this.data[key] = this.data[key].filter((link, index) => {
      if (index !== id) return link;
    });
    // Writing changes to JSON DB
    fs.writeFileSync(this.path, JSON.stringify(this.data));
  }
}

module.exports = VoltDB;
