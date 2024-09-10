require("dotenv").config();

const { getFileIdByName } = require("../drive-utils/getFileIdByName");

const { downloadFile } = require("../drive-utils/downloadFile");

/**
 * Downloads files from a JSON data array.
 *
 * @param {Array} jsonData - The JSON data array containing file information.
 * @param {string} folderId - The ID of the folder where the files will be downloaded.
 * @returns {Promise<void>} - A promise that resolves when all files have been downloaded.
 * @throws {Error} - If there is an error downloading the files.
 */

async function downloadFilesFromJSON(jsonData, folderId) {
  try {
    // Iterate over each file data in the JSON array
    for (const fileData of jsonData) {
      // Extract the fileName and path from the fileData object
      const { fileName } = fileData;
      const { path } = fileData;

      // Get the file ID by name from the specified folder
      const fileId = await getFileIdByName(folderId, fileName);

      // If the file ID exists
      if (fileId) {
        // Set the destination file path
        const destinationFilePath = `${path}/${fileName}`;

        // Download the file using the file ID and destination file path
        await downloadFile(fileId, destinationFilePath);
      }
    }

    // Log a success message when all files have been downloaded
    console.log("All files have been downloaded.");
  } catch (err) {
    // Log an error message if there is an error downloading the files
    console.error("Error downloading files from JSON:", err);
  }
}

module.exports = { downloadFilesFromJSON };