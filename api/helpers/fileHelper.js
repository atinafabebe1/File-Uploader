const fs = require('fs');

function getFileSize(filePath) {
  try {
    const stats = fs.statSync(filePath);
    const fileSizeInBytes = stats.size;
    const fileSizeInMegabytes = fileSizeInBytes / (1024 * 1024);
    return fileSizeInMegabytes.toFixed(2);
  } catch (err) {
    console.error(`Error getting file size for ${filePath}:`, err);
    return null;
  }
}

module.exports = {
  getFileSize
};
