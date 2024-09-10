require("dotenv").config();

const { getFileIdByName } = require("./getFileIdByName");

const { downloadFile } = require("./downloadFile");

const jsonData = require("./data/download.json");

const folderId = process.env.FOLDER_ID;

async function downloadFilesFromJSON(jsonData, folderId) {
  try {
    for (const fileData of jsonData) {
      const { fileName } = fileData;
      const { path } = fileData;

      const fileId = await getFileIdByName(folderId, fileName);

      if (fileId) {
        const destinationFilePath = `${path}/${fileName}`;
        await downloadFile(fileId, destinationFilePath);
      }
    }
    console.log("All files have been downloaded.");
  } catch (err) {
    console.error("Error downloading files from JSON:", err);
  }
}

downloadFilesFromJSON(jsonData, folderId);
