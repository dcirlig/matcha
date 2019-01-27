import React, { Component } from "react";
import { MDBBtn, MDBIcon, MDBInput, MDBAlert } from "mdbreact";
import "antd/dist/antd.css";
import { Calendar } from "antd";
import Select from "react-select";
import axios from "axios";

var moment = require("moment");
moment().format();

const orientations = [
  {
    value: "bisexual",
    label: "Bisexual",
    className: "custom-class",
    name: "sexualOrientation"
  },
  {
    value: "heterosexual",
    label: "Heterosexual",
    className: "custom-class",
    name: "sexualOrientation"
  },
  {
    value: "homosexual",
    label: "Homosexual",
    className: "custom-class",
    name: "sexualOrientation"
  }
];

class Preferences extends Component {
  constructor(props) {
    super(props);

    this.state = {
      userId: sessionStorage.getItem("userId"),
      gender: "",
      sexualOrientation: "bisexual",
      bio: "",
      age: "",
      defaultDateValue: "",
      styleMan: {
        color: ""
      },
      styleWoman: {
        color: ""
      },
      orientations: orientations,
      selectedOption: null,
      open: false,
      formError: "",
      error: "",
      success: ""
    };
    this.selectFemale = this.selectFemale.bind(this);
    this.selectMale = this.selectMale.bind(this);
    this.onChange = this.onChange.bind(this);
    this.selectDate = this.selectDate.bind(this);
    this.handleKeyPress = this.handleKeyPress.bind(this);
    this.openCalendar = this.openCalendar.bind(this);
  }

  componentDidMount() {
    axios
      .post(`/api/preferences/display`, sessionStorage)

      .then(async res => {
        if (res.data.success) {
          var dateObj = new Date(res.data.birthDate);
          var momentObj = moment(dateObj);
          if (res.data.gender === "female") {
            var colorWoman = "#eb5e49";
          } else if (res.data.gender === "male") {
            var colorMan = "#eb5e49";
          }
          await this.setState({
            defaultDateValue: momentObj,
            gender: res.data.gender,
            sexualOrientation: res.data.sexualOrientation,
            bio: res.data.bio,
            styleWoman: {
              color: colorWoman
            },
            styleMan: {
              color: colorMan
            },
            selectedOption: {
              value: res.data.gender,
              label:
                res.data.sexualOrientation.charAt(0).toUpperCase() +
                res.data.sexualOrientation.slice(1),
              className: "custom-class",
              name: "sexualOrientation"
            },
            age: res.data.age
          });
        }
      })
      .catch(err => { });
  }

  async updateDatabase(data) {
    const userId = this.state.userId;
    const dataTab = { userId: userId, data };
    this.props.getNewPreferences()
    axios
      .post(`/api/preferences/update`, dataTab)

      .then(async res => {
        if (res.data.success) {
          await this.setState({
            success: res.data.success
          });
        }
      })
      .catch(err => { });
  }

  async selectFemale() {
    await this.setState({
      gender: "female",
      styleWoman: { color: "#eb5e49" },
      styleMan: { color: "" }
    });
    const gender = { gender: "female" };
    this.updateDatabase(gender);
  }

  async selectMale() {
    await this.setState({
      gender: "male",
      styleMan: { color: "#eb5e49" },
      styleWoman: { color: "" }
    });
    const gender = { gender: "male" };
    this.updateDatabase(gender);
  }

  async selectDate(date) {
    var dateString = date._d.toString();
    var duration = moment.duration(moment() - date, "milliseconds");
    var years = duration.asYears();
    var age = Math.floor(years);
    await this.setState({ age: age, defaultDateValue: date });
    const userAge = { age: age, birthdate: dateString };
    this.updateDatabase(userAge);
  }

