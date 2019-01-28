import React from "react";
import { WithContext as ReactTags } from "react-tag-input";
import { MDBAlert } from "mdbreact";
import axios from "axios";
import RegisterModal from "../../RegisterAndConnection/RegisterModal";

const KeyCodes = {
  comma: 188,
  enter: 13
};

const delimiters = [KeyCodes.comma, KeyCodes.enter];

class tagsManager extends React.Component {
  constructor(props) {
    super(props);

    this.state = {
      tagsDB: [],
      suggestions: [],
      tagValid: "",
      formError: "",
      success: null,
      error: null
    };
    this.handleDelete = this.handleDelete.bind(this);
    this.handleAddition = this.handleAddition.bind(this);
    this.onChange = this.onChange.bind(this);
    this.handleClearErrorMessage = this.handleClearErrorMessage.bind(this);
  }

  componentDidMount() {
    axios
      .post(`/api/tags/display`, sessionStorage)

      .then(async res => {
        if (res.data.empty !== "No tags in the user's list") {
          const tagTab = res.data.tags.split(", ");
          const newTags = tagTab.map(tag => {
            return {
              id: tag,
              text: "#" + tag
            };
          });
          this.setState({ tagsDB: newTags });
        }
        var tab = [];
        res.data.globalTags.forEach(function(element) {
          tab = tab.concat([{ id: element.content, text: element.content }]);
        });
        await this.setState({
          suggestions: [...this.state.suggestions, ...tab]
        });
      })
      .catch(err => {});
  }

  onChange = e => {
    const value = e;
    this.setState({ currentTag: value }, () => {
      this.validateField(value);
    });
  };

  validateField(value) {
    let tagValid = this.state.tagValid;
    tagValid = value.match(/^[a-zA-Z0-9_]+$/);
    if (tagValid && value.length > 0 && value.length <= 20) {
      this.setState({
        formError: "",
        tagValid: tagValid
      });
    } else {
      if (value === "") {
        this.setState({
          formError: "",
          tagValid: ""
        });
      } else {
        this.setState({
          formError:
            "error: Forbidden characters! It can only contain letters, numbers or '_'! Max length: 20.",
          tagValid: ""
        });
      }
    }
  }

  handleDelete(i) {
    const tagToDelete = this.state.tagsDB[i].text.split("#");
    sessionStorage.setItem("tagToDelete", tagToDelete[1]);
    axios
      .post(`/api/tags/delete`, sessionStorage)
      .then(res => {
        if (res.data.tags) {
          const tagTab = res.data.tags.split(", ");
          const newTags = tagTab.map(tag => {
            return {
              id: tag,
              text: "#" + tag
            };
          });
          this.setState({ tagsDB: newTags });
        } else if (res.data.empty) {
          this.setState({ tagsDB: [] });
        }
        this.props.getNewTags();
      })
      .catch(err => {});
  }

  async handleAddition(tag) {
    let tagValid = this.state.tagValid;
    tagValid = tag.text.match(/^[a-zA-Z0-9_]+$/);
    sessionStorage.setItem("tag", tag.text);
    if (
      tagValid &&
      tag.text.length > 0 &&
      tag.text.length <= 20 &&
      this.state.tagsDB.length <= 9
    ) {
      axios
        .post(`/api/tags/add`, sessionStorage)
        .then(res => {
          if (res.data.success) {
            let pos = this.state.suggestions
              .map(function(e) {
                return e.id;
              })
              .indexOf(tag.text);
            this.props.getNewTags();
            if (pos !== -1) {
              this.setState({
                success: res.data.success,
                tagsDB: [
                  ...this.state.tagsDB,
                  { id: tag.text, text: "#" + tag.text }
                ],
                formError: ""
              });
            } else {
              this.setState({
                success: res.data.success,
                tagsDB: [
                  ...this.state.tagsDB,
                  { id: tag.text, text: "#" + tag.text }
                ],
                suggestions: [
                  ...this.state.suggestions,
                  { id: tag.text, text: tag.text }
                ],
                formError: ""
              });
            }
          } else if (res.data.error) {
            this.setState({ error: res.data.error, formError: "" });
          }
        })
        .catch(err => {});
    } else {
      this.setState({
        formError:
          "Error while adding your tag. Forbidden characters, tag too long or limit of 10 tags reached."
      });
    }
  }

  handleClearErrorMessage() {
    this.setState({ error: undefined });
  }

  render() {
    const { tagsDB, suggestions } = this.state;
    return (
      <div className="interests">
        <ReactTags
          tags={tagsDB}
          suggestions={suggestions}
          delimiters={delimiters}
          handleDelete={this.handleDelete}
          handleAddition={this.handleAddition}
          allowDeleteFromEmptyInput={false}
          handleInputChange={this.onChange}
          allowDragDrop={false}
        />
        {this.state.formError && (
          <MDBAlert color="warning" dismiss className="error">
            {this.state.formError}
          </MDBAlert>
        )}
        <RegisterModal
          errorMessage={this.state.error}
          handleClearErrorMessage={this.handleClearErrorMessage}
        />
      </div>
    );
  }
}

export default tagsManager;
