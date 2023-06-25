import React, { useState, useEffect } from 'react';
import './fileTable.css';
import FileUploadForm from './fileUploadForm';
import FileList from './fileList';
import { fetchFiles, uploadFile, removeFile } from '../api/fileApi';

function FileTable() {
  const [files, setFiles] = useState([]);

  useEffect(() => {
    fetchFileList();
  }, []);

  const fetchFileList = async () => {
    try {
      const fileList = await fetchFiles();
      setFiles(fileList);
    } catch (error) {
      console.error(error);
    }
  };

  const handleUpload = async (file) => {
    try {
      await uploadFile(file);
      fetchFileList(); // Fetch the updated file list from the backend
    } catch (error) {
      console.error(error);
    }
  };

  const handleRemove = async (file) => {
    try {
      await removeFile(file.id);
      fetchFileList(); // Fetch the updated file list from the backend
    } catch (error) {
      console.error(error);
    }
  };

  return (
    <div className="file-table">
      <h2>Uploaded Files</h2>
      <FileUploadForm onUpload={handleUpload} />
      <FileList files={files} onRemove={handleRemove} />
    </div>
  );
}

export default FileTable;
