require('dotenv').config();

const { google } = require("googleapis");

/**
 * Creates a new instance of GoogleAuth for authentication.
 *
 * @param {Object} options - The options for authentication.
 * @param {string} options.keyFile - The path to the Google application credentials file.
 * @param {string[]} options.scopes - The scopes required for accessing Google Drive.
 * @returns {GoogleAuth} The GoogleAuth instance.
 */

// Create a new instance of GoogleAuth for authentication.
// The options parameter contains the necessary configuration.
const auth = new google.auth.GoogleAuth({
  keyFile: process.env.GOOGLE_APPLICATION_CREDENTIALS,
  scopes: ["https://www.googleapis.com/auth/drive"],
});

// Create a new instance of the Google Drive API with the specified version and authentication.
const drive = google.drive({ version: "v3", auth });

// Export the drive instance to be used in other modules.
module.exports = drive;