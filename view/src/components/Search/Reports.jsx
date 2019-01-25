import React, { Component } from "react";
import { MDBIcon } from "mdbreact";
import ReportsModal from "./ReportsModal";

class Reports extends Component {
  _isMounted = false
  constructor(props) {
    super(props)
    this.state = {
      reportMessage: null
    }
    this.openBlockModal = this.openBlockModal.bind(this)
    this.openReportFakeModal = this.openReportFakeModal.bind(this)
    this.closeConfirmationReport = this.closeConfirmationReport.bind(this)
    this.updateUsersListAfterReport = this.updateUsersListAfterReport.bind(this)
  }
  componentDidMount() {
    this._isMounted = true
  }

  openReportFakeModal() {
    if (this._isMounted) {
      this.setState({ reportMessage: 'report as a fake' })
    }
  }

  openBlockModal() {
    if (this._isMounted) {
      this.setState({ reportMessage: 'block' })
    }
  }

  closeConfirmationReport() {
    if (this._isMounted) {
      this.setState({ reportMessage: undefined })
    }
  }

  updateUsersListAfterReport() {
    if (this.props.updateUsersListAfterReport) {
      this.props.updateUsersListAfterReport(this.props.item)
    } else {
      this.props.redirectToExplorer()
    }
  }

  componentWillUnmout() {
    this._isMounted = false
  }

  render() {
    const { reportMessage } = this.state
    const userId = this.props.item.userId
    const myId = sessionStorage.getItem('userId')
    return (
      <div style={{ display: 'flex', justifyContent: 'flex-end' }}>
        <MDBIcon onClick={this.openReportFakeModal} alt="Report as a fake user" icon="warning" />
        <MDBIcon onClick={this.openBlockModal} style={{ marginLeft: '5px' }} alt="Block" icon="hand-stop-o" />
        <ReportsModal
          reportMessage={reportMessage}
          closeConfirmationReport={this.closeConfirmationReport}
          userReported={userId}
          userReporter={myId}
          updateUsersListAfterReport={this.updateUsersListAfterReport}
        />
      </div>
    );
  }
}

export default Reports 