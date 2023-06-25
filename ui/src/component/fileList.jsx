import React from 'react';

function FileList({ files, onRemove }) {
  const formatUploadDate = (uploadDate) => {
    const date = new Date(uploadDate);
    return date.toLocaleString();
  };

  return (
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
            <td>{file.fileName || 'N/A'}</td>
            <td>{file.size ? `${file.size} MB` : 'N/A'}</td>
            <td>{formatUploadDate(file.uploadDate || new Date())}</td>
            <td>
              <button className="remove-button" onClick={() => onRemove(file)}>
                Remove
              </button>
            </td>
          </tr>
        ))}
      </tbody>
    </table>
  );
}

export default FileList;
