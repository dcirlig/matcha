import React, { Component } from "react";
import "antd/dist/antd.css";
import axios from "axios";
import { Card, Select, Slider } from "antd";
import { WithContext as ReactTags } from "react-tag-input";
import "bootstrap/dist/css/bootstrap.min.css";
import Header from "../Navigation/Navigation";
import Like from "./Like";
import { MDBRow, MDBCol, MDBBtn } from "mdbreact";
import { Helmet } from "react-helmet";

const { Meta } = Card;
const Option = Select.Option;

const INITIAL_STATE = {
  userId: {
    userId: ""
  },
  searchOptions: {
    ageInterval: [18, 99],
    distMax: 100,
    popularityScoreInterval: [0, 1000],
    listTags: ""
  },
  sortBy: {
    sortBy: "Default"
  },
  usersList: {
    usersList: []
  },
  isLoggedIn: true,
  open: false
};

class SearchUsersPage extends Component {
  constructor(props) {
    super(props);
    this.state = { ...INITIAL_STATE };
    this.onChangeAge = this.onChangeAge.bind(this);
    this.onChangeDistance = this.onChangeDistance.bind(this);
    this.onChangePopularity = this.onChangePopularity.bind(this);
    this.handleSubmit = this.handleSubmit.bind(this);
    this.openSearchFrame = this.openSearchFrame.bind(this);
  }

