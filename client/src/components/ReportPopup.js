// PopupReport.js

import React from 'react';

function ReportPopup({ isOpen, setIsOpen, onConfirmReport }) {
  return (
    <div className="popup-container">
      {isOpen && (
        <div className="popup">
          <p>Are you sure you want to report this message?</p>
          <button onClick={() => setIsOpen(false)}>Cancel</button>
          <button onClick={onConfirmReport}>Report</button>
        </div>
      )}
    </div>
  );
}

export default ReportPopup;
