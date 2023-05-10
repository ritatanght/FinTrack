interface ModalProps {
  setShowAlert: React.Dispatch<React.SetStateAction<boolean>>;
  handleDelete: () => Promise<void>;
}

const Modal: React.FC<ModalProps> = ({ setShowAlert, handleDelete }) => {
  return (
    <div className="modal">
      <div className="modal__content">
        <p>Are you sure you want to delete this entry?</p>
        <div>
          <button className="btn modal__btn confirm" onClick={handleDelete}>
            Confirm
          </button>
          <button
            className="btn modal__btn"
            onClick={() => setShowAlert(false)}
          >
            Cancel
          </button>
        </div>
      </div>
    </div>
  );
};
export default Modal;
