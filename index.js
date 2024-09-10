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
  console.clear(); // Limpia la consola para una mejor presentación
  console.log("¡Bienvenido!");
  console.log("Por favor, selecciona una opción:");
}

let selectedOption = 0; // Variable para rastrear la opción seleccionada

showMenu();

rl.input.on("keypress", (str, key) => {
  if (key.name === "up") {
    selectedOption = 0;
  } else if (key.name === "down") {
    selectedOption = 1;
  } else if (key.name === "return") {
    // Enter presionado
    rl.close(); // Cerramos la interfaz de lectura
    if (selectedOption === 0) {
      uploadFilesFromJSON(jsonDataUpload, folderId);
    } else if (selectedOption === 1) {
      downloadFilesFromJSON(jsonDataDownload, folderId);
    }
  }

  showMenu(); // Volvemos a mostrar el menú con la opción seleccionada resaltada
  if (selectedOption === 0) {
    console.log("> ↑ Subir archivos");
    console.log("  ↓ Descargar archivos");
  } else {
    console.log("  ↑ Subir archivos");
    console.log("> ↓ Descargar archivos");
  }
});
