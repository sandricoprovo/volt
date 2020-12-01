const { BrowserWindow } = require('electron').remote;

const getMetaTitle = async (url) => {
  const articleWindow = new BrowserWindow({
    width: 500,
    height: 500,
    show: false,
  });

  await articleWindow.loadURL(url);
  return articleWindow.webContents.getTitle();
};

module.exports.getMetaTitle = getMetaTitle;
