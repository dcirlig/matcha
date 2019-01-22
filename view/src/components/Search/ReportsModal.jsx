import React from "react";
import Modal from "react-modal";
import axios from "axios";

Modal.setAppElement(document.getElementById("root"));

const ReportsModal = props => {
  const reportBlock = () => {
    if (props.reportMessage === "report as a fake") {
      axios
        .post(`/api/reportUser`, props)
        .then(res => {
          if (res.data.success) {
          } else if (res.data.error) {
          }
        })
        .catch(err => {});
    } else if (props.reportMessage === "block") {
      axios
        .post(`/api/blockUser`, props)
        .then(res => {
          if (res.data.success) {
          } else if (res.data.error) {
          }
        })
        .catch(err => {});
    }
    props.closeConfirmationReport();
    props.updateUsersListAfterReport();
  };
  return (
    <Modal
      isOpen={!!props.reportMessage}
      onRequestClose={props.closeConfirmationReport}
      contentLabel="Are you sure you want to delete this user?"
      closeTimeoutMS={200}
      className="modalFeatures"
    >
      {props.reportMessage && (
        <h3 className="modal__title">
          Are you sure you want to {props.reportMessage} this user?
        </h3>
      )}
      <button className="reportsModalButton" onClick={reportBlock}>
        Confirm
      </button>
      <button
        className="reportsModalButton"
        onClick={props.closeConfirmationReport}
      >
        Cancel
      </button>
    </Modal>
  );
};

export default ReportsModal;
