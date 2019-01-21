import React from "react";
import Modal from "react-modal";

Modal.setAppElement(document.getElementById("root"));

const SubscriptionModal = props => (
  <Modal
    isOpen={!!props.errorMessage}
    onRequestClose={props.handleClearErrorMessage}
    contentLabel="Invalid Field"
    closeTimeoutMS={200}
    className="modalFeatures"
  >
    <h3 className="modal__title">Invalid field(s)</h3>
    {props.errorMessage && <p className="modal__body">{props.errorMessage}</p>}
    <button className="modalButton" onClick={props.handleClearErrorMessage}>
      Close
    </button>
  </Modal>
);

export default SubscriptionModal;
