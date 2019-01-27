var models = require("../models/tags");

module.exports = {
    displayTags: function (req, res) {
        models.allTags(function (globalTags) {
            if (globalTags) {
                globalTags = JSON.parse(JSON.stringify(globalTags));
                if (req.body.userId) {
                    models.findTags(req.body.userId, function (tags) {
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
    addTag: function (req, res) {
        var tag = {
            text: req.body.tag
        };
        var userId = req.body.userId;
        if (userId && tag) {
            console.log('tag.text', tag.text)
            if (tag.text.length >= 1 && tag.text.length <= 20 && tag.text.match(/^[a-zA-Z0-9_]+$/)) {
                models.findTags(userId, function (tags) {
                    if ((tags && tags.split(", ").length <= 9) || !tags) {
                        if (!tags) {
                            index = -1;
                        } else {
                            let splitTags = tags.split(", ");
                            index = splitTags.indexOf(tag.text);
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
                            models.findTag("content", tag.text, function (find) {
                                if (!find) {
                                    models.createTag(tag.text);
                                }
                            });
                            return res.json({ success: 'Tag successfully added to your list' });
                        }
                    } else { return res.json({ error: 'You have reached the limit of 10 tags per profile.' }) }

                });
            } else {
                return res.json({
                    error: "Invalid tag! Your tag must contain only letters, numbers or '_' !"
                });
            }
        } else {
            return res.json({ error: "Missing parameters." });
        }
    },
    deleteTag: function (req, res) {
        if (req.body.userId && req.body.tagToDelete) {
            models.deleteTagUser(req.body.userId, req.body.tagToDelete, function (
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
