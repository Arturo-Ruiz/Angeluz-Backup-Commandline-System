const drive = require("./googleDrive");
const fs = require("fs");

async function downloadFile(fileId, destFilePath) {
  try {
    const response = await drive.files.get(
      { fileId, alt: "media" },
      { responseType: "stream" }
    );
    const dest = fs.createWriteStream(destFilePath);
    response.data
      .on("end", () => {
        console.log("File downloaded:", destFilePath);
      })
      .on("error", (err) => {
        console.error("Error downloading file:", err);
      })
      .pipe(dest);
  } catch (err) {
    console.error("Error downloading file:", err);
  }
}

module.exports = { downloadFile };