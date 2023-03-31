import React, { useState, useEffect } from "react";
import { Table, Button } from "react-bootstrap";

function FileTable() {
  const [files, setFiles] = useState([]);

  // Fetch list of uploaded files from API on component mount
  useEffect(() => {
    fetch("/api/file")
      .then((response) => response.json())
      .then((data) => setFiles(data))
      .catch((error) => console.error(error));
  }, []);

  // Handle file upload form submission
  const handleUpload = (event) => {
    event.preventDefault();
    const file = event.target.file.files[0];

    // Check file size before uploading
    if (file.size > 10 * 1024 * 1024) {
      alert("File size should be less than 10MB.");
      return;
    }

    const formData = new FormData();
    formData.append("file", file);

    fetch("/api/file", {
      method: "POST",
      body: formData,
    })
      .then((response) => response.json())
      .then((data) => setFiles([...files, data]))
      .catch((error) => console.error(error));
  };

  // Handle file removal
  const handleRemove = (file) => {
    fetch(`/api/file/${file.id}`, {
      method: "DELETE",
    })
      .then(() => setFiles(files.filter((f) => f.id !== file.id)))
      .catch((error) => console.error(error));
  };

  return (
    <div>
      <h2>Uploaded Files</h2>
      <form onSubmit={handleUpload}>
        <label htmlFor="file">Upload File:</label>
        <input type="file" id="file" name="file" />
        <button type="submit">Upload</button>
      </form>
      <Table striped bordered hover>
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
              <td>{file.name}</td>
              <td>{(file.size / 1024 / 1024).toFixed(2)} MB</td>
              <td>{new Date(file.uploadedDate).toLocaleString()}</td>
              <td>
                <Button variant="danger" onClick={() => handleRemove(file)}>
                  Remove
                </Button>
              </td>
            </tr>
          ))}
        </tbody>
      </Table>
    </div>
  );
}

export default FileTable;
