import React from "react";
import Modal from "react-modal";
import ProfilePreview from "./profilePreview"

Modal.setAppElement(document.getElementById("root"));

const ProfilePreviewModal = props => (
  <Modal
    isOpen={props.profilePreview}
    onRequestClose={props.closeProfilePreview}
    contentLabel="Check your profile"
    closeTimeoutMS={200}
    className="profilePreviewModal"
    overlayClassName="profilePreviewOverlay"
  >
    <ProfilePreview
      match={{ params: { username: props.username } }} />
    <button className="modalButton" onClick={props.closeProfilePreview}>
      Close
    </button>
  </Modal>
);

export default ProfilePreviewModal;