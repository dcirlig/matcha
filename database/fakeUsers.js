var faker = require('faker/locale/fr');
faker.locale = "fr";
var bcrypt = require("bcrypt-nodejs");
var userModels = require("../models/user");
var tagsModels = require("../models/tags")

function calculateAge(birthday) {
    var ageDifMs = Date.now() - birthday.getTime();
    var ageDate = new Date(ageDifMs);
    return Math.abs(ageDate.getUTCFullYear() - 1970);
}

const Geo = require("open-street-map-reverse-geo-node-client/dist");

const password = bcrypt.hashSync("Ebqn7dyu")
var allTags = [];
let cleanArray = []

function fakeUsers() {
    for (i = 0; i <= 499; i++) {
        var birthdate = faker.date.between('1960-01-01', '2001-01-01');
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
            tags: faker.random.words(5).split(" ").join(", "),
            sexual_orientation: faker.random.arrayElement(["heterosexual", "bisexual", "homosexual"]),
            profil_image: faker.image.avatar(),
            popularity_score: faker.random.number({ min: 2, max: 1000 }),
            localisation: "",
            secretToken: "",
            emailVerified: 1
        }
        var userCoords = {
            latitude: faker.finance.amount(48.815801, 48.901209, 6),
            longitude: faker.finance.amount(2.259519, 2.415387, 6),
            userId: 0
        }
        // const reverse = new Geo.ReverseGeocoder();
        // await reverse
        //     .getReverse(userCoords.latitude, userCoords.longitude)
        //     .then(async location => {
        //         if (location.address.city && location.address.cityDistrict) {
        //             user.localisation = location.address.city + " " + location.address.cityDistrict
        //         }
        //         else if (location.address.town) {
        //             user.localisation = location.address.town
        //         }
        //         models.createUser(user);
        //     })
        //     .catch(err => {
        //         console.error(err);
        //     });
        userModels.createUserAndLocation(user, userCoords)
        allTags = allTags.concat(user.tags.split(', '))
        for (let i = 0; i < allTags.length; i++) {
            if (cleanArray.indexOf(allTags[i]) == -1) {
                cleanArray.push(allTags[i])
            }
        }

    }
    cleanArray.forEach(function (element) {
        if (element.length > 1) {
            tagsModels.createTag(element)
        }
    })
}

exports.fakeUsers = fakeUsers;