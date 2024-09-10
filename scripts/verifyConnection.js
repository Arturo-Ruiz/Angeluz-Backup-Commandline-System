const drive = require("../drive-utils/googleDrive");

/**
 * Verifies the connection to the drive.
 * @async
 * @function verifyConnection
 * @returns {Promise<void>} A promise that resolves when the connection is verified.
 */

//Verify connect to google drive
async function verifyConnection() {
  // Try to get information about the user from the drive
  try {
    const res = await drive.about.get({
      fields: "user",
    });
    // Log the user's display name if the connection is successful
    console.log("Connected with the user: ", res.data.user.displayName);
  } catch (err) {
    // Log an error message if there is an error verifying the connection
    console.error("Error verifying the connection: ", err);
  }
}

verifyConnection();