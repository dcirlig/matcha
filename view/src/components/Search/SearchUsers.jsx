import React, { Component } from "react";
import { Redirect, Link } from "react-router-dom";
import "antd/dist/antd.css";
import axios from "axios";
import { Card, Select, Slider } from "antd";
import { WithContext as ReactTags } from "react-tag-input";
import Header from "../Navigation/Navigation";
import Like from "./Like";
import Reports from "./Reports";
import { MDBRow, MDBCol, MDBBtn, MDBAlert, MDBIcon } from "mdbreact";
import { Helmet } from "react-helmet";
import * as routes from "../../constants/routes";
import InfiniteScroll from "react-infinite-scroll-component";

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
  open: false,
  count: "",
  profileComplete: true,
  loading: true,
  items: [],
  hasMore: true
};

class SearchUsersPage extends Component {
  _isMounted = false;
  constructor(props) {
    super(props);
    this.state = { ...INITIAL_STATE };
    this.onChangeAge = this.onChangeAge.bind(this);
    this.onChangeDistance = this.onChangeDistance.bind(this);
    this.onChangePopularity = this.onChangePopularity.bind(this);
    this.handleSubmit = this.handleSubmit.bind(this);
    this.openSearchFrame = this.openSearchFrame.bind(this);
    this.updateUsersListAfterReport = this.updateUsersListAfterReport.bind(
      this
    );
  }

  async componentWillMount() {
    await this.setState({
      userId: { userId: sessionStorage.getItem("userId") }
    });
    axios
      .post(`/api/profileComplete`, { userId: this.state.userId.userId })
      .then(res => {
        if (res.data && res.data.error)
          this.setState({ profileComplete: false });
      })
      .catch();
    axios
      .post(`/api/notifications`, { userId: this.state.userId.userId })
      .then(res => {
        if (res.data.success && this.state.profileComplete) {
          this.setState({ count: res.data.count });
        }
      })
      .catch();
  }