  onChange = async e => {
    if (e.value) {
      await this.setState({ sexualOrientation: e.value, selectedOption: e });
      const sexualOrientation = { sexualOrientation: e.value };
      this.updateDatabase(sexualOrientation);
      return;
    } else {
      const name = e.target.name;
      var value = e.target.value;
      if (name === "bio") {
        value = value.match(
          /^[a-zA-Z0-9áàâäãåçéèêëíìîïñóòôöõúùûüýÿæœÁÀÂÄÃÅÇÉÈÊËÍÌÎÏÑÓÒÔÖÕÚÙÛÜÝŸÆŒ\s:,;?.!()[\]"'/]+$/
        );
        if (value && e.target.value.length >= 140) {
          await this.setState({
            formError: "Too long! Your bio must contain 140 characters maximum."
          });
          return;
        }
        if (value === null && e.target.value !== "") {
          await this.setState({
            formError:
              "Your bio must contain only upper and lower case letters, numbers, punctuation and spaces."
          });
          return;
        }
      }
      await this.setState({ [name]: value, formError: "" });
    }
  };

  handleKeyPress = e => {
    if (e.key === "Enter") {
      if (
        this.state.formError ===
        "Too long! Your bio must contain 140 characters maximum." ||
        this.state.formError ===
        "Your bio must contain only upper and lower case letters, numbers, punctuation and spaces."
      ) {
      } else {
        const biography = { bio: this.state.bio };
        if (biography.bio && biography.bio[0].length > 0) {
          this.updateDatabase(biography);
        }
        e.preventDefault();
      }
    }
  };

  async openCalendar() {
    await this.setState({ open: !this.state.open });
  }

  render() {
    const {
      age,
      styleMan,
      styleWoman,
      orientations,
      selectedOption,
      defaultDateValue,
      open
    } = this.state;
    const divStyle = {
      width: 300,
      border: "1px solid #d9d9d9",
      borderRadius: 4
    };
    return (
      <div>
        <p className="tagIntro warm-flame-gradient">Define who you are</p>
        <div className="gender">
          <MDBIcon
            onClick={this.selectFemale}
            icon="female"
            size="5x"
            className="genderIcon"
            style={styleWoman}
          />
          <MDBIcon
            onClick={this.selectMale}
            icon="male"
            size="5x"
            className="genderIcon"
            style={styleMan}
          />
        </div>
        <div>
          <Select
            value={selectedOption}
            onChange={e => this.onChange(e)}
            options={orientations}
            placeholder="Select your sexual orientation..."
            className="sexualOrientation"
            classNamePrefix="sexual-orientation-select"
          />
        </div>
        <h3 className="userAge">{age} y.o.</h3>
        {age ? (
          <div>
            <MDBBtn
              onClick={this.openCalendar}
              className="small-button"
              rounded
              size="lg"
              gradient="peach"
            >
              Modify your birth date
              <MDBIcon icon="birthday-cake" className="ml-2" size="lg" />
            </MDBBtn>
            {open ? (
              <div style={divStyle} className="birthDate">
                <Calendar
                  fullscreen={false}
                  validRange={[
                    moment().subtract(99, "years"),
                    moment().subtract(18, "years")
                  ]}
                  onChange={this.selectDate}
                  defaultValue={
                    defaultDateValue
                      ? defaultDateValue
                      : moment().subtract(25, "years")
                  }
                />
              </div>
            ) : (
                ""
              )}
          </div>
        ) : (
            <div style={divStyle} className="birthDate">
              <Calendar
                fullscreen={false}
                validRange={[
                  moment().subtract(99, "years"),
                  moment().subtract(18, "years")
                ]}
                onChange={this.selectDate}
                defaultValue={
                  defaultDateValue
                    ? defaultDateValue
                    : moment().subtract(25, "years")
                }
              />
            </div>
          )}
        <div className="bio">
          <p className="tagIntro warm-flame-gradient">
            Express yourself, set your interests!
          </p>
          <div className="bio-Field">
            {this.state.formError ? <MDBAlert color="warning" dismiss>{this.state.formError}</MDBAlert> : ""}
            <MDBInput
              name="bio"
              type="textarea"
              label="Tell people more about you and press Enter to validate"
              rows="2"
              icon="pencil"
              onKeyPress={this.handleKeyPress}
              onChange={e => this.onChange(e)}
              value={this.state.bio ? this.state.bio.toString() : ""}
            />
          </div>
        </div>
      </div>
    );
  }
}

export default Preferences;
