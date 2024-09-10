const drive = require("./googleDrive");

/**
 * Deletes files with a specific name in a given folder.
 *
 * @param {string} folderId - The ID of the folder.
 * @param {string} fileName - The name of the file to be deleted.
 * @returns {Promise<void>} - A promise that resolves when the files are deleted.
 * @throws {Error} - If there is an error deleting the file.
 */

async function deleteFileByNameInFolder(folderId, fileName) {
  try {
    // List files in the folder with the specified name and not trashed
    let response = await drive.files.list({
      q: `'${folderId}' in parents and name = '${fileName}' and trashed = false`,
      fields: "nextPageToken, files(id)",
    });

    const files = response.data.files;

    // Retrieve all files using pagination
    while (response.data.nextPageToken) {
      response = await drive.files.list({
        q: `'${folderId}' in parents and name = '${fileName}' and trashed = false`,
        fields: "nextPageToken, files(id)",
        pageToken: response.data.nextPageToken,
      });
      files.push(...response.data.files);
    }

    // Check if any files were found
    if (files.length === 0) {
      console.log(`No file found with the name '${fileName}' in the folder.`);
    } else {
      // Delete each file found
      for (const file of files) {
        await drive.files.delete({ fileId: file.id });
        console.log(`File with ID ${file.id} and name '${fileName}' deleted.`);
      }
    }
  } catch (err) {
    console.error("Error deleting the file:", err);
  }
}

module.exports = { deleteFileByNameInFolder };