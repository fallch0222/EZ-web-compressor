const fs = require("fs"); // File system module
const pako = require("pako"); // For compression and decompression

// Function to read a file and return its content as a string
function readFile(filePath) {
  return new Promise((resolve, reject) => {
    fs.readFile(filePath, "utf8", (err, data) => {
      if (err) reject(err);
      else resolve(data);
    });
  });
}

// Function to write a file
function writeFile(filePath, data) {
  return new Promise((resolve, reject) => {
    fs.writeFile(filePath, data, (err) => {
      if (err) reject(err);
      else resolve();
    });
  });
}

// Function to decompress a .txt file and extract HTML, CSS, and JS
async function decompressFile(inputPath, outputDir) {
  try {
    // Step 1: Read the compressed .txt file
    const base64Compressed = await readFile(inputPath);

    // Step 2: Decode Base64
    const compressed = Buffer.from(base64Compressed, "base64");

    // Step 3: Decompress the content using pako
    const decompressed = pako.inflate(compressed, { to: "string" });

    // Step 4: Parse JSON to extract HTML, CSS, and JS
    const { html, css, js } = JSON.parse(decompressed);

    // Step 5: Write each part to its respective file in the output directory
    await Promise.all([
      writeFile(`${outputDir}/output.html`, html),
      writeFile(`${outputDir}/output.css`, css),
      writeFile(`${outputDir}/output.js`, js),
    ]);

    console.log(`Decompressed files saved in directory: ${outputDir}`);
  } catch (error) {
    console.error("Error decompressing file:", error);
  }
}

// Example usage
(async () => {
  const inputPath = "./compressed.txt"; // Path to the compressed .txt file
  const outputDir = "./output"; // Directory to save decompressed files

  // Ensure the output directory exists
  if (!fs.existsSync(outputDir)) {
    fs.mkdirSync(outputDir);
  }

  // Decompress the file
  console.log("Decompressing file...");
  await decompressFile(inputPath, outputDir);
})();
