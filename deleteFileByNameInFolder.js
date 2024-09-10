const drive = require("./googleDrive");

async function deleteFileByName(folderId, fileName) {
  try {
    let response = await drive.files.list({
      q: `'${folderId}' in parents and name = '${fileName}' and trashed = false`,
      fields: "nextPageToken, files(id)",
    });

    const files = response.data.files;

    // Manejar paginación en caso de que haya muchos archivos
    while (response.data.nextPageToken) {
      response = await drive.files.list({
        q: `'${folderId}' in parents and name = '${fileName}' and trashed = false`,
        fields: "nextPageToken, files(id)",
        pageToken: response.data.nextPageToken,
      });
      files.push(...response.data.files);
    }

    if (files.length === 0) {
      console.log(
        `No se encontró ningún archivo con el nombre '${fileName}' en la carpeta.`
      );
    } else {
      for (const file of files) {
        await drive.files.delete({ fileId: file.id });
        console.log(
          `Archivo con ID ${file.id} y nombre '${fileName}' eliminado.`
        );
      }
    }
  } catch (err) {
    console.error("Error al eliminar el archivo:", err);
  }
}

module.exports = { deleteFileByName };
