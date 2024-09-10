require("dotenv").config();

const drive = require("./googleDrive");
const fs = require("fs");

const folderId = process.env.FOLDER_ID; // O puedes pasar el folderId como argumento


async function getFileIdByName(folderId, fileName) {
  try {
    const response = await drive.files.list({
      q: `'${folderId}' in parents and name = '${fileName}' and trashed = false`,
      fields: "files(id)",
    });

    const files = response.data.files;
    if (files.length === 0) {
      console.error(
        `No se encontró ningún archivo con el nombre '${fileName}' en la carpeta.`
      );
      return null;
    } else {
      return files[0].id;
    }
  } catch (err) {
    console.error("Error al buscar el archivo por nombre:", err);
    return null;
  }
}

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

async function downloadFilesFromJSON(jsonData, folderId) {
  try {
    for (const fileData of jsonData) {
      const { fileName } = fileData;
      const fileId = await getFileIdByName(folderId, fileName);

      if (fileId) {
        const destFilePath = `./downloads/${fileName}`;
        await downloadFile(fileId, destFilePath);
      }
    }
    console.log("All files have been downloaded.");
  } catch (err) {
    console.error("Error downloading files from JSON:", err);
  }
}

// Asegúrate de que jsonData tenga la estructura adecuada con fileName
const jsonData = [
  { fileName: "archivo1.txt" },
  { fileName: "imagen2.jpg" },
  // ... más archivos si es necesario
];

downloadFilesFromJSON(jsonData, folderId);
