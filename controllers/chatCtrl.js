var chatModels = require("../models/chat");

module.exports = {
    getRooms: function(req, res) {
        if (req.body.userId) {
            var userId = parseInt(req.body.userId);
            chatModels.getRooms(userId, function(find) {
                var rooms = [];
                for (var i = 0; i < find.length; i++) {
                    if (find[i].userId1 == userId) {
                        receiverId = find[i].userId2;
                        receiverName = find[i].username2;
                        receiverPhoto = find[i].profil_image2;
                        senderId = find[i].userId1;
                        senderName = find[i].username1;
                        senderPhoto = find[i].profil_image1;
                    } else if (find[i].userId2 == userId) {
                        receiverId = find[i].userId1;
                        receiverName = find[i].username1;
                        receiverPhoto = find[i].profil_image1;
                        senderId = find[i].userId2;
                        senderName = find[i].username2;
                        senderPhoto = find[i].profil_image2;
                    }
                    rooms = rooms.concat({
                        room: find[i].room,
                        receiverId: receiverId,
                        senderId: senderId,
                        receiverName: receiverName,
                        senderName: senderName,
                        receiverPhoto: receiverPhoto,
                        senderPhoto: senderPhoto,
                        existingChat: find[i].existingChat,
                        time: find[i].time
                    });
                }
                return res.json({ success: "Matches found", rooms: rooms });
            });
        } else {
            return res.json({ error: "No matches found." });
        }
    },
    getConv: function(req, res) {
        if (req.body.chatRoom) {
            var chatRoom = escape(req.body.chatRoom);
            chatModels.getMessages(chatRoom, result => {
                if (result.length > 0) {
                    return res.json({ messages: result });
                } else {
                    return res.json({ error: "No messages found." });
                }
            });
        } else {
            return res.json({ error: "Invalid chat room." });
        }
    },
    getLastMessage: function(req, res) {
        if (req.body.chatRoom) {
            var chatRoom = escape(req.body.chatRoom);
            chatModels.getLastMessage(chatRoom, result => {
                if (result.length > 0) {
                    return res.json({ lastMessage: result });
                } else {
                    return res.json({ error: "No last message found." });
                }
            });
        }
    }
};
