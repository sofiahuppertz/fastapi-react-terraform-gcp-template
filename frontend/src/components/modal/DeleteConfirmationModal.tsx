import React from 'react';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faExclamationTriangle } from '@fortawesome/free-solid-svg-icons';
import { palettes, text, colors } from '@/theme/colors';
import { DeleteButton, CancelButton } from '@/components/buttons';

interface DeleteConfirmationModalProps {
  isOpen: boolean;
  onClose: () => void;
  onConfirm: () => void;
  isDeleting?: boolean;
  title: string;
  description: string;
  itemName?: string;
  confirmButtonText?: string;
  cancelButtonText?: string;
}

const DeleteConfirmationModal: React.FC<DeleteConfirmationModalProps> = ({
  isOpen,
  onClose,
  onConfirm,
  isDeleting = false,
  title,
  description,
  itemName,
  confirmButtonText = "Delete",
  cancelButtonText = "Cancel"
}) => {
  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center" style={{ zIndex: 10000 }}>
      <div 
        className="rounded-xl p-6 max-w-md w-full mx-4 shadow-xl"
        style={{
          backgroundColor: 'white',
          border: `1px solid ${palettes.primary[1]}`
        }}
      >
        <div className="flex items-center space-x-3 mb-4">
          <div 
            className="h-10 w-10 rounded-full flex items-center justify-center"
            style={{
              backgroundColor: palettes.danger[0] + '50',
              color: colors.danger
            }}
          >
            <FontAwesomeIcon icon={faExclamationTriangle} className="h-5 w-5" />
          </div>
          <div>
            <h3 
              className="font-heading"
              style={{
                color: text.primary
              }}
            >
              {title}
            </h3>
            <p 
              className="text-sm"
              style={{
                color: text.subtle
              }}
            >
              This action cannot be undone
            </p>
          </div>
        </div>
        
        <p 
          className="mb-6 font-body"
          style={{
            color: text.secondary
          }}
        >
          {description}
          {itemName && (
            <span 
              className="font-medium font-mono capitalize"
              style={{
                color: text.primary
              }}
            >
              {" "}{itemName}
            </span>
          )}
          ?
        </p>
        
        <div className="flex items-center justify-end space-x-3">
          <CancelButton
            onClick={onClose}
            disabled={isDeleting}
            tooltip="Cancel"
          />
          <div data-batch-delete-controls>
            <DeleteButton
              onClick={onConfirm}
              disabled={isDeleting}
              loading={isDeleting}
              tooltip="Delete"
            />
          </div>
        </div>
      </div>
    </div>
  );
};

export default DeleteConfirmationModal;

