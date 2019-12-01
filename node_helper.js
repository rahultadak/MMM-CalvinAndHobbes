var NodeHelper = require("node_helper");
module.exports = NodeHelper.create({

    start: function () {
        console.log("Starting node helper: " + this.name);
    },

    socketNotificationReceived: function(notification, payload) {
        console.log("Notification: " + notification + " Payload: " + payload);
        if(notification === "GET_COMIC") {
            console.log("Got notification to get the new comic");
            this.sendComic();
        }
    },

    sendComic: function () {
        comic = {text: "Helper sent the comic back"};
        console.log("Sending new comic");
        this.sendSocketNotification('COMIC', comic);
    },

});