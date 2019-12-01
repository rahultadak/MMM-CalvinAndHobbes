Module.register("MMM-CalvinAndHobbes", {
    // Default module config.
    defaults: {
        grayScale: true,
        invertColors: true,
    },

    start: function () {
        this.img = null;
        this.today = '';
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
        // wrapper.innerHTML = this.text;
        var img = document.createElement('img');
        img.id = "cahcontent";
        img.src = this.img;
        img.setAttribute("style", "-webkit-filter: " +
                                (this.config.grayScale && this.today > 0 ? "grayscale(100%) " : "") +
                                (this.config.invertColors && this.today > 0 ? "invert(100%) " : "") +
                                ";")
        wrapper.appendChild(img);
        return wrapper;
    },

    socketNotificationReceived: function(notification, payload) {
        if (notification === "COMIC") {
            // Log.log(this.name + "Got new comic " + payload.text + "notification: " + notification);
            this.img = payload.link;
            this.today = payload.today;
            this.updateDom();
        }
    },
});