  componentDidMount() {
    this._isMounted = true;
    var socket = this.props.socket;
    socket.on("NOTIF_RECEIVED", data => {
      var count = data.count + this.state.count;
      if (this._isMounted) this.setState({ count: count });
    });
    axios
      .post(`/api/explorer`, { userId: this.state.userId })
      .then(async res => {
        if (res.data.user_list) {
          if (this._isMounted) {
            const usersList = Object.assign({}, this.state.usersList, {
              usersList: res.data.user_list
            });
            var arr1 = Array.from({
              length: 13
            },
              function (list, k) {
                return res.data.user_list[k];
              }
            );
            await this.setState({ usersList, loading: false, items: arr1 });
          }
        }
      })
      .catch();
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
          var index;
          if (res.data.user_list && res.data.user_list.length < 13) {
            index = res.data.user_list.length;
          } else {
            index = 13;
          }
          var arr1 = Array.from(
            {
              length: index
            },
            function (list, k) {
              return res.data.user_list[k];
            }
          );
          this.setState({ usersList, items: arr1 });
        }
      })
      .catch();
  };

  async openSearchFrame() {
    await this.setState({ open: !this.state.open });
  }

  handleSubmit = e => {
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
          var index
          if (res.data.user_list && res.data.user_list.length < 13) { index = res.data.user_list.length }
          else { index = 13 }
          var arr1 = Array.from({
            length: index
          },
            function (list, k) {
              return res.data.user_list[k];
            }
          );
          this.setState({ usersList, sortBy, items: arr1 });
        }
      })
      .catch();
  };

  sendVisitNotification = e => {
    var socket = this.props.socket;
    const likeroom = e.userId;
    const receiverId = e.userId;
    const senderId = sessionStorage.getItem("userId");
    const fromUser = sessionStorage.getItem("userData");
    const sendAt = Date.now();
    const message = "has visited your profile";
    socket.emit("NOTIF_SENT", {
      likeroom,
      message,
      fromUser,
      senderId,
      receiverId,
      sendAt
    });
  };

  updateUsersListAfterReport(item) {
    const list = this.state.usersList.usersList;
    list.find(user => user.userId === item.userId).blocked = true;
    if (this._isMounted) {
      this.setState({ usersList: { usersList: list } });
    }
  }

  getDate = date => {
    var Days = ["Mon", "Tu", "Wed", "Thu", "Fri", "Sat", "Sun"];
    var Months = [
      "Jan",
      "Feb",
      "Mar",
      "Apr",
      "Jun",
      "Jul",
      "Aug",
      "Sep",
      "Oct",
      "Dec"
    ];
    var day = Days[date.getDay()];
    var hour = date.getHours();
    var minutes = date.getMinutes();
    var dd = date.getDate();
    var mm = Months[date.getMonth()];
    var yyyy = date.getFullYear();

    if (dd < 10) {
      dd = "0" + dd;
    }

    var data =
      day + ", " + dd + " " + mm + " " + yyyy + ", " + hour + ":" + minutes;
    return data;
  };

  fetchMoreData = async () => {
    let index;
    let usersListLength = this.state.usersList.usersList.length;
    let itemsLength = this.state.items.length;

    if (itemsLength >= usersListLength) {
      await this.setState({ hasMore: false });
      return;
    }
    if (usersListLength - itemsLength < 13) {
      index = usersListLength - itemsLength
    } else { index = 13 }
    let usersList = this.state.usersList.usersList;
    let previousIndex = itemsLength;
    var arr1 = Array.from(
      {
        length: index
      },
      function (list, k) {
        return usersList[k + previousIndex];
      }
    );
    setTimeout(() => {
      this.setState({
        items: this.state.items.concat(arr1)
      });
    }, 500);
  };

  componentWillUnmount() {
    this._isMounted = false;
  }

  render() {
    const {
      searchOptions,
      sortBy,
      open,
      count,
      profileComplete,
      loading,
      items
    } = this.state;
    const userData = sessionStorage.getItem("userData");
    if (!this._isMounted && !userData) {
      return <Redirect to={routes.SIGN_IN} />;
    }
    if (!profileComplete) {
      return (
        <Redirect
          to={{
            pathname: `/users/${sessionStorage.getItem("userData")}`,
            state: { completeProfile: profileComplete }
          }}
        />
      );
    }
    return (
      <div>
        <Header
          isLoggedIn={this.state.isLoggedIn}
          notSeenNotifications={count}
        />
        <Helmet>
          <style>{"body { overflow: hidden }"}</style>
        </Helmet>
        <div className="container-fluid">
          <MDBRow className="searchRows">
            <MDBCol size="4" className="searchFrame">
              <MDBBtn
                onClick={this.openSearchFrame}
                className="small-button explorer"
                rounded
                size="lg"
                gradient="peach"
                style={{ display: "none" }}
              >
                Preferences
              </MDBBtn>
              {open ? (
                <div className="searchOptionsMobile">
                  <form>
                    <h4>Age</h4>
                    <Slider
                      range
                      marks={{
                        18: "18 ans",
                        99: "99 ans"
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
                        0: "0",
                        100: "100km"
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
                        0: "0",
                        1000: "1000"
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
                    <MDBBtn
                      gradient="peach"
                      className="search-button"
                      type="submit"
                      onClick={e => this.handleSubmit(e)}
                    >
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
                      <Option value="like">Not liked / liked</Option>
                    </Select>
                  </div>
                </div>
              ) : (
                  ""
                )}
              <div className="searchOptions">
                <form>
                  <h4>Age</h4>
                  <Slider
                    range
                    marks={{
                      18: "18 ans",
                      99: "99 ans"
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
                      0: "0",
                      100: "100km"
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
                      0: "0",
                      1000: "1000"
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
                  <MDBBtn
                    gradient="peach"
                    className="search-button"
                    type="submit"
                    onClick={e => this.handleSubmit(e)}
                  >
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
                    <Option value="like">Not liked / liked</Option>
                  </Select>
                </div>
              </div>
            </MDBCol>
            {items && items.length > 0 ? (
              <MDBCol size="8" className="infiniteScrollCol">
                <InfiniteScroll
                  dataLength={this.state.items.length}
                  next={this.fetchMoreData}
                  hasMore={this.state.hasMore}
                  loader={
                    <div>
                      <MDBIcon
                        className="searchPageIcon"
                        icon="spinner"
                        pulse
                        size="3x"
                        fixed
                      />
                      <span className="sr-only">Loading...</span>
                    </div>
                  }
                  height={"80vh"}
                  endMessage={
                    <p style={{ textAlign: "center" }}>
                      <b>Yay! You have seen it all</b>
                    </p>
                  }
                >
                  {items.map((item, index) =>
                    !item.blocked ? (
                      <div
                        className="searchCardContainer"
                        style={{ maxWidth: 240 }}
                        key={index}
                      >
                        <Card
                          hoverable
                          style={{ overflow: "visible" }}
                          cover={
                            <img
                              alt="example"
                              src={
                                item.profil_image
                                  ? item.profil_image.includes("unsplash")
                                    ? item.profil_image
                                    : `https://localhost:4000/${
                                    item.profil_image
                                    }`
                                  : `https://localhost:4000/profilPhoto/avatar-default.jpg`
                              }
                            />
                          }
                        >
                          <Reports
                            item={item}
                            updateUsersListAfterReport={
                              this.updateUsersListAfterReport
                            }
                          />
                          {item.profil_image ? (
                            <Like
                              item={item}
                              popularity_score={item.popularity_score}
                              liked={item.liked}
                              socket={this.props.socket}
                            />
                          ) : (
                              <MDBAlert color="warning">
                                Incomplete profile
                            </MDBAlert>
                            )}
                          {item.online === "online" ? (
                            <div className="connexionInfo">
                              <div className="onlineUsers" />
                              <h5>Online</h5>
                            </div>
                          ) : (
                              <div className="connexionInfo">
                                <div className="offlineUsers" />
                                <h5>
                                  {this.getDate(new Date(parseInt(item.online)))}
                                </h5>
                              </div>
                            )}
                          <Meta
                            title={`${item.firstname} ${item.lastname}, ${
                              item.age
                              } y.o.`}
                            style={{ wordBreak: "break-all" }}
                          />
                          <ReactTags
                            classNames={{
                              tags: "tagsContainer",
                              selected: "selectedSearchTags",
                              tag: "allSearchTags"
                            }}
                            tags={item.tags}
                            readOnly={true}
                          />
                          <p>{item.dist <= 1 ? "< 1" : item.dist} km</p>
                          <p>
                            {item.gender === "male" ? "Man" : "Woman"},{" "}
                            {item.sexual_orientation}
                          </p>

                          <Link
                            to={{
                              pathname: `/users/${item.username}`
                            }}
                            onClick={e => this.sendVisitNotification(item)}
                          >
                            Show more...
                          </Link>
                        </Card>
                      </div>
                    ) : (
                        ""
                      )
                  )}
                </InfiniteScroll>
              </MDBCol>
            ) : (
                <MDBCol size="8" className="explorer-container">
                  {loading ? (
                    <div>
                      <MDBIcon
                        className="searchPageIcon"
                        icon="spinner"
                        pulse
                        size="5x"
                        fixed
                      />
                      <span className="sr-only">Loading...</span>
                    </div>
                  ) : (
                      <h1>No users found</h1>
                    )}
                </MDBCol>
              )}
          </MDBRow>
        </div>
      </div>
    );
  }
}

export default SearchUsersPage;
