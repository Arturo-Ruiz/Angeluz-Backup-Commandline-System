require("dotenv").config();

const {
  deleteFileByNameInFolder,
} = require("../drive-utils/deleteFileByNameInFolder");

const { uploadFile } = require("../drive-utils/uploadFile");

/**
 * Uploads multiple files from a JSON array.
 * @param {Array} jsonData - The JSON array containing file data.
 * @param {string} folderId - The ID of the folder to upload the files to.
 */
async function uploadFilesFromJSON(jsonData, folderId) {
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

module.exports = { uploadFilesFromJSON };