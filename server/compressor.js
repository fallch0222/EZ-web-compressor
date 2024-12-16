const fs = require("fs"); // File system module
const pako = require("pako"); // For compression and decompression

// Function to read a file and return its contents as a string
function readFile(filePath) {
  return new Promise((resolve, reject) => {
    fs.readFile(filePath, "utf8", (err, data) => {
      if (err) reject(err);
      else resolve(data);
    });
  });
}

// Function to write compressed data to a file
function writeFile(filePath, data) {
  return new Promise((resolve, reject) => {
    fs.writeFile(filePath, data, (err) => {
      if (err) reject(err);
      else resolve();
    });
  });
}

// Function to compress HTML, CSS, and JS files
async function compressFiles(htmlPath, cssPath, jsPath, outputPath) {
  try {
    // Read all files
    const [htmlContent, cssContent, jsContent] = await Promise.all([
      readFile(htmlPath),
      readFile(cssPath),
      readFile(jsPath),
    ]);

    // Combine file contents
    const combined = JSON.stringify({
      html: htmlContent,
      css: cssContent,
      js: jsContent,
    });

    // Compress using pako
    const compressed = pako.deflate(combined);

    // Convert to Base64 for transfer or storage
    const base64Compressed = Buffer.from(compressed).toString("base64");

    // Write compressed data to a file
    await writeFile(outputPath, base64Compressed);
    console.log("Compressed data written to:", outputPath);
  } catch (error) {
    console.error("Error compressing files:", error);
  }
}

// Function to decompress the compressed file
async function decompressFile(inputPath) {
  try {
    // Read the compressed file
    const base64Compressed = await readFile(inputPath);

    // Decode Base64
    const compressed = Buffer.from(base64Compressed, "base64");

    // Decompress using pako
    const decompressed = pako.inflate(compressed, { to: "string" });

    // Parse JSON back to its original components
    const { html, css, js } = JSON.parse(decompressed);

    

    return { html, css, js };
  } catch (error) {
    console.error("Error decompressing file:", error);
  }
}

// Example usage
(async () => {
  const htmlPath = "./original/main.html"; // Path to your HTML file
  const cssPath = "./original/main.css"; // Path to your CSS file
  const jsPath = "./original/script.js"; // Path to your JS file
  const compressedOutputPath = "./static/compressed.txt"; // Path to save compressed file

  console.log("Compressing files...");
  await compressFiles(htmlPath, cssPath, jsPath, compressedOutputPath);

  console.log("Decompressing files...");
  const decompressed = await decompressFile(compressedOutputPath);
  console.log("Decompressed Data");
})();

