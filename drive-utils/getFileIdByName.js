const drive = require("./googleDrive");

/**
 * Retrieves the ID of a file by its name within a specified folder.
 * @param {string} folderId - The ID of the folder to search within.
 * @param {string} fileName - The name of the file to search for.
 * @returns {Promise<string|null>} - The ID of the file if found, or null if not found or an error occurred.
 */

async function getFileIdByName(folderId, fileName) {
  try {
    // Search for the file by name within the specified folder
    const response = await drive.files.list({
      q: `'${folderId}' in parents and name = '${fileName}' and trashed = false`,
      fields: "files(id)",
    });

    const files = response.data.files;
    if (files.length === 0) {
      // If no file is found, log an error message and return null
      console.error(`No file found with the name '${fileName}' in the folder.`);
      return null;
    } else {
      // Return the ID of the first file found
      return files[0].id;
    }
  } catch (err) {
    // If an error occurs during the search, log an error message and return null
    console.error("Error searching for file by name:", err);
    return null;
  }
}

module.exports = { getFileIdByName };