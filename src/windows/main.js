import { dialog, BrowserWindow } from "electron";
import path from "node:path";
import fs from "node:fs/promises";
import { stringify } from "csv-stringify/sync";

export const handleSaveData = async (event, data) => {
  if (data && data.length > 0) {
    const { filePath } = await dialog.showSaveDialog({
      defaultPath: "data.csv",
    });

    if (filePath) {
      const output = stringify(data, {
        header: true,
        columns: ["time", "value"],
      });

      await fs.writeFile(filePath, output);
    }
  }
};

export const createMainWindow = () => {
  // Create the browser window.
  const mainWindow = new BrowserWindow({
    width: 800,
    height: 800,
    webPreferences: {
      preload: path.join(__dirname, "preload.js"),
    },
  });

  mainWindow.webContents.session.setPermissionCheckHandler(
    (webContents, permission, requestingOrigin, details) => {
      if (permission === "serial") {
        return true;
      }

      return false;
    }
  );

  mainWindow.webContents.session.setDevicePermissionHandler((details) => {
    if (details.deviceType === "serial") {
      return true;
    }

    return false;
  });

  // and load the index.html of the app.
  if (MAIN_WINDOW_VITE_DEV_SERVER_URL) {
    mainWindow.loadURL(MAIN_WINDOW_VITE_DEV_SERVER_URL);
  } else {
    mainWindow.loadFile(
      path.join(__dirname, `../renderer/${MAIN_WINDOW_VITE_NAME}/index.html`)
    );
  }

  // Open the DevTools.
  mainWindow.webContents.openDevTools();

  return mainWindow;
};
