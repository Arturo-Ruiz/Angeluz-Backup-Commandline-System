const drive = require("./googleDrive");

async function getFileIdByName(folderId, fileName) {
  try {
    const response = await drive.files.list({
      q: `'${folderId}' in parents and name = '${fileName}' and trashed = false`,
      fields: "files(id)",
    });

    const files = response.data.files;
    if (files.length === 0) {
      console.error(`No file found with the name '${fileName}' in the folder.`);
      return null;
    } else {
      return files[0].id;
    }
  } catch (err) {
    console.error("Error searching for file by name:", err);
    return null;
  }
}

module.exports = { getFileIdByName };
