import React from 'react';

const DeleteConfirmModal = ({ isOpen, onClose, onConfirm, item, itemType = 'user' }) => {
  if (!isOpen) return null;

  // Determine display properties based on item type
  const displayConfig = {
    user: {
      title: 'Delete User',
      nameDisplay: `${item.firstName} ${item.lastName}`,
      buttonText: 'Delete User'
    },
    workout: {
      title: 'Delete Workout',
      nameDisplay: item.name,
      buttonText: 'Delete Workout'
    },
    notification: {
      title: 'Delete Notification',
      nameDisplay: item.message ? 
        (item.message.length > 30 ? `${item.message.substring(0, 30)}...` : item.message) : 
        'this notification',
      buttonText: 'Delete Notification'
    }
  };

  const config = displayConfig[itemType] || displayConfig.user;

  return (
    <div className="modal-overlay">
      <div className="modal confirmation-modal">
        <h2>Confirm {config.title}</h2>
        <p>
          Are you sure you want to delete this {itemType}?
          This action cannot be undone.
        </p>
        <div className="modal-actions">
          <button 
            onClick={onClose} 
            className="cancel-btn"
          >
            Cancel
          </button>
          <button 
            onClick={onConfirm} 
            className="delete-btn"
          >
            {config.buttonText}
          </button>
        </div>
      </div>
    </div>
  );
};

export default DeleteConfirmModal;