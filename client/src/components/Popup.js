// Popup.js

import React from 'react';

function Popup({ isOpen, setIsOpen, onConfirmSend }) {
  return (
    <div className="popup-container">
      {isOpen && (
        <div className="popup">
          <p>The message you have typed is Offensive.</p>
          <button onClick={() => setIsOpen(false)}>Cancel</button>
          <button onClick={onConfirmSend}>Send Anyway</button>
        </div>
      )}
    </div>
  );
}

export default Popup;
