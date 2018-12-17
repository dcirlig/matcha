// Imports
var models = require("../models/user");
var imgModels = require("../models/images");
var escapeHtml = require("../utils/utils").escapeHtml;

// Routes

module.exports = {
  userProfil: function(req, res) {
    if (req.params.username) {
      var username = escapeHtml(req.params.username);
    }
    if (username) {
      models.findOne("username", username, function(find) {
        if (find) {
          models.getUser("username", username, function(result) {
            if (result) {
              if (result[0].tags) {
                const tagTab = result[0].tags.split(", ");
                var newTags = tagTab.map(tag => {
                  return {
                    id: tag,
                    text: "#" + tag
                  };
                });
              }
              imgModels.getImage("userId", result[0].userId, function(images) {
                if (images) {
                  imagesUser = JSON.stringify(images);
                } else {
                  imagesUser = "";
                }
                getImages(imagesUser);
              });
              let images = "";
              function getImages(imagesUser) {
                images = imagesUser;
                res.status(200).json({
                  firstname: result[0].firstname,
                  lastname: result[0].lastname,
                  username: result[0].username,
                  gender: result[0].gender,
                  age: result[0].age,
                  bio: result[0].bio,
                  tags: newTags,
                  location: result[0].localisation,
                  sexualOrientation: result[0].sexual_orientation,
                  profilImage: result[0].profil_image,
                  images: images
                });
              }
            }
          });
        } else {
          res.json({
            error:
              "This member does not exist or did not complete his/her profile info."
          });
        }
      });
    }
  }
};
// module.exports = {
//   userProfil: function(req, res) {
//     console.log(req.params);

//   if (req.params.username) {
//     console.log("coucou");
//     var username = escapeHtml(req.params.username);
//   }
// }
//   if (username) {
//     models.findOne("username", username, function(find) {
//       console.log("find", find);
//     });
//   }
//   // }
// }
//           if (find) {
//             models.getUser("username", username, function(result) {
//               if (result) {
//                 result.forEach(element => {
//                   models.updateUser(
//                     `localisation='${userData.localisation}', bio='${
//                       userData.bio
//                     }', gender = '${userData.gender}', sexual_orientation='${
//                       userData.sexual_orientation
//                     }', profil_image='${userData.profil_image}'`,
//                     element.userId
//                   );
//                   return res.status(200).json({
//                     success: "Successfully completed"
//                   });
//                 });
//               } else {
//                 res.json({ error: "user does not exists" });
//               }
//             });
//           } else {
//             return res.json({ error: "User does not exist" });
//           }
//         });
//       } else {
//         res.json({ error: "Please complete the required fields" });
//       }
//     }
//   }
// };
