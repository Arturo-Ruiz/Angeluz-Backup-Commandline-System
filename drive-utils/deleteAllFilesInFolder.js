const drive = require("./googleDrive");

// Function to delete all files in a folder

/**
 * Deletes all files in a specified folder.
 *
 * @param {string} folderId - The ID of the folder to delete files from.
 * @returns {Promise<void>} - A promise that resolves when all files have been deleted.
 * @throws {Error} - If there is an error deleting the files.
 */

async function deleteFilesInFolder(folderId) {
  try {
    // List all files in the folder
    let response = await drive.files.list({
      q: `'${folderId}' in parents and trashed = false`, // Query to filter files by folderId and not trashed
      fields: "nextPageToken, files(id)", // Specify the fields to retrieve from the API response
    });

    const files = response.data.files; // Array to store the files

    // If there are more files, retrieve them using pagination
    while (response.data.nextPageToken) {
      response = await drive.files.list({
        q: `'${folderId}' in parents and trashed = false`, // Query to filter files by folderId and not trashed
        fields: "nextPageToken, files(id)", // Specify the fields to retrieve from the API response
        pageToken: response.data.nextPageToken, // Provide the nextPageToken to get the next set of files
      });
      files.push(...response.data.files); // Add the retrieved files to the array
    }

    // Delete each file in the folder
    for (const file of files) {
      await drive.files.delete({ fileId: file.id }); // Delete the file using its fileId
      console.log(`File with ID ${file.id} deleted.`); // Log the deletion of each file
    }

    console.log("All files in the folder have been deleted."); // Log when all files have been deleted
  } catch (err) {
    console.error("Error deleting files:", err); // Log any errors that occur during the deletion process
  }
}

module.exports = { deleteFilesInFolder }; // Export the deleteFilesInFolder function