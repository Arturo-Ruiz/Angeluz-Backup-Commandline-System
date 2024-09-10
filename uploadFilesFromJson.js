require("dotenv").config();

const jsonData = require("./data/upload.json");

const { deleteFileByNameInFolder } = require("./modules/deleteFileByNameInFolder");

const { uploadFile } = require("./modules/uploadFile");

const folderId = process.env.FOLDER_ID;

/**
 * Uploads multiple files from a JSON array.
 * @param {Array} jsonData - The JSON array containing file data.
 * @param {string} folderId - The ID of the folder to upload the files to.
 */
async function uploadFilesFromJson(jsonData, folderId) {
  try {
    // Iterate over each file data in the JSON array
    for (const fileData of jsonData) {
      const { filePath, fileName } = fileData;

      // Delete the previous file with the same name in the folder
      await deleteFileByNameInFolder(folderId, fileName);

      console.log("Deleting previous file:", folderId, fileName);

      // Upload the current file to Google Drive
      await uploadFile(filePath, fileName, folderId);

      console.log("Uploading file:", fileName, folderId, filePath);
    }

    console.log("All files have been uploaded.");
  } catch (err) {
    console.error("Error uploading files from JSON:", err);
  }
}

uploadFilesFromJson(jsonData, folderId);
