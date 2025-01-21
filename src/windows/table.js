import { ipcMain } from "electron";
import { BrowserWindow } from "electron";
import path from "node:path";

export const createTableWindow = (data, parentWindow) => {
  ipcMain.handle("fetch-data", async (event) => {
    return data;
  });

  // Create the browser window.
  const tableWindow = new BrowserWindow({
    width: 600,
    height: 800,
    webPreferences: {
      preload: path.join(__dirname, "preload-table.js"),
    },
  });

  // and load the index.html of the app.
  if (TABLE_WINDOW_VITE_DEV_SERVER_URL) {
    tableWindow.loadURL(TABLE_WINDOW_VITE_DEV_SERVER_URL + "/index-table.html");
  } else {
    tableWindow.loadFile(
      path.join(
        __dirname,
        `../renderer/${TABLE_WINDOW_VITE_NAME}/index-table.html`
      )
    );
  }

  // Open the DevTools.
  tableWindow.webContents.openDevTools();

  tableWindow.on("closed", () => {
    ipcMain.removeHandler("fetch-data");
  });

  return tableWindow;
};
