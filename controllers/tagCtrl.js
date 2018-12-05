var models = require("../models/tags");

module.exports = {
  displayTags: function(req, res) {
    models.allTags(function(globalTags) {
      if (globalTags) {
        globalTags = JSON.parse(JSON.stringify(globalTags));
        models.findTags(req.body.userData, function(tags) {
          if (tags) return res.json({ globalTags, tags });
        });
      }
    });
  },
  addTag: function(req, res) {
    var tag = {
      text: req.body.tag
    };
    var username = req.body.userData;
    if (tag.text != "") {
      if (!tag.text.match(/^[a-zA-Z0-9_]+$/))
        return res.json({
          error:
            "Invalid tag! Your tag must contain only letters, numbers or '_' !"
        });
      models.findTags(username, function(tags) {
        if (!tags) {
          index = -1;
        } else {
          index = tags.indexOf(tag.text);
        }
        if (index !== -1) {
          return res.json({
            error:
              "This tag is already in your list. Please choose another one!"
          });
        } else {
          if (!tags) {
            newTagsList = tag.text;
          } else if (tags) {
            newTagsList = tags.concat(", " + [tag.text]);
          }
          models.addTagsUser(newTagsList, username);
          models.findTag("content", tag.text, function(find) {
            if (!find) {
              models.createTag(tag.text);
              return res.status(200).json({
                success: "Tag successfully added to interests global database"
              });
            }
          });
        }
      });
    } else {
      return res.json({
        error: "Empty parameters"
      });
    }
  },
  deleteTag: function(req, res) {
    models.deleteTagUser(req.body.userData, req.body.tagToDelete, function(
      tags
    ) {
      if (tags) return res.json({ tags });
    });
  }
};
