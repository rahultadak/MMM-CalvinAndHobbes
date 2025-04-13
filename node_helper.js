const axios = require('axios');
const cheerio = require('cheerio');
const probe = require('probe-image-size');

const base = 'https://www.gocomics.com/calvinandhobbes/';
var today_url = '';

var NodeHelper = require("node_helper");
module.exports = NodeHelper.create({

    start: function () {
        console.log("Starting node helper: " + this.name);

    },

    socketNotificationReceived: function(notification, payload) {
        if(notification === "GET_COMIC") {
            console.log("Got notification to get the new comic");
            this.sendComic();
        }
    },

    fetchValidComicLinkForToday: function () {
        return new Promise(function (resolve, reject) {
            console.log("Creating comic link for today");
            var today = new Date();
            var year = today.getFullYear();
            var month = today.getMonth() + 1;
            month = (month < 10 ? '0' : '') + month;
            var date = (today.getDate() < 10 ? '0' : '') + today.getDate();
            today_url = base + year + '/' + month + '/' + date;
            console.log('Link for today: ' + today_url);
            resolve(today_url);
        });
    },

    getComicLink: function (html) {
        return new Promise( function (resolve, reject) {
            console.log("Trying to get comic link from DOM");
            const $ = cheerio.load(html);
            $('div[class^="ShowFiveFavorites"]').remove();
            try {
                $('div[class^="Comic_comic"] button img').each(function (i, elem) {
                  console.log("Found IMG SRC:", $(elem).attr('src'));
                });
                const comicUrl = $('div[class^="Comic_comic"] button img').attr('src');
>>>>>>> 202d421 (Fixed the image getter to prevent it from pulling images we didn't want that were using the same DOM class name)
                    console.log('Comic URL: ' + comicUrl);
                    if (comicUrl != null) {
                        resolve(comicUrl);
                    } else {
                        throw Error("Could not find the right Element");
                    }
            } catch (e) {
                reject(e);
            }
        });
    },

    sendComicNotification: function (comicLink) {
        var comic = {};

        probe(comicLink)
        .then(result => {
            comic = result;
            comic.day = new Date().getDay();
        })
        .then( () => {
            console.log("Sending new comic");
            this.sendSocketNotification('COMIC', comic);
        });
    },

    sendComic: async function () {
        try {
            var url = await this.fetchValidComicLinkForToday();
            var html = await axios.get(url, {
                headers: {
                    'Cache-Control': 'no-cache',
                    'Pragma': 'no-cache',
                    'User-Agent': 'Mozilla/5.0 (Macintosh; Intel Mac OS X 10_15_7) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/134.0.0.0 Safari/537.36 Edg/134.0.0.0',
                },
	    });
            var comicUrl = await this.getComicLink(html.data);
            this.sendComicNotification(comicUrl);
        }
        catch (e) {
            console.error(e);
        }
    }
});
