import React, { useRef } from 'react';

function FileUploadForm({ onUpload }) {
  const fileInputRef = useRef(null);

  const handleSubmit = (event) => {
    event.preventDefault();
    const file = fileInputRef.current.files[0];

    if (!file) {
      alert('Please select a file.');
      return;
    }

    if (file.size > 10 * 1024 * 1024) {
      alert('File size should be less than 10MB.');
      return;
    }

    onUpload(file);
    event.target.reset();
  };

  return (
    <form onSubmit={handleSubmit}>
      <label htmlFor="file">Upload File:</label>
      <input type="file" id="file" name="file" ref={fileInputRef} />
      <button type="submit">Upload</button>
    </form>
  );
}

export default FileUploadForm;
