require("dotenv").config();

const readline = require("readline");
const { downloadFilesFromJSON } = require("./scripts/downloadFilesFromJson");
const { uploadFilesFromJSON } = require("./scripts/uploadFilesFromJson");
const jsonDataUpload = require("./data/upload.json");
const jsonDataDownload = require("./data/download.json");
const folderId = process.env.FOLDER_ID;

const rl = readline.createInterface({
  input: process.stdin,
  output: process.stdout,
});

function showMenu() {
  console.clear();
  console.log("\x1b[32m¡Bienvenido!\x1b[0m");
  console.log("Por favor, selecciona una opción:");
  if (selectedOption === 0) {
    console.log("\x1b[34m> ↑ Subir archivos\x1b[0m");
    console.log("  ↓ Descargar archivos");
  } else {
    console.log("  ↑ Subir archivos");
    console.log("\x1b[34m> ↓ Descargar archivos\x1b[0m");
  }
}

let selectedOption = 0;

showMenu();

rl.input.on("keypress", (str, key) => {
  if (key.name === "up" && selectedOption > 0) {
    selectedOption--;
  } else if (key.name === "down" && selectedOption < 1) {
    selectedOption++;
  } else if (key.name === "return") {
    rl.close();
    if (selectedOption === 0) {
      uploadFilesFromJSON(jsonDataUpload, folderId);
    } else if (selectedOption === 1) {
      downloadFilesFromJSON(jsonDataDownload, folderId);
    }
  }

  showMenu();
});
