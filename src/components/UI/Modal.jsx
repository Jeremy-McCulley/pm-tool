import React, { useRef, useEffect } from 'react';
import { createPortal } from 'react-dom';
import { FiX } from 'react-icons/fi';

/**
 * Reusable modal component that renders its children in a portal outside the main DOM tree.
 *
 * @param {object} props
 * @param {boolean} props.isOpen - Controls the visibility of the modal.
 * @param {function} props.onClose - Function to call when the modal should be closed (e.g., clicking backdrop, pressing Escape).
 * @param {string} [props.title] - Optional title displayed in the modal header.
 * @param {React.ReactNode} props.children - The content to display inside the modal body.
 */
const Modal = ({ isOpen, onClose, title, children }) => {
  const modalRef = useRef(null);
  
  // 1. Hook for handling the Escape key press to close the modal
  useEffect(() => {
    if (!isOpen) return;

    const handleKeydown = (event) => {
      if (event.key === 'Escape') {
        onClose();
      }
    };

    document.addEventListener('keydown', handleKeydown);
    return () => {
      document.removeEventListener('keydown', handleKeydown);
    };
  }, [isOpen, onClose]);


  // If the modal is not open, return null (do not render anything)
  if (!isOpen) return null;

  // The Modal HTML structure (rendered inside the Portal)
  const modalContent = (
    // Backdrop overlay
    <div className="" onClick={onClose}>
      
      {/* Modal Container */}
      <div 
        ref={modalRef}
        className=""
        // Prevent closing the modal when clicking on the content itself
        onClick={(e) => e.stopPropagation()}
      >
        {/* Header (Title and Close Button) */}
        <div className="">
          <h3 className="">
            {title || 'Modal'}
          </h3>
          <button
            onClick={onClose}
            className=""
            aria-label="Close modal"
          >
            <FiX size={24} />
          </button>
        </div>

        {/* Body (Children) */}
        <div className="p-6">
          {children}
        </div>
      </div>
    </div>
  );

  // 2. Use React Portal to render the modal content outside the component hierarchy
  // We assume there is a div with the ID 'modal-root' in index.html or App.jsx
  return createPortal(
    modalContent,
    document.getElementById('modal-root') || document.body // Fallback to document.body if modal-root is missing
  );
};

export default Modal;