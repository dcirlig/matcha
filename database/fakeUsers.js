var faker = require("faker/locale/fr");
faker.locale = "fr";
var bcrypt = require("bcrypt-nodejs");
var userModels = require("../models/user");
var tagsModels = require("../models/tags");

function calculateAge(birthday) {
  var ageDifMs = Date.now() - birthday.getTime();
  var ageDate = new Date(ageDifMs);
  return Math.abs(ageDate.getUTCFullYear() - 1970);
}

const password = bcrypt.hashSync("to1A@abc");
var allTags = [];
let cleanArray = [];

const axios = require("axios");

const getPhotos = cb => {
  var photos = {};
  photos.woman = [];
  photos.man = [];
  axios
    .get(
      `https://api.unsplash.com/photos/random?collections=628604&count=30&client_id=796be43f455c2e6a64a0d3f9913fa8ddc53cf095461784782a2aa08015c17e85`
    )
    .then(res => {
      if (res.data) {
        res.data.forEach(element => {
          photos.man.push(element.urls.regular);
        });
      }
      axios
        .get(
          "https://api.unsplash.com/photos/random?collections=472913&count=30&client_id=796be43f455c2e6a64a0d3f9913fa8ddc53cf095461784782a2aa08015c17e85"
        )
        .then(res => {
          if (res.data) {
            res.data.forEach(element => {
              photos.woman.push(element.urls.regular);
            });
          }

          cb(photos);
        })
        .catch(err => {
          console.log(err);
        });
    })
    .catch(err => {
      console.log(err);
    });
};

function fakeUsers(callback) {
  getPhotos(function (res) {
    for (i = 0; i <= 499; i++) {
      var birthdate = faker.date.between("1960-01-01", "2001-01-01");
      var firstname = faker.name.firstName()
      var lastname = faker.name.lastName()
      let user = {
        firstname: firstname,
        lastname: lastname,
        email: faker.internet.email(),
        username: firstname + lastname + faker.random.number({ min: 1, max: 99 }),
        passwd: password,
        gender: faker.random.arrayElement(["male", "female"]),
        birthdate: birthdate,
        age: calculateAge(birthdate),
        bio: faker.hacker.phrase(),
        tags: faker.random
          .words(5)
          .split(" ")
          .join(", "),
        sexual_orientation: faker.random.arrayElement([
          "heterosexual",
          "bisexual",
          "homosexual"
        ]),
        profil_image: faker.random.arrayElement([
          res.man[Math.floor(Math.random() * res.man.length)],
          res.woman[Math.floor(Math.random() * res.woman.length)]
        ]),
        popularity_score: faker.random.number({ min: 2, max: 1000 }),
        localisation: "",
        secretToken: "",
        emailVerified: 1,
        online: Date.now()
      };
      var userCoords = {
        latitude: faker.finance.amount(48.815801, 48.901209, 6),
        longitude: faker.finance.amount(2.259519, 2.415387, 6),
        userId: 0
      };
      userModels.createUserAndLocation(user, userCoords);
      allTags = allTags.concat(user.tags.split(", "));
      for (let i = 0; i < allTags.length; i++) {
        if (cleanArray.indexOf(allTags[i]) == -1) {
          cleanArray.push(allTags[i]);
        }
      }
    }
    cleanArray.forEach(function (element) {
      if (element.length > 1) {
        tagsModels.createTag(element);
      }
    });
    callback("Random users inserted")
  });
}

exports.fakeUsers = fakeUsers;
