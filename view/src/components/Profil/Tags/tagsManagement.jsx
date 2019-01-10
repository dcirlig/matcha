import React from "react";
import { WithContext as ReactTags } from "react-tag-input";
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
        res.data.globalTags.forEach(function (element) {
          tab = tab.concat([{ id: element.content, text: element.content }]);
        });
        await this.setState({
          suggestions: [...this.state.suggestions, ...tab]
        });
      })
      .catch(err => { });
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
    if (tagValid) {
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
            "error: Forbidden characters! Your tag can only contain letters, numbers or '_'!",
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
      })
      .catch(err => { });
  }

  async handleAddition(tag) {
    let tagValid = this.state.tagValid;
    tagValid = tag.text.match(/^[a-zA-Z0-9_]+$/);
    sessionStorage.setItem("tag", tag.text);
    if (tagValid) {
      this.props.getNewTags()
      axios
        .post(`/api/tags/add`, sessionStorage)
        .then(res => {
          if (res.data.success) {
            this.setState({ success: res.data.success });
          } else if (res.data.error) {
            this.setState({ error: res.data.error });
          }
        })
        .catch(err => { });
      await this.setState(state => ({
        tagsDB: [...state.tagsDB, { id: tag.text, text: "#" + tag.text }],
        suggestions: [...state.suggestions, { id: tag.text, text: tag.text }],
        formError: ""
      }));
    } else {
      this.setState({ formError: "error" });
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
          <p className="error">{this.state.formError}</p>
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
