var models = require("../models/tags");

module.exports = {
  displayTags: function(req, res) {
    models.allTags(function(globalTags) {
      if (globalTags) {
        globalTags = JSON.parse(JSON.stringify(globalTags));
        if (req.body.userId) {
          models.findTags(req.body.userId, function(tags) {
            if (tags) {
              return res.json({ globalTags: globalTags, tags: tags });
            } else {
              return res.json({
                globalTags: globalTags,
                empty: "No tags in the user's list"
              });
            }
          });
        } else {
          return res.json({ error: "user null" });
        }
      }
    });
  },
  addTag: function(req, res) {
    var tag = {
      text: req.body.tag
    };
    var userId = req.body.userId;
    if (tag.text != "") {
      if (!tag.text.match(/^[a-zA-Z0-9_]+$/))
        return res.json({
          error:
            "Invalid tag! Your tag must contain only letters, numbers or '_' !"
        });
      if (userId) {
        models.findTags(userId, function(tags) {
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
            models.addTagsUser(newTagsList, userId);
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
        return res.json({ error: "user null" });
      }
    } else {
      return res.json({
        error: "Empty parameters"
      });
    }
  },
  deleteTag: function(req, res) {
    if (req.body.userId && req.body.tagToDelete) {
      models.deleteTagUser(req.body.userId, req.body.tagToDelete, function(
        tags
      ) {
        if (tags) return res.json({ tags });
        else return res.json({ empty: "Empty tags list" });
      });
    } else {
      return res.json({ error: "empty userId or tag to delete'" });
    }
  }
};
