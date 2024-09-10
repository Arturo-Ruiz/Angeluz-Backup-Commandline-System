// Importing required modules
require("dotenv").config(); // Loads environment variables from a .env file

const readline = require("readline"); // Provides an interface for reading input and output from the command line
const { downloadFilesFromJSON } = require("./scripts/downloadFilesFromJson"); // Importing a function from a local file
const { uploadFilesFromJSON } = require("./scripts/uploadFilesFromJson"); // Importing a function from a local file
const jsonDataUpload = require("./data/upload.json"); // Importing data from a local JSON file
const jsonDataDownload = require("./data/download.json"); // Importing data from a local JSON file
const folderId = process.env.FOLDER_ID; // Getting the value of the FOLDER_ID environment variable

// Creating a readline interface for reading input from the command line
const rl = readline.createInterface({
  input: process.stdin,
  output: process.stdout,
});

// Options for the menu
const options = [
  {
    text: "Upload files",
    icon: "⬆️",
    action: () => uploadFilesFromJSON(jsonDataUpload, folderId), // Function to be executed when this option is selected
  },
  {
    text: "Download files",
    icon: "⬇️",
    action: () => downloadFilesFromJSON(jsonDataDownload, folderId), // Function to be executed when this option is selected
  },
];

/**
 * Displays the menu for the Angeluz Backup System.
 */
function showMenu() {
  console.clear(); // Clears the console

  // Printing the menu header
  console.log("\x1b[32m\x1b[1m ╔═══════════════════════════════════════╗ \x1b[0m");
  console.log("\x1b[32m\x1b[1m ║   Welcome to Angeluz Backup System!   ║ \x1b[0m");
  console.log("\x1b[32m\x1b[1m ╚═══════════════════════════════════════╝ \x1b[0m");

  console.log("\nPlease select an option:");

  // Printing each option in the menu
  options.forEach((option, index) => {
    const prefix = index === selectedOption ? "\x1b[34m> \x1b[0m" : "  ";
    console.log(`${prefix}${option.icon} ${option.text}`);
  });

  console.log("\nUse the ↑ and ↓ arrows to navigate. Press Enter to select.");
}

let selectedOption = 0; // The index of the currently selected option in the menu

showMenu(); // Displaying the menu

// Event listener for keypress events
rl.input.on("keypress", (str, key) => {
  if (key.name === "up" && selectedOption > 0) {
    selectedOption--; // Move the selection up
  } else if (key.name === "down" && selectedOption < options.length - 1) {
    selectedOption++; // Move the selection down
  } else if (key.name === "return") {
    rl.close(); // Close the readline interface
    options[selectedOption].action(); // Execute the action associated with the selected option
  }

  showMenu(); // Display the updated menu
});