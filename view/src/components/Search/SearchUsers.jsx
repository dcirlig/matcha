import React, { Component } from "react";
import { Slider } from "antd";
import "antd/dist/antd.css";
import axios from "axios";

const INITIAL_STATE = {
  userId: sessionStorage.getItem("userId"),
  ageInterval: [18, 99],
  distMax: 100,
  popularityScoreInterval: [0, 1000],
  listTags: "",
  usersList: []
};

class SearchUsersPage extends Component {
  constructor(props) {
    super(props);
    this.state = { ...INITIAL_STATE };
    this.onChangeAge = this.onChangeAge.bind(this);
    this.onChangeDistance = this.onChangeDistance.bind(this);
    this.onChangePopularity = this.onChangePopularity.bind(this);
    this.handleAfterChange = this.handleAfterChange.bind(this);
  }

  onChangeAge = e => {
    this.setState({ ageInterval: e });
  };
  handleAfterChange = e => {
    axios.post(`/api/searchUsers`, this.state).then(res => {
      if (res.data.user_list) {
        this.setState({ usersList: res.data.user_list });
      } else {
        console.log("error");
      }
    });
  };

  onChangeDistance = e => {
    this.setState({ distMax: e });
  };

  onChangePopularity = e => {
    this.setState({ popularityScoreInterval: e });
  };
  coucou = () => {
    console.log("coucou");
  };
  render() {
    const { ageInterval, distMax, popularityScoreInterval } = this.state;
    return (
      <div className="container">
        <div className="col-md-4">
          <Slider
            range
            min={18}
            max={99}
            value={ageInterval}
            onChange={this.onChangeAge}
            onAfterChange={this.handleAfterChange}
          />

          <Slider
            max={100}
            value={distMax}
            onChange={this.onChangeDistance}
            onAfterChange={this.handleAfterChange}
          />
          <Slider
            range
            min={0}
            max={1000}
            value={popularityScoreInterval}
            onChange={this.onChangePopularity}
            onAfterChange={e => this.handleAfterChange(e)}
          />
        </div>
        <div className="col-md-6" />
      </div>
    );
  }
}

export default SearchUsersPage;
