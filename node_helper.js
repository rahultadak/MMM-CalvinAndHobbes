const axios = require('axios');
const cheerio = require('cheerio');
const host = 'gocomics.com';
const comicPath = '/calvinandhobbes/';
const base = 'https://www.gocomics.com/calvinandhobbes/';
var today_url = '';

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

    fetchValidComicLinkForToday: function () {
        return new Promise(function (resolve, reject) {
            var today = new Date();
            var year = today.getUTCFullYear();
            var month = today.getUTCMonth() + 1;
            month = (month < 10 ? '0' : '') + month;
            var date = (today.getUTCDate() < 10 ? '0' : '') + today.getUTCDate();
            today_url = base + year + '/' + month + '/' + date;

            // Reject if some sort of error
            console.log(today_url);
            resolve(today_url);
        });
    },

    getComicLink: function (html) {
        return new Promise( function (resolve, reject) {
            console.log("Trying to get comic link");
            const $ = cheerio.load(html);
            try {
                // console.log($('div.comic.container'));
                $('div.comic.container').each(function () {
                    console.log("Inside each loop" + this);
                    var data_url = $(this).attr('data-url');
                    if (data_url === today_url) {
                        var comicUrl = $(this).attr('data-image');
                        console.log("Found data  url: " + $(this).attr('data-url'));
                        console.log("Found comic url: " + comicUrl);

                        resolve(comicUrl);
                    }
                    else {
                        throw Error("Could not find the right Element");
                    }
                });
            }
            catch (e) {
                reject(e);
            }
        });
    },

    sendComicNotification: function (in_text) {
        comic = {text: in_text};
        console.log("Sending new comic");
        this.sendSocketNotification('COMIC', comic);
    },

    sendComic: async function () {
        try {
            var url = await this.fetchValidComicLinkForToday();
            var html = await axios.get(url);
            var comicUrl = await this.getComicLink(html.data);
            console.log(comicUrl);
            this.sendComicNotification(comicUrl);
        }
        catch (e) {
            console.error(e);
        }
    }
});