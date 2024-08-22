import React from 'react';
import './AddEngineerModal.css';

const EngineerModal = ({ show, onClose, children }) => {
  if (!show) return null; 

  return (
    <>
      <div className={`modal-overlay ${show ? 'show' : ''}`} onClick={onClose}></div>
      <div className={`modal ${show ? 'show' : ''}`} role="dialog" aria-labelledby="modal-title" aria-hidden={!show}>
        <div className="modal-content">
          <span className="close-btn" onClick={onClose} aria-label="Close modal">&times;</span>
          {children}
        </div>
      </div>
    </>
  );
};

export default EngineerModal;