  async componentDidMount() {
    await this.setState({
      userId: { userId: sessionStorage.getItem("userId") }
    });
    axios
      .post(`/api/explorer`, { userId: this.state.userId })
      .then(async res => {
        if (res.data.user_list) {
          const usersList = Object.assign({}, this.state.usersList, {
            usersList: res.data.user_list
          });
          await this.setState({ usersList });
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

  onSelelctOption = async e => {
    var sortBy = Object.assign({}, this.state.sortBy, {
      sortBy: e
    });
    await this.setState({ sortBy });
    axios
      .post(`/api/explorer`, {
        sortBy: this.state.sortBy,
        usersList: this.state.usersList
      })
      .then(res => {
        if (res.data.user_list) {
          const usersList = Object.assign({}, this.state.usersList, {
            usersList: res.data.user_list
          });
          this.setState({ usersList });
        } else {
          console.log("error");
        }
      });
  };

  async openSearchFrame() {
    await this.setState({ open: !this.state.open });
  }

  handleSubmit = async e => {
    e.preventDefault();
    axios
      .post(`/api/explorer`, {
        searchOptions: this.state.searchOptions,
        userId: this.state.userId
      })
      .then(res => {
        if (res.data.user_list) {
          const usersList = Object.assign({}, this.state.usersList, {
            usersList: res.data.user_list
          });
          const sortBy = Object.assign({}, this.state.sortBy, {
            sortBy: "Default"
          });
          this.setState({ usersList, sortBy });
        } else {
          console.log("error");
        }
      });
  };

  render() {
    const { searchOptions, usersList, sortBy, open } = this.state;
    var list = usersList.usersList;
    return (
      <div>
        <Header isLoggedIn={this.state.isLoggedIn} />
        <Helmet>
          <style>{"body { overflow: hidden }"}</style>
        </Helmet>
        <div className="container-fluid">
          <MDBRow className="searchRows">
            <MDBCol size='4' className="searchFrame">
              <MDBBtn
                onClick={this.openSearchFrame}
                className="small-button explorer"
                rounded
                size="lg"
                gradient="peach"
                style={{ display: 'none' }}
              >
                Preferences
              </MDBBtn>
              {open ? (<div className="searchOptionsMobile">
                <form>
                  <h4>Age</h4>
                  <Slider
                    range
                    marks={{
                      18: '18 ans',
                      99: '99 ans'
                    }}
                    min={18}
                    max={99}
                    value={searchOptions.ageInterval}
                    name="ageInterval"
                    onChange={this.onChangeAge}
                  />
                  <h4>Distance</h4>
                  <Slider
                    marks={{
                      0: '0',
                      100: '100km'
                    }}
                    max={100}
                    value={searchOptions.distMax}
                    onChange={this.onChangeDistance}
                    name="distMax"
                  />
                  <h4>Popularity</h4>
                  <Slider
                    range
                    marks={{
                      0: '0',
                      1000: '1000'
                    }}
                    min={0}
                    max={1000}
                    value={searchOptions.popularityScoreInterval}
                    name="popularityScoreInterval"
                    onChange={this.onChangePopularity}
                  />
                  <label htmlFor="searchTagsInput">
                    <h4>Search by tags:</h4>
                    <input
                      className="searchTagsInput"
                      name="listTags"
                      type="text"
                      id="searchTagsInput"
                      placeholder="green, geek"
                      onChange={e => this.onChangeTagsList(e)}
                      value={searchOptions.listTags}
                    />
                  </label>
                  <MDBBtn gradient="peach" className="search-button" type="submit" onClick={e => this.handleSubmit(e)}>
                    Search
        </MDBBtn>
                </form>
                <div className="searchFilters">
                  <Select
                    showSearch
                    style={{ width: 200 }}
                    placeholder="Sort by"
                    optionFilterProp="children"
                    value={sortBy.sortBy ? sortBy.sortBy : undefined}
                    onSelect={this.onSelelctOption}
                    filterOption={(input, option) =>
                      option.props.children
                        .toLowerCase()
                        .indexOf(input.toLowerCase()) >= 0
                    }
                  >
                    <Option value="age">Age</Option>
                    <Option value="location">Location</Option>
                    <Option value="popularity">Popularity score</Option>
                    <Option value="tags">Common tags</Option>
                    <Option value="default">Default</Option>
                  </Select>
                </div>
              </div>) : ""}
              <div className="searchOptions">
                <form>
                  <h4>Age</h4>
                  <Slider
                    range
                    marks={{
                      18: '18 ans',
                      99: '99 ans'
                    }}
                    min={18}
                    max={99}
                    value={searchOptions.ageInterval}
                    name="ageInterval"
                    onChange={this.onChangeAge}
                  />
                  <h4>Distance</h4>
                  <Slider
                    marks={{
                      0: '0',
                      100: '100km'
                    }}
                    max={100}
                    value={searchOptions.distMax}
                    onChange={this.onChangeDistance}
                    name="distMax"
                  />
                  <h4>Popularity</h4>
                  <Slider
                    range
                    marks={{
                      0: '0',
                      1000: '1000'
                    }}
                    min={0}
                    max={1000}
                    value={searchOptions.popularityScoreInterval}
                    name="popularityScoreInterval"
                    onChange={this.onChangePopularity}
                  />
                  <label htmlFor="searchTagsInput">
                    <h4>Search by tags:</h4>
                    <input
                      className="searchTagsInput"
                      name="listTags"
                      type="text"
                      id="searchTagsInput"
                      placeholder="green, geek"
                      onChange={e => this.onChangeTagsList(e)}
                      value={searchOptions.listTags}
                    />
                  </label>
                  <MDBBtn gradient="peach" className="search-button" type="submit" onClick={e => this.handleSubmit(e)}>
                    Search
              </MDBBtn>
                </form>
                <div className="searchFilters">
                  <Select
                    showSearch
                    style={{ width: 200 }}
                    placeholder="Sort by"
                    optionFilterProp="children"
                    value={sortBy.sortBy ? sortBy.sortBy : undefined}
                    onSelect={this.onSelelctOption}
                    filterOption={(input, option) =>
                      option.props.children
                        .toLowerCase()
                        .indexOf(input.toLowerCase()) >= 0
                    }
                  >
                    <Option value="age">Age</Option>
                    <Option value="location">Location</Option>
                    <Option value="popularity">Popularity score</Option>
                    <Option value="tags">Common tags</Option>
                    <Option value="default">Default</Option>
                  </Select>
                </div>
              </div>
            </MDBCol>
            {list.length > 0 ? (
              <MDBCol size='8' className="explorer-container">
                {list.map((item, index) => (
                  <div className="searchCardContainer" style={{ maxWidth: 240 }} key={index}>
                    <Card
                      hoverable
                      style={{ height: 765, overflow: 'visible' }}
                      cover={
                        <img
                          alt="example"
                          src={
                            item.profil_image.includes("amazonaws")
                              ? item.profil_image
                              : `https://localhost:4000/${item.profil_image}`
                          }
                        />
                      }
                    >
                      <Like
                        item={item}
                        popularity_score={item.popularity_score}
                        liked={item.liked}
                      />
                      <Meta
                        title={`${item.firstname} ${item.lastname}, ${
                          item.age
                          } years old`}
                        description={item.bio}
                      />
                      <ReactTags classNames={{
                        tags: 'tagsContainer',
                        selected: 'selectedSearchTags',
                        tag: 'allSearchTags'
                      }} tags={item.tags} readOnly={true} />
                      <p>{item.dist <= 1 ? "<" + item.dist : item.dist} km</p>
                      <p>
                        {item.gender === "male" ? "Man" : "Woman"},{" "}
                        {item.sexual_orientation}
                      </p>
                      <a href={`https://localhost:4000/users/${item.username}`}>
                        Show more...
                    </a>
                    </Card>
                  </div>
                ))}
              </MDBCol>
            ) : (
                <div className="col-md-4">
                  <p>No user finds</p>
                </div>
              )}
          </MDBRow>
        </div>
      </div>
    );
  }
}

export default SearchUsersPage;
