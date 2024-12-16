const express = require('express');
const path = require('path');
const app = express();
const port = 3000;

// Static folder for serving files (including compressed.txt)
app.use(express.static('static'));
// Root route to serve the HTML page
app.get('/', (req, res) => {
  res.sendFile(path.join(__dirname, './decompress.html'));
});

// Start the server
app.listen(port, () => {
    require('./compressor.js')
  console.log(`Server running at http://localhost:${port}`);
});
