const { google } = require("googleapis");

require('dotenv').config();

//Configuring the authentication with the service account
const auth = new google.auth.GoogleAuth({
  keyFile: process.env.GOOGLE_APPLICATION_CREDENTIALS,
  scopes: ["https://www.googleapis.com/auth/drive"],
});

//Creating the drive object
const drive = google.drive({ version: "v3", auth });

//verify connect to google drive
async function verifyConnection() {
  try {
    const res = await drive.about.get({
      fields: "user",
    });
    console.log("Connected with the user: ", res.data.user.displayName);
  } catch (err) {
    console.error("Error verifying the connection: ", err);
  }
}

verifyConnection();
