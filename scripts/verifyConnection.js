const drive = require("../drive-utils/googleDrive");

//Verify connect to google drive
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