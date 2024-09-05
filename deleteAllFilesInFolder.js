const drive = require("./googleDrive");

async function deleteFilesInFolder(folderId) {
  try {
    let response = await drive.files.list({
      q: `'${folderId}' in parents and trashed = false`,
      fields: "nextPageToken, files(id)",
    });

    const files = response.data.files;

    while (response.data.nextPageToken) {
      response = await drive.files.list({
        q: `'${folderId}' in parents and trashed = false`,
        fields: "nextPageToken, files(id)",
        pageToken: response.data.nextPageToken,
      });
      files.push(...response.data.files);
    }

    for (const file of files) {
      await drive.files.delete({ fileId: file.id });
      console.log(`File with ID ${file.id} deleted.`);
    }

    console.log("All files in the folder have been deleted.");
  } catch (err) {
    console.error("Error deleting files:", err);
  }
}

module.exports = { deleteFilesInFolder };
