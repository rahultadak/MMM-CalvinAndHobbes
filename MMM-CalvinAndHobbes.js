Module.register("MMM-CalvinAndHobbes", {
    // Default module config.
    defaults: {
        text: "Hello World! This is my first Module - MMM-CalvinAndHobbes"
    },

    start: function () {
        this.text = 'This is first module';

        this.getComic();
    },

    getComic: function () {
        // This should go into another method probably
        Log.log( this.name + "Into get comic");
        this.sendSocketNotification('GET_COMIC', this.config);
    },

    // Override dom generator.
    getDom: function () {
        var wrapper = document.createElement("div");
        wrapper.innerHTML = this.text;
        return wrapper;
    },

    socketNotificationReceived: function(notification, payload) {
        if (notification === "COMIC") {
            Log.log(this.name + "Got new comic " + payload.text + "notification: " + notification);
            this.text = payload.text;
            this.updateDom();
        }
    },
});