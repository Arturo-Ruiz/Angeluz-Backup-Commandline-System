const drive = require("./googleDrive");
const fs = require("fs");

/**
 * Downloads a file from Google Drive and saves it to the specified destination file path.
 *
 * @param {string} fileId - The ID of the file to download.
 * @param {string} destFilePath - The destination file path to save the downloaded file.
 * @returns {Promise<void>} - A promise that resolves when the file is successfully downloaded and saved, or rejects with an error.
 */

async function downloadFile(fileId, destFilePath) {
  try {
    // Get the file from Google Drive with the specified ID and response type of "stream"
    const response = await drive.files.get(
      { fileId, alt: "media" },
      { responseType: "stream" }
    );

    // Create a write stream to the destination file path
    const dest = fs.createWriteStream(destFilePath);

    // Handle the "end" event when the file download is complete
    response.data
      .on("end", () => {
        console.log("File downloaded:", destFilePath);
      })

      // Handle the "error" event if there is an error during the file download
      .on("error", (err) => {
        console.error("Error downloading file:", err);
      })

      // Pipe the response data to the destination write stream
      .pipe(dest);
  } catch (err) {
    // Handle any errors that occur during the file download
    console.error("Error downloading file:", err);
  }
}

module.exports = { downloadFile };