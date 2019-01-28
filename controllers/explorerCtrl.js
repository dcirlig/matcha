var users = require("../models/user");
var connection = require("../database/dbConnection");
var distance = require("../models/distance");

module.exports = {
  explorer: function (req, res) {
    if (req.body.sortBy) {
      var sortBy = escape(req.body.sortBy.sortBy);
      var list_sort_users = req.body.usersList.usersList;
      if (sortBy === "age") {
        list_sort_users.sort(
          (a, b) =>
            a.age - b.age ||
            a.dist - b.dist ||
            b.common_tags - a.common_tags ||
            b.popularity_score - a.popularity_score
        );
      } else if (sortBy === "location") {
        list_sort_users.sort(
          (a, b) =>
            a.dist - b.dist ||
            b.common_tags - a.common_tags ||
            b.popularity_score - a.popularity_score
        );
      } else if (sortBy === "popularity") {
        list_sort_users.sort(
          (a, b) =>
            b.popularity_score - a.popularity_score ||
            a.dist - b.dist ||
            b.common_tags - a.common_tags
        );
      } else if (sortBy === "tags") {
        list_sort_users.sort(
          (a, b) =>
            b.common_tags - a.common_tags ||
            a.dist - b.dist ||
            b.popularity_score - a.popularity_score
        );
      } else if (sortBy === "like") {
        let likedUsers = list_sort_users;
        let notLikedUsers = list_sort_users;
        likedUsers.forEach(element => {
          if (element.liked) {
            likedUsers = likedUsers.filter(el => el.userId !== element.userId);
          }
        });
        likedUsers.sort(
          (a, b) =>
            a.dist - b.dist ||
            b.common_tags - a.common_tags ||
            b.popularity_score - a.popularity_score
        );
        notLikedUsers.forEach(element => {
          if (!element.liked) {
            notLikedUsers = notLikedUsers.filter(
              el => el.userId !== element.userId
            );
          }
        });
        notLikedUsers.sort(
          (a, b) =>
            a.dist - b.dist ||
            b.common_tags - a.common_tags ||
            b.popularity_score - a.popularity_score
        );
        list_sort_users = likedUsers.concat(notLikedUsers);
      } else {
        list_sort_users.sort(
          (a, b) =>
            a.dist - b.dist ||
            b.common_tags - a.common_tags ||
            b.popularity_score - a.popularity_score
        );
      }
      return res.json({ user_list: list_sort_users });
    } else {
      userId = req.body.userId.userId;
      if (userId) {
        var sql_start = `SELECT  *
      FROM users
      INNER JOIN geolocation ON users.userId = geolocation.userId
      WHERE`;
        users.findOne("userId", userId, function (find) {
          if (find) {
            condition = ` users.userId=?`;
            sql = sql_start + condition;
            connection.query(sql, userId, function (err, result) {
              if (err) console.log(err);
              if (JSON.parse(JSON.stringify(result)).length > 0) {
                result.forEach(element => {
                  if (element.sexual_orientation === "bisexual") {
                    var condition = ` users.userId!=? && ((users.gender=? &&
                                users.sexual_orientation=?) || (users.gender=? && users.sexual_orientation=?)
                                || users.sexual_orientation=? ) `;
                    sql = sql_start + condition;
                    if (element.gender === "female") {
                      objData = [
                        userId,
                        "male",
                        "heterosexual",
                        "female",
                        "homosexual",
                        "bisexual"
                      ];
                    } else if (element.gender === "male") {
                      objData = [
                        userId,
                        "male",
                        "homosexual",
                        "female",
                        "heterosexual",
                        "bisexual"
                      ];
                    }
                  } else if (element.sexual_orientation === "homosexual") {
                    condition = ` users.userId!=? && (users.gender=? && (users.sexual_orientation=? ||  users.sexual_orientation=?))`;
                    sql = sql_start + condition;
                    if (element.gender === "female") {
                      objData = [userId, "female", "homosexual", "bisexual"];
                    } else if (element.gender === "male") {
                      objData = [userId, "male", "homosexual", "bisexual"];
                    }
                  } else if (element.sexual_orientation === "heterosexual") {
                    condition = ` users.userId!=? && (users.gender=? && (users.sexual_orientation=? ||  users.sexual_orientation=?))`;
                    sql = sql_start + condition;
                    if (element.gender === "female") {
                      objData = [userId, "male", "heterosexual", "bisexual"];
                    } else if (element.gender === "male") {
                      objData = [userId, "female", "heterosexual", "bisexual"];
                    }
                  }
                  connection.query(sql, objData, function (error, results) {
                    if (error) console.log(error);
                    var sql =
                      "SELECT * FROM blocked WHERE blockTransmitter=? OR blockedUser = ?";
                    connection.query(sql, [userId, userId], function (
                      err,
                      dataReports
                    ) {
                      var blockedUsersList = [];
                      if (err) console.log(err);
                      if (dataReports) {
                        dataReports.forEach(element => {
                          blockedUsersList.push(element.blockedUser);
                          blockedUsersList.push(element.blockTransmitter);
                        });
                      }
                      var sql = "SELECT  * FROM likes WHERE likeTransmitter=?";
                      connection.query(sql, userId, function (err, result) {
                        var likedUsersList = [];
                        if (err) console.log(err);
                        if (result) {
                          result.forEach(element => {
                            likedUsersList.push(element.likedUser);
                          });
                          if (JSON.parse(JSON.stringify(results)).length > 0) {
                            results.forEach(user => {
                              if (likedUsersList.includes(user.userId))
                                user.liked = true;
                              else user.liked = false;
                              if (blockedUsersList.includes(user.userId))
                                user.blocked = true;
                              else user.blocked = false;
                              user.dist = Math.round(
                                distance.distance(
                                  element.latitude,
                                  element.longitude,
                                  user.latitude,
                                  user.longitude
                                )
                              );
                              if (element.tags) {
                                var tags = element.tags.split(", ");
                                var count = 0;
                                tags.forEach(tag => {
                                  if (user.tags) {
                                    if (user.tags.indexOf(tag) != -1) {
                                      count += 1;
                                    }
                                  }
                                });
                                user.common_tags = count;
                              }

                              if (req.body.searchOptions) {
                                var searchOptions = req.body.searchOptions;
                                var ageInterval = searchOptions.ageInterval;
                                var ageMin = ageInterval[0];
                                var ageMax = ageInterval[1];
                                var distMax = searchOptions.distMax;
                                var popularityScoreInterval =
                                  searchOptions.popularityScoreInterval;
                                var popularityScoreMin =
                                  popularityScoreInterval[0];
                                var popularityScoreMax =
                                  popularityScoreInterval[1];
                                if (searchOptions.listTags) {
                                  listTags = searchOptions.listTags;
                                  if (searchOptions.listTags.length > 0) {
                                    listTags = searchOptions.listTags.split(
                                      ", "
                                    );
                                  } else listTags = [];
                                } else {
                                  listTags = [];
                                }
                                if (listTags.length > 0) {
                                  count = 0;
                                  listTags.forEach(tag => {
                                    if (user.tags !== null) {
                                      var regex = new RegExp(
                                        "(^" +
                                        tag +
                                        ", | " +
                                        tag +
                                        ",|, " +
                                        tag +
                                        "$)"
                                      );
                                      if (user.tags.search(regex) !== -1) {
                                        count += 1;
                                      }
                                    }
                                  });
                                  if (count == 0) {
                                    results = results.filter(
                                      el => el.userId !== user.userId
                                    );
                                  }
                                }

                                if (
                                  user.age < ageMin ||
                                  (user.age > ageMax && ageMax != 99)
                                ) {
                                  results = results.filter(
                                    el => el.userId !== user.userId
                                  );
                                }
                                if (user.dist > distMax) {
                                  results = results.filter(
                                    el => el.userId !== user.userId
                                  );
                                }
                                if (
                                  user.popularity_score < popularityScoreMin ||
                                  (user.popularity_score > popularityScoreMax &&
                                    popularityScoreMax != 1000)
                                ) {
                                  results = results.filter(
                                    el => el.userId !== user.userId
                                  );
                                }
                              }
                              if (user.tags) {
                                var usrTgas = user.tags.split(", ");
                                var newTags = usrTgas.map(tag => {
                                  return {
                                    id: tag,
                                    text: "#" + tag
                                  };
                                });
                                user.tags = newTags;
                              } else user.tags = [];
                            });
                          } else {
                            return res.json({ success: "0 resultat" });
                          }
                          var list_sort_users = JSON.parse(
                            JSON.stringify(results)
                          );

                          list_sort_users.sort(
                            (a, b) =>
                              a.dist - b.dist ||
                              b.common_tags - a.common_tags ||
                              b.popularity_score - a.popularity_score
                          );

                          return res.json({ user_list: list_sort_users });
                        }
                      });
                    });
                  });
                });
              } else {
                return res.json({ error: "Empty response" });
              }
            });
          } else {
            return res.json({ error: "User does not exists!" });
          }
        });
      } else {
        return res.json({ error: "user null" });
      }
    }
  }
};
