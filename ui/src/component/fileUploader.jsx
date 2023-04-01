import React, { useState, useEffect } from "react";
import "./FileTable.css";

function FileTable() {
  const [files, setFiles] = useState([]);

  // Fetch list of uploaded files from API on component mount
  useEffect(() => {
    fetch("/file")
      .then((response) => response.json())
      .then((data) => {
        setFiles(data);
      })
      .catch((error) => console.error(error));
  }, []);

  // Handle file upload form submission
  const handleUpload = (event) => {
    const fileInput = event.target.file;
    const file = fileInput.files[0];

    // Check if a file has been selected
    if (!file) {
      alert("Please select a file.");
      return;
    }

    // Check file size before uploading
    if (file.size > 10 * 1024 * 1024) {
      alert("File size should be less than 10MB.");
      return;
    }

    const formData = new FormData();
    formData.append("file", file);

    fetch("/file", {
      method: "POST",
      body: formData,
    })
      .then((response) => response.json())
      .then((data) => setFiles([...files, data]))
      .catch((error) => console.error(error));
  };

  // Handle file removal
  const handleRemove = (file) => {
    console.log(files);
    fetch(`/file/${file.id}`, {
      method: "DELETE",
    })
      .then(() => {
        setFiles((prevFiles) => prevFiles.filter((f) => f.id !== file.id));
      })
      .catch((error) => console.error(error));
  };

  return (
    <div className="file-table">
      <h2>Uploaded Files</h2>
      <form onSubmit={handleUpload}>
        <label htmlFor="file">Upload File:</label>
        <input type="file" id="file" name="file" />
        <button type="submit">Upload</button>
      </form>
      <table>
        <thead>
          <tr>
            <th>File Name</th>
            <th>File Size</th>
            <th>Uploaded Date</th>
            <th>Action</th>
          </tr>
        </thead>
        <tbody>
          {files.map((file) => (
            <tr key={file.id}>
              <td>{file.fileName}</td>
              <td>{file.size} MB</td>
              <td>{new Date(file.uploadDate).toLocaleString()}</td>
              <td>
                <button
                  className="remove-button"
                  onClick={() => handleRemove(file)}
                >
                  Remove
                </button>
              </td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
}

export default FileTable;
