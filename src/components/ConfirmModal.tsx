import React from "react";

interface ConfirmModalProps {
  isOpen: boolean;
  onClose: () => void;
  onConfirm: () => void;
  title?: string;
  message?: string;
}

const ConfirmModal: React.FC<ConfirmModalProps> = ({
  isOpen,
  onClose,
  onConfirm,
  title = "Confirm Deletion",
  message = "Are you sure you want to delete this challenge?",
}) => {
  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 bg-black bg-opacity-60 flex justify-center items-center p-4 backdrop-blur-md">
      <div className="bg-gray-900 p-6 rounded-2xl shadow-lg max-w-sm w-full border border-gray-700 text-white">
        <h2 className="text-xl font-semibold mb-2 text-gray-200">{title}</h2>
        <p className="text-gray-400">{message}</p>

        <div className="flex justify-end space-x-3 mt-4">
          <button
            onClick={onClose}
            className="bg-gray-700 text-gray-300 px-4 py-2 rounded-lg hover:bg-gray-600 transition"
          >
            Cancel
          </button>
          <button
            onClick={onConfirm}
            className="bg-red-600 text-white px-4 py-2 rounded-lg hover:bg-red-500 transition"
          >
            Delete
          </button>
        </div>
      </div>
    </div>
  );
};

export default ConfirmModal;
