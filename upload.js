require("dotenv").config();

const drive = require("./googleDrive");

const fs = require("fs");

const { PassThrough } = require("stream");

const mime = require("mime-types");

const jsonData = require("./files.json");

const { deleteFileByNameInFolder } = require("./deleteFileByNameInFolder");

const folderId = process.env.FOLDER_ID;

/**
 * Uploads a file to Google Drive.
 * @param {string} filePath - The path of the file to upload.
 * @param {string} fileName - The name of the file to upload.
 * @param {string} folderId - The ID of the folder to upload the file to.
 */
async function uploadFile(filePath, fileName, folderId) {
  try {
    // Create file metadata
    const fileMetadata = {
      name: fileName,
      parents: [folderId],
    };

    // Determine the MIME type of the file
    const mimeType = mime.lookup(filePath) || "application/octet-stream";

    // Create the media object for the file
    const media = {
      mimeType: mimeType,
      body: fs.createReadStream(filePath),
    };

    // Get the file size
    const fileSize = fs.statSync(filePath).size;

    // Create a read stream for the file
    const fileStream = fs.createReadStream(filePath);

    // Create a pass-through stream
    const passThroughStream = new PassThrough();

    // Pipe the file stream to the pass-through stream
    fileStream.pipe(passThroughStream);

    // Upload the file to Google Drive
    const response = await drive.files.create({
      resource: fileMetadata,
      media: {
        mimeType: media.mimeType,
        body: passThroughStream,
      },
      fields: "id",
    });

    console.log("File uploaded with ID:", response.data.id);
  } catch (err) {
    console.error("Error uploading file:", err);
  }
}

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

uploadFilesFromJSON(jsonData, folderId);