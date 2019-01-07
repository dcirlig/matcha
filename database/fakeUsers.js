var faker = require("faker/locale/fr");
faker.locale = "fr";
var bcrypt = require("bcrypt-nodejs");
var models = require("../models/user");
// const randomstring = require("randomstring");

function calculateAge(birthday) {
  // birthday is a date
  var ageDifMs = Date.now() - birthday.getTime();
  var ageDate = new Date(ageDifMs); // miliseconds from epoch
  return Math.abs(ageDate.getUTCFullYear() - 1970);
}

const Geo = require("open-street-map-reverse-geo-node-client/dist");

const password = bcrypt.hashSync("Ebqn7dyu");
// const secretTokenEmail = randomstring.generate();

async function fakeUsers() {
  for (i = 0; i <= 249; i++) {
    var birthdate = faker.date.between("1950-01-01", "2001-01-01");
    let user = {
      firstname: faker.name.firstName(),
      lastname: faker.name.lastName(),
      email: faker.internet.email(),
      username: faker.internet.userName(),
      passwd: password,
      gender: faker.random.arrayElement(["male", "female"]),
      birthdate: birthdate,
      age: calculateAge(birthdate),
      bio: faker.lorem.sentences(3, 3),
      tags: faker.random
        .words(5)
        .split(" ")
        .join(", "),
      sexual_orientation: faker.random.arrayElement([
        "heterosexual",
        "bisexual",
        "homosexual"
      ]),
      profil_image: faker.image.avatar(),
      popularity_score: faker.random.number({ min: 2, max: 1000 }),
      localisation: "",
      secretToken: "",
      emailVerified: 1
    };
    var userCoords = {
      latitude: faker.finance.amount(48.815801, 48.901209, 6),
      longitude: faker.finance.amount(2.259519, 2.415387, 6)
    };
    // const reverse = new Geo.ReverseGeocoder();
    // await reverse
    //   .getReverse(userCoords.latitude, userCoords.longitude)
    //   .then(async location => {
    //     if (location.address.city && location.address.cityDistrict) {
    //       user.localisation =
    //         location.address.city + " " + location.address.cityDistrict;
    //     } else if (location.address.town) {
    //       user.localisation = location.address.town;
    //     }
    //     models.createUser(user);
    //   })
    //   .catch(err => {
    //     console.error(err);
    //   });
    models.createUser(user);
  }
  console.log("Random users inserted");
}

exports.fakeUsers = fakeUsers;
