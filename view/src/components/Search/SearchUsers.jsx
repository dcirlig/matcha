import React, { Component } from "react";
import { Slider } from "antd";
import "antd/dist/antd.css";
import axios from "axios";
import { Card } from "antd";
import { WithContext as ReactTags } from "react-tag-input";

const { Meta } = Card;
const INITIAL_STATE = {
  userId: {
    userId: sessionStorage.getItem("userId")
  },
  searchOptions: {
    ageInterval: [18, 99],
    distMax: 100,
    popularityScoreInterval: [0, 1000],
    listTags: "",
    usersList: [],
    userId: sessionStorage.getItem("userId")
  }
};

class SearchUsersPage extends Component {
  constructor(props) {
    super(props);
    this.state = { ...INITIAL_STATE };
    this.onChangeAge = this.onChangeAge.bind(this);
    this.onChangeDistance = this.onChangeDistance.bind(this);
    this.onChangePopularity = this.onChangePopularity.bind(this);
    this.handleSubmit = this.handleSubmit.bind(this);
  }

  componentWillMount() {
    axios.post(`/api/searchUsers`, this.state.userId).then(res => {
      if (res.data.user_list) {
        const searchOptions = Object.assign({}, this.state.searchOptions, {
          usersList: res.data.user_list
        });
        this.setState({ searchOptions });
      } else {
        console.log("error");
      }
    });
  }

  onChangeAge = e => {
    const searchOptions = Object.assign({}, this.state.searchOptions, {
      ageInterval: e
    });
    this.setState({ searchOptions });
  };

  onChangeDistance = e => {
    const searchOptions = Object.assign({}, this.state.searchOptions, {
      distMax: e
    });
    this.setState({ searchOptions });
  };

  onChangePopularity = e => {
    const searchOptions = Object.assign({}, this.state.searchOptions, {
      popularityScoreInterval: e
    });
    this.setState({ searchOptions });
  };

  onChangeTagsList = e => {
    const searchOptions = Object.assign({}, this.state.searchOptions, {
      [e.target.name]: e.target.value
    });
    this.setState({ searchOptions });
  };
  handleSubmit = e => {
    e.preventDefault();
    axios.post(`/api/searchUsers`, this.state).then(res => {
      if (res.data.user_list) {
        const searchOptions = Object.assign({}, this.state.searchOptions, {
          usersList: res.data.user_list
        });
        this.setState({ searchOptions });
      } else {
        console.log("error");
      }
    });
  };

  render() {
    const { searchOptions } = this.state;
    var usersList = searchOptions.usersList;
    return (
      <div className="container">
        <div className="col-md-4">
          <form>
            <Slider
              range
              min={18}
              max={99}
              value={searchOptions.ageInterval}
              name="ageInterval"
              onChange={this.onChangeAge}
            />

            <Slider
              max={100}
              value={searchOptions.distMax}
              onChange={this.onChangeDistance}
              name="distMax"
            />
            <Slider
              range
              min={0}
              max={1000}
              value={searchOptions.popularityScoreInterval}
              name="popularityScoreInterval"
              onChange={this.onChangePopularity}
            />
            <label htmlFor="searchTagsInput">
              Search by tags:
              <input
                name="listTags"
                type="text"
                id="searchTagsInput"
                placeholder="green, geek"
                onChange={e => this.onChangeTagsList(e)}
                value={searchOptions.listTags}
              />
            </label>
            <button type="submit" onClick={e => this.handleSubmit(e)}>
              Search
            </button>
          </form>
        </div>

        {usersList.length > 0 ? (
          <div className="col-md-4">
            {usersList.map((item, index) => (
              <div key={index}>
                <Card
                  hoverable
                  style={{ width: 240 }}
                  cover={
                    <img
                      alt="example"
                      src={`https://localhost:4000/${item.profil_image}`}
                    />
                  }
                >
                  <Meta
                    title={`${item.firstname} ${item.lastname}, ${
                      item.age
                    } years old`}
                    description={item.bio}
                  />
                  <ReactTags tags={item.tags} readOnly={true} />
                  <p>{item.dist} km</p>
                  <p>
                    {item.gender === "male" ? "Man" : "Woman"},{" "}
                    {item.sexual_orientation}
                  </p>
                </Card>
              </div>
            ))}
          </div>
        ) : (
          <div className="col-md-4">
            <p>No user finds</p>
          </div>
        )}
      </div>
    );
  }
}

export default SearchUsersPage;
