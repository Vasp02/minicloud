import React, { useState } from 'react';
import RectangularButton from '../rectangularbutton/RectangularButton';
import RoundButton from '../roundbutton/Roundbutton';

const GalleryItem = ({ item, onVisualize, onDownload, onDelete }) => {
    const [isModalVisible, setIsModalVisible] = useState(false);

    const handleItemClick = () => {
        if (item.type === "FILE") {
            setIsModalVisible(true); 
        } else {
            onVisualize(item); 
        }
    };

    const handleButtonClick = (e, action) => {
        e.stopPropagation(); 
        action(item); 
    };

    const closeModal = () => setIsModalVisible(false);

    return (
        <div className="gallery-item" onClick={() => handleItemClick()}>
            <p>{item.name}</p>
            {item.type === "FILE" ? (
                <img className='gallery-img' src={`data:image/jpeg;base64,${item.base64Image}`} alt={item.name} />
            ) : item.type === "DIRECTORY" ? (
                <div className='dirsvg'>
                    <svg xmlns="http://www.w3.org/2000/svg" width="70%" height="70%" fill="currentColor" class="bi bi-folder" viewBox="0 0 16 16">
                        <path d="M.54 3.87.5 3a2 2 0 0 1 2-2h3.672a2 2 0 0 1 1.414.586l.828.828A2 2 0 0 0 9.828 3h3.982a2 2 0 0 1 1.992 2.181l-.637 7A2 2 0 0 1 13.174 14H2.826a2 2 0 0 1-1.991-1.819l-.637-7a2 2 0 0 1 .342-1.31zM2.19 4a1 1 0 0 0-.996 1.09l.637 7a1 1 0 0 0 .995.91h10.348a1 1 0 0 0 .995-.91l.637-7A1 1 0 0 0 13.81 4zm4.69-1.707A1 1 0 0 0 6.172 2H2.5a1 1 0 0 0-1 .981l.006.139q.323-.119.684-.12h5.396z"/>
                    </svg>
                </div>            
            ) : null}
            
            <div className='gallery-button-container'>
                <RectangularButton id={`visualize-${item.id}`} onClick={(e) => handleItemClick()} iconName="visualize" />
                <RectangularButton id={`download-${item.id}`} onClick={(e) => handleButtonClick(e, onDownload)} iconName="download" />
                <RectangularButton id={`delete-${item.id}`} onClick={(e) => handleButtonClick(e, onDelete)} iconName="delete" />
            </div>

            {isModalVisible && (
                <div className="modal-backdrop" onClick={closeModal}>
                    <div className="modal-content" onClick={e => e.stopPropagation()}>
                        <img src={`data:image/jpeg;base64,${item.base64Image}`} alt={item.name} />
                        <RoundButton onClick={closeModal} iconName="close" />
                    </div>
                </div>
            )}
        </div>
    );
};

export default GalleryItem;
