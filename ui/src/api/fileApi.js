const BASE_URL = '/file';

export const fetchFiles = async () => {
  try {
    const response = await fetch(BASE_URL);
    if (!response.ok) {
      throw new Error('Failed to fetch files.');
    }
    return response.json();
  } catch (error) {
    throw new Error('Failed to fetch files.');
  }
};

export const uploadFile = async (file) => {
  try {
    const formData = new FormData();
    formData.append('file', file);

    const response = await fetch(BASE_URL, {
      method: 'POST',
      body: formData
    });
    if (!response.ok) {
      throw new Error('Failed to upload file.');
    }
    return response.json();
  } catch (error) {
    throw new Error('Failed to upload file.');
  }
};

export const removeFile = async (fileId) => {
  try {
    const response = await fetch(`${BASE_URL}/${fileId}`, {
      method: 'DELETE'
    });
    if (!response.ok) {
      throw new Error('Failed to remove file.');
    }
  } catch (error) {
    throw new Error('Failed to remove file.');
  }
};
