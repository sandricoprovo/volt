const path = require('path');
const url = require('url');
const {
  app,
  BrowserWindow,
  globalShortcut,
  ipcMain,
  Menu,
  shell,
} = require('electron');
const VoltDB = require('./src/components/database/VoltDB');

const volt = new VoltDB({
  dbName: 'volt_database',
  collections: {
    links: [],
    archived: [],
    config: {
      highlightColor: 'ffd318',
    },
  },
});

let mainWindow;

let isDev = false;
const isMac = process.platform === 'darwin';

if (
  process.env.NODE_ENV !== undefined &&
  process.env.NODE_ENV === 'development'
) {
  isDev = true;
}

function createMainWindow() {
  mainWindow = new BrowserWindow({
    width: 1100,
    height: 800,
    minWidth: 400,
    show: false,
    icon: './src/images/logo.png',
    webPreferences: {
      nodeIntegration: true,
    },
  });

  let indexPath;

  if (isDev && process.argv.indexOf('--noDevServer') === -1) {
    indexPath = url.format({
      protocol: 'http:',
      host: 'localhost:8080',
      pathname: 'index.html',
      slashes: true,
    });
  } else {
    indexPath = url.format({
      protocol: 'file:',
      pathname: path.join(__dirname, 'dist', 'index.html'),
      slashes: true,
    });
  }

  mainWindow.loadURL(indexPath);

  // Don't show until we are ready and loaded
  mainWindow.once('ready-to-show', () => {
    mainWindow.show();

    // Open devtools if dev
    if (isDev) {
      const {
        default: installExtension,
        REACT_DEVELOPER_TOOLS,
        // eslint-disable-next-line import/no-extraneous-dependencies
        // eslint-disable-next-line global-require
      } = require('electron-devtools-installer');

      installExtension(REACT_DEVELOPER_TOOLS).catch((err) =>
        console.log('Error loading React DevTools: ', err)
      );
      mainWindow.webContents.openDevTools({ mode: 'detach' });
    }
  });

  mainWindow.on('closed', () => (mainWindow = null));
}

ipcMain.handle('db:read-links', async (event, collectionName) => {
  const linksList = await volt.get(collectionName);
  return linksList;
});

ipcMain.handle('db:read-config', async () => volt.get('config'));

// CREATE
ipcMain.handle('db:add', async (event, newLink) => {
  volt.set('links', newLink);
  const liveLinks = await volt.get('links');
  return liveLinks;
});

// UPDATE
// update an articles archived status
ipcMain.handle('db:archive', async (event, collectionName, linkId) => {
  volt.archive(collectionName, linkId);
  if (collectionName === 'links') {
    const liveLinks = await volt.get(collectionName);
    return liveLinks;
  }
  if (collectionName === 'archived') {
    const archivedLinks = await volt.get(collectionName);
    return archivedLinks;
  }
});
// update app accent color
ipcMain.handle('db:accent', async (event, collectionName, colorCode) => {
  volt.changeHighlight(collectionName, colorCode);
  const updatedConfig = await volt.get('config');
  return updatedConfig;
});

// DELETE
ipcMain.handle('db:delete', async (event, collectionName, linkId) => {
  // Make call to DB Class
  volt.delete(collectionName, linkId);
  // Conditionally sending back data based on view
  if (collectionName === 'links') {
    const liveLinks = await volt.get('links');
    return liveLinks;
  }
  const archivedLinks = await volt.get('archived');
  return archivedLinks;
});

/** APP CONFIG */

// MENU TEMPLATE
const mainMenuTemplate = [
  // Shows regular menu item categories on macs instead of the default where they were loading to under the app title in the top right
  // { role: 'appMenu' }
  ...(isMac
    ? [
        {
          label: 'Volt',
          submenu: [
            { role: 'about' },
            { type: 'separator' },
            { role: 'services' },
            { type: 'separator' },
            { role: 'hide' },
            { role: 'hideothers' },
            { role: 'unhide' },
            { type: 'separator' },
            { role: 'quit' },
          ],
        },
      ]
    : []),
  // { role: 'fileMenu' }
  {
    label: 'File',
    submenu: [
      {
        label: 'Add Link',
        accelerator: 'Command+N',
        click() {
          mainWindow.webContents.send('modal:open');
        },
      },
      isMac ? { role: 'close' } : { role: 'quit' },
    ],
  },
  // { role: 'editMenu' }
  {
    label: 'Edit',
    submenu: [
      { type: 'separator' },
      { role: 'undo' },
      { role: 'redo' },
      { type: 'separator' },
      { role: 'cut' },
      { role: 'copy' },
      { role: 'paste' },
      ...(isMac
        ? [
            { role: 'pasteAndMatchStyle' },
            { role: 'delete' },
            { role: 'selectAll' },
            { type: 'separator' },
            {
              label: 'Speech',
              submenu: [{ role: 'startSpeaking' }, { role: 'stopSpeaking' }],
            },
          ]
        : [{ role: 'delete' }, { type: 'separator' }, { role: 'selectAll' }]),
    ],
  },
  // { role: 'viewMenu' }
  {
    label: 'View',
    submenu: [
      { role: 'reload' },
      { role: 'forceReload' },
      { role: 'toggleDevTools' },
      { type: 'separator' },
      { role: 'resetZoom' },
      { role: 'zoomIn' },
      { role: 'zoomOut' },
      { type: 'separator' },
      { role: 'togglefullscreen' },
    ],
  },
  // { role: 'windowMenu' }
  {
    label: 'Window',
    submenu: [
      { role: 'minimize' },
      { role: 'zoom' },
      ...(isMac
        ? [
            { type: 'separator' },
            { role: 'front' },
            { type: 'separator' },
            { role: 'window' },
          ]
        : [{ role: 'close' }]),
    ],
  },
  // { role: 'helpMenu' }
  {
    role: 'Help',
    submenu: [
      {
        label: 'Find me on Twitter',
        click: async () => {
          await shell.openExternal('https://twitter.com/SandricoP');
        },
      },
    ],
  },
];

// Setting about window information
app.setAboutPanelOptions({
  applicationName: 'Volt',
  applicationVersion: '1.0.0',
  authors: 'Sandrico Provo',
  iconPath: './assets/volt_icon.png',
});

app.on('window-all-closed', () => {
  if (process.platform !== 'darwin') {
    app.quit();
  }
});

app.on('activate', () => {
  if (mainWindow === null) {
    createMainWindow();
  }
});

app.whenReady().then(() => {
  // Close the app
  globalShortcut.register('Control+Q', () => {
    app.quit();
  });
  // Shortcut for opening the add link window
  globalShortcut.register('Command+N', () => {
    mainWindow.webContents.send('modal:open');
  });
});

app.on('ready', () => {
  createMainWindow();
  const mainMenu = Menu.buildFromTemplate(mainMenuTemplate);
  Menu.setApplicationMenu(mainMenu);
});

// Stop error
app.allowRendererProcessReuse = true;
