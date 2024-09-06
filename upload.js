require('dotenv').config();

const fs = require("fs");

const { PassThrough } = require("stream");

const mime = require("mime-types");

const drive = require("./googleDrive");

const jsonData = require("./files.json");

const { deleteFilesInFolder } = require("./deleteAllFilesInFolder");

const folderId = process.env.FOLDER_ID;

deleteFilesInFolder(folderId);

async function uploadFile(filePath, fileName, folderId) {
  try {
    const fileMetadata = {
      name: fileName,
      parents: [folderId],
    };

    const mimeType = mime.lookup(filePath) || "application/octet-stream";

    const media = {
      mimeType: mimeType,
      body: fs.createReadStream(filePath),
    };

    const fileSize = fs.statSync(filePath).size;
    const fileStream = fs.createReadStream(filePath);
    const passThroughStream = new PassThrough();

    fileStream.pipe(passThroughStream);

    const response = await drive.files.create({
      resource: fileMetadata,
      media: {
        mimeType: media.mimeType,
        body: passThroughStream,
      },
      fields: "id",
      onUploadProgress: (evt) => {
        const progress = (evt.bytesRead / fileSize) * 100;
        const remainingBytes = fileSize - evt.bytesRead;
        const uploadSpeed = evt.bytesRead / (evt.elapsedTime / 1000);

        const remainingTime = remainingBytes / uploadSpeed;

        console.log(`Progreso: ${progress.toFixed(2)}%`);
        console.log(`Tiempo restante: ${formatTime(remainingTime)}`);
        console.log(`Velocidad: ${formatBytes(uploadSpeed)}/s`);
      },
    });

    console.log("Archivo subido con ID:", response.data.id);
  } catch (err) {
    console.error("Error al subir el archivo:", err);
  }
}

function formatTime(seconds) {
  const hours = Math.floor(seconds / 3600);
  const minutes = Math.floor((seconds % 3600) / 60);
  const remainingSeconds = Math.floor(seconds % 60);
  return `${hours}h ${minutes}m ${remainingSeconds}s`;
}

function formatBytes(bytes) {
  const units = ["B", "KB", "MB", "GB", "TB"];
  let i = 0;
  while (bytes >= 1024 && i < units.length - 1) {
    bytes /= 1024;
    i++;
  }
  return `${bytes.toFixed(2)} ${units[i]}`;
}


async function uploadFilesFromJSON(jsonData, folderId) {
  try {
    for (const fileData of jsonData) {
      const { filePath, fileName } = fileData;

      await uploadFile(filePath, fileName, folderId);

      console.log("Subiendo archivo:", fileName, folderId, filePath);
    }

    console.log("Todos los archivos han sido subidos.");
  } catch (err) {
    console.error("Error al subir archivos desde JSON:", err);
  }
}

uploadFilesFromJSON(jsonData, folderId);