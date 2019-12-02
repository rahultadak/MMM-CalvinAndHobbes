Module.register("MMM-CalvinAndHobbes", {
    // Default module config.
    defaults: {
        grayScale: false,
        invertColors: false,
        updateInterval: 1000 * 60 * 60 * 12, // 12 Hr
        limitComicHeight: 300,
        scrollInterval : 15000,
        scrollRatio : 1, // scroll by 80% of visible height,
    },

    start: function () {
        this.text = 'Loading...';
        this.img = '';
        this.today = 1;
        this.sunday_height = 0;

        self = this;
        self.getComic();
        setInterval(function () {
            self.getComic()
        }, this.config.updateInterval);

        if (this.config.scrollInterval < 3500) {
            // animation takes 3 seconds
            this.config.scrollInterval = 3500;
        }

        // value should be between 0.0 and 1.0 
        this.config.scrollRatio = Math.max(this.config.scrollRatio, 0.0);
        this.config.scrollRatio = Math.min(this.config.scrollRatio, 1.0);

        if (this.config.limitComicHeight > 0)
        {
            var self = this;
            // scroll comic up and down
            // this.addAutoSuspendingInterval(function() {
            //     self.scrollComic();
            // }, this.config.scrollInterval);
            setInterval(function () {
                self.scrollComic()
            }, this.config.scrollInterval);
            this.scrollProgress = 1;
        }
    },

    getComic: function () {
        // This should go into another method probably
        Log.log( this.name + " Into get comic");
        this.sendSocketNotification('GET_COMIC', this.config);
    },

    getStyles: function () {
        return ['comic.css'];
    },

    // Override dom generator.
    getDom: function () {
        var wrapper = document.createElement("div");
        comicWrapper = document.createElement("div");
        comicWrapper.className = "comiccontainer";
        comicWrapper.id = 'comicwrapper';
        if (this.config.limitComicHeight > 0)
        {
            comicWrapper.style.maxHeight = this.config.limitComicHeight + "px";
            // If sunday, its probably 3 columns. So reduce maxHeight 
            // to comic size / 3 to make it more readable
            if (this.today == 0) {
                comicWrapper.style.maxHeight = (this.sunday_height) + "px";
            }
        }
        comicWrapper.innerHTML = this.text;

        var img = document.createElement('img');
        img.id = "comiccontent";
        img.src = this.img;
        img.setAttribute("style", "-webkit-filter: " +
                                (this.config.grayScale && this.today > 0 ? "grayscale(100%) " : "") +
                                (this.config.invertColors && this.today > 0 ? "invert(100%) " : "") +
                                ";")
        comicWrapper.appendChild(img);
        wrapper.appendChild(comicWrapper);
        return wrapper;
    },

    socketNotificationReceived: function(notification, payload) {
        if (notification === "COMIC") {
            Log.log(this.name + "Got new comic " + payload.text + "notification: " + notification);
            this.text = '';
            this.img = payload.url;
            this.today = payload.day;
            this.sunday_height = Math.ceil(payload.height/3);
            this.updateDom();
        }
    },

    scrollComic: function() {
        console.log("Scrolling now");
        var scrollable = document.getElementById("comiccontent");

        var height = scrollable.naturalHeight;
        var comicHeightLimit = (this.today == 0) ? this.sunday_height : this.config.limitComicHeight;
        var top = 0;
          
        if (comicHeightLimit > 0 && height > comicHeightLimit)
        {
            var currentHeight = this.scrollProgress * - comicHeightLimit * this.config.scrollRatio;
            var maxHeight = comicHeightLimit - height;
            top = Math.max(currentHeight, maxHeight);
        }
        scrollable.style.top = top + "px";
        scrollable.style.height = height + "px";

        if (top == comicHeightLimit - height)
        {
            this.scrollProgress = -1;
        }

        this.scrollProgress += 1;
    },
});