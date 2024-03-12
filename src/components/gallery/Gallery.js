import React, { useState, useEffect } from 'react';
import axios from 'axios';
import './Gallery.css';
import RoundButton from '../roundbutton/Roundbutton';
import GalleryItem from '../galleryitem/GalleryItem';

const Gallery = () => {
    const [items, setItems] = useState([]);
    const [selectedFiles, setSelectedFiles] = useState([]);
    const [currentPath, setCurrentPath] = useState(""); 
    const [isModalVisible, setIsModalVisible] = useState(false);
    const [uploadTrigger, setUploadTrigger] = useState(0); 


    useEffect(() => {
        fetchGalleryItems(currentPath);
    }, [currentPath, uploadTrigger]);

    const sortItems = (items) => {
        return items.sort((a, b) => {
            if (a.type === "DIRECTORY" && b.type !== "DIRECTORY") {
                return -1; 
            } else if (a.type !== "DIRECTORY" && b.type === "DIRECTORY") {
                return 1;
            } else {
                return 0; 
            }
        });
    };
    


    const fetchGalleryItems = async (path) => {
        const token = localStorage.getItem('token');
        if (!token) {
            console.log('No JWT token found. Please log in.');
            return;
        }
        try {
            const response = await axios.get('http://localhost:8080/api/cloud/getfiles', {
                params: { 
                    path: path,
                },
                headers: {
                    'Authorization': `Bearer ${token}`,
                },
            });
            
            if (response.data) {
                const sortedItems = sortItems(response.data); 
                setItems(sortedItems);
            } else {
                console.log('No data received from server');
            }
        } catch (error) {
            console.error('Error fetching gallery items:', error);
        }
    };


  const handleFileChange = (event) => {
    setSelectedFiles(event.target.files); 
  };


  const handleUpload = async (event) => {
    event.preventDefault();
  
    if (selectedFiles.length === 0) {
        alert('Please select one or more files to upload.');
        return;
    }
  
    const formData = new FormData();
    const jwtToken = localStorage.getItem('token');

    if (!jwtToken) {
        alert('No JWT token found. Please log in.');
        return;
    }
  
    formData.append("userPath", currentPath || "/"); 
    Array.from(selectedFiles).forEach((file) => {
        formData.append('files', file); 
    });
  
    try {
        const response = await axios.post('http://localhost:8080/api/cloud/upload', formData, {
            headers: {
                'Authorization': `Bearer ${jwtToken}`,
            },
        });
        console.log("Upload successful", response.data);
        setSelectedFiles([]); 
        setUploadTrigger(uploadTrigger + 1); 
        event.target.reset();
    } catch (error) {
        console.error('Error uploading files:', error);
        alert('Error uploading files.');
    }
};


  const handleVisualize = (item) => {
    if (item.type === "DIRECTORY") {
        const newPath = `${currentPath}/${item.name}`.replace(/^\/?/, '/');

        console.log("newpath", newPath);
        setCurrentPath(newPath);
    } else {
        console.log("Visualize", item);
    }
};
const navigateUp = () => {
    const pathSegments = currentPath.split('/');
    pathSegments.pop(); 
    setCurrentPath(pathSegments.join('/') || "");
};
const handleDownload = async (item) => {
    if (item.type === "FILE") {
        const downloadUrl = `http://localhost:8080/api/cloud/download?path=${encodeURIComponent(currentPath + '/' + item.name)}`;
        const token = localStorage.getItem('token');
        
        try {
            const response = await axios.get(downloadUrl, {
                responseType: 'blob', 
                headers: {
                    'Authorization': `Bearer ${token}`,
                },
            });
            

            const url = window.URL.createObjectURL(new Blob([response.data]));
            const link = document.createElement('a');
            link.href = url;
            link.setAttribute('download', item.name); 
            document.body.appendChild(link);
            link.click();
            
            link.parentNode.removeChild(link);
            window.URL.revokeObjectURL(url);
            
            console.log("Downloading:", item.name);
        } catch (error) {
            console.error('Error downloading file:', error);
            alert('Error downloading file.');
        }
    } else {
        alert("Cannot download directories.");
    }
};

const handleDelete = async (pathFromUserRoot) => {
    console.log("to delete" + pathFromUserRoot);
    const token = localStorage.getItem('token');
    if (!token) {
        alert('No JWT token found. Please log in.');
        return;
    }

    try {
        const response = await axios.delete(`http://localhost:8080/api/cloud/delete?path=${encodeURIComponent(pathFromUserRoot)}`, {
            headers: {
                'Authorization': `Bearer ${token}`,
            },
        });

        if (response.status === 200 || response.status === 204) {
            console.log("File deleted successfully");
            setUploadTrigger(prev => prev + 1);
            fetchGalleryItems();
        } else {
            console.error('Failed to delete the file');
            alert('Failed to delete the file.');
        }
    } catch (error) {
        console.error('Error deleting the file:', error);
        alert('Error deleting the file.');
    }
};



const handleCreateFolder = async (folderName) => {
    const token = localStorage.getItem('token'); 
    if (!token) {
        alert('No JWT token found. Please log in.');
        return;
    }

    try {
        const requestBody = {
            folderName: folderName,
            path: currentPath, 
        };
        const response = await axios.post('http://localhost:8080/api/cloud/createFolder', requestBody, {
            headers: {
                'Authorization': `Bearer ${token}`,
            },
        });

        if (response.status === 200 || response.status === 201) {
            console.log("Folder created successfully");
            setIsModalVisible(false); 
            setUploadTrigger(prevTrigger => prevTrigger + 1); 
        } else {
            console.error('Failed to create the folder');
            alert('Failed to create the folder.');
        }
    } catch (error) {
        console.error('Error creating the folder:', error);
        alert('Error creating the folder.');
    }
};

const FolderCreationModal = ({ onClose, onCreate }) => {
    const [folderName, setFolderName] = useState('');
    return (
        <div className="modal-backdrop">
            <div className="modal-content">
                <input type="text" placeholder="Folder Name" value={folderName} onChange={(e) => setFolderName(e.target.value)} />
                <div>
                    <button onClick={() => onCreate(folderName)}>Create</button>
                    <button onClick={onClose}>Cancel</button>
                </div>
            </div>
        </div>
    );
};
  

  return (
    <div>
        <div className='upload-section-container'>
            <div className="upload-section">
                <form onSubmit={handleUpload}>
                    <div className='inline-upload-form'>
                        <label htmlFor="file-upload" className="custom-file-upload">
                            <input id="file-upload" type="file" multiple onChange={handleFileChange} />
                            Choose Files...
                        </label>
                        <RoundButton type="submit" iconName="plus" />
                    </div>
                </form>
                <div className='buttons-container'>
                    {currentPath && (
                        <RoundButton onClick={navigateUp} iconName="navigateup" />
                    )}
                    <RoundButton onClick={() => setIsModalVisible(true)} iconName="newfolder" />
                </div>

            </div>
            
        </div>
        

        {isModalVisible && 
                <FolderCreationModal
                    onCreate={handleCreateFolder}
                    onClose={() => setIsModalVisible(false)}
                />
            }

        <div className='gallery-container'>
        <div className="current-path-display">
                    {currentPath || "Root"} 
                </div>
            <div className="gallery">
                 
                {items.map((item, index) => (
                    <GalleryItem
                        key={index}
                        item={item}
                        onVisualize={handleVisualize}
                        onDownload={handleDownload}
                        onDelete={() => handleDelete(item.pathFromUserRoot + "/" + item.name)}
                    />
                ))}
            </div>
        </div>
        
    </div>
);
};

export default Gallery;